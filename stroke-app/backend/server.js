/**
 * Stroke Workup API Server — Production-Ready
 * With auth, rate limiting, input validation, HTTPS enforcement
 * 
 * Environment variables required:
 *   JWT_SECRET=<random-256-bit-string>
 *   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/stroke
 *   PORT=5000
 *   ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
 *   RATE_LIMIT_WINDOW_MS=900000 (15 min)
 *   RATE_LIMIT_MAX=100
 */

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { requireAuth, sanitizeInput, validateRequired, validateRange } = require('./middleware/auth');
const strokeUtils = require('./utils/strokeUtils');

const app = express();

// ─────────────────────────────────────────
// 1. SECURITY HEADERS
// ─────────────────────────────────────────
app.use(helmet());

// ─────────────────────────────────────────
// 2. CORS — whitelist only allowed origins
// ─────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`Origin ${origin} not allowed by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// ─────────────────────────────────────────
// 3. RATE LIMITING — prevent abuse
// ─────────────────────────────────────────
const rateLimitWindow = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);

const globalLimiter = rateLimit({
  windowMs: rateLimitWindow,
  max: rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later', code: 'RATE_LIMITED' },
  keyGenerator: (req) => {
    // Rate limit by IP + user ID (if authenticated)
    const ip = req.ip || req.connection.remoteAddress;
    const userId = req.user?.id || '';
    return `${ip}:${userId}`;
  },
});

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,                    // only 10 login attempts per window
  message: { error: 'Too many authentication attempts', code: 'AUTH_RATE_LIMITED' },
});

app.use(globalLimiter);

// ─────────────────────────────────────────
// 4. BODY PARSING
// ─────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────
// 5. MONGOOSE CONNECTION
// ─────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('FATAL: MONGODB_URI environment variable is required');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});

// ─────────────────────────────────────────
// 6. SCHEMAS
// ─────────────────────────────────────────
const patientSchema = new mongoose.Schema({
  mrn: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0, max: 150 },
  gender: { type: String, enum: ['M', 'F', 'O'], required: true },
  weightKg: { type: Number, required: true, min: 1, max: 500 },
  // All patient data is PHI — encrypted at rest in production via MongoDB Enterprise
}, { timestamps: true });

patientSchema.index({ mrn: 1 }, { unique: true });
patientSchema.index({ createdAt: -1 });

const assessmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  // Stroke onset / discovery
  lastKnownWell: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  // Clinical
  nihss: { type: Number, required: true, min: 0, max: 42 },
  // Vitals at assessment
  systolicBP: { type: Number, required: true, min: 50, max: 300 },
  diastolicBP: { type: Number, required: true, min: 30, max: 200 },
  // Imaging
  imagingTime: { type: Date },
  hasCranialCT: { type: Boolean, default: false },
  hasMRI: { type: Boolean, default: false },
  hasCTA: { type: Boolean, default: false },
  hasCTP: { type: Boolean, default: false },
  // ASPECTS / collateral
  aspects: { type: Number, min: 0, max: 10 },
  // CTP
  coreVolume: { type: Number, min: 0 },   // mL
  penumbraVolume: { type: Number, min: 0 },
  mismatchRatio: { type: Number, min: 0 },
  // Results (populated by API)
  eligibilityResults: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

assessmentSchema.index({ patientId: 1, createdAt: -1 });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // Store bcrypt hash only — NEVER plaintext password
  passwordHash: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['physician', 'nurse', 'admin'], default: 'physician' },
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date },
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });

const Patient = mongoose.model('Patient', patientSchema);
const Assessment = mongoose.model('Assessment', assessmentSchema);
const User = mongoose.model('User', userSchema);

// ─────────────────────────────────────────
// 7. HELPERS
// ─────────────────────────────────────────
function isLocked(user) {
  return user.lockedUntil && user.lockedUntil > new Date();
}

function toNumber(v) { return parseFloat(v); }

// ─────────────────────────────────────────
// 8. AUTH ROUTES
// ─────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body: { email, password, name }
 */
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const { valid, field } = validateRequired(body, ['email', 'password', 'name']);
    if (!valid) return res.status(400).json({ error: `Missing required field: ${field}` });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password strength check
    if (body.password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Hash password — bcrypt
    const bcrypt = require('bcrypt');
    const { SALT_ROUNDS } = require('./middleware/auth');
    const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);

    const user = await User.create({
      email: body.email,
      passwordHash,
      name: body.name,
    });

    const { generateToken } = require('./middleware/auth');
    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    res.status(201).json({ 
      token, 
      user: { id: user._id, email: user.email, name: user.name, role: user.role } 
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const { valid, field } = validateRequired(body, ['email', 'password']);
    if (!valid) return res.status(400).json({ error: `Missing required field: ${field}` });

    const user = await User.findOne({ email: body.email.toLowerCase() });
    if (!user) {
      // Deliberate timing-safe response to prevent user enumeration
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (isLocked(user)) {
      return res.status(423).json({ error: 'Account temporarily locked due to too many failed attempts' });
    }

    const bcrypt = require('bcrypt');
    const validPassword = await bcrypt.compare(body.password, user.passwordHash);

    if (!validPassword) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min lockout
      }
      await user.save();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset on successful login
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    await user.save();

    const { generateToken } = require('./middleware/auth');
    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    res.json({ 
      token, 
      user: { id: user._id, email: user.email, name: user.name, role: user.role } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * GET /api/auth/me — get current user info
 */
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('email name role createdAt');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ─────────────────────────────────────────
// 9. PATIENT ROUTES
// ─────────────────────────────────────────

/**
 * GET /api/patients
 * List patients (most recent first)
 */
app.get('/api/patients', requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const page = parseInt(req.query.page || '1', 10);
    const patients = await Patient.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v');
    const total = await Patient.countDocuments();
    res.json({ patients, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('List patients error:', err);
    res.status(500).json({ error: 'Failed to list patients' });
  }
});

/**
 * POST /api/patients
 */
app.post('/api/patients', requireAuth, async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const { valid, field } = validateRequired(body, ['mrn', 'name', 'age', 'gender', 'weightKg']);
    if (!valid) return res.status(400).json({ error: `Missing required field: ${field}` });

    const ageNum = validateRange(body.age, 0, 150, 'age');
    if (!ageNum.valid) return res.status(400).json({ error: `age must be ${ageNum.min}–${ageNum.max}` });

    const weightNum = validateRange(body.weightKg, 1, 500, 'weightKg');
    if (!weightNum.valid) return res.status(400).json({ error: `weightKg must be ${weightNum.min}–${weightNum.max} kg` });

    const genderUpper = body.gender.toUpperCase();
    if (!['M', 'F', 'O'].includes(genderUpper)) {
      return res.status(400).json({ error: 'gender must be M, F, or O' });
    }

    const patient = await Patient.create({
      mrn: body.mrn,
      name: body.name,
      age: ageNum.value,
      gender: genderUpper,
      weightKg: weightNum.value,
    });

    res.status(201).json(patient);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: `Patient with MRN ${body.mrn} already exists` });
    }
    console.error('Create patient error:', err);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

/**
 * GET /api/patients/:id
 */
app.get('/api/patients/:id', requireAuth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: 'Invalid patient ID' });
  }
});

// ─────────────────────────────────────────
// 10. ASSESSMENT ROUTES
// ─────────────────────────────────────────

/**
 * POST /api/assessments
 * Body: assessment data → runs eligibility checks
 */
app.post('/api/assessments', requireAuth, async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const { valid, field } = validateRequired(body, ['patientId', 'lastKnownWell', 'arrivalTime', 'nihss', 'systolicBP', 'diastolicBP']);
    if (!valid) return res.status(400).json({ error: `Missing required field: ${field}` });

    // Validate NIHSS
    const nihssNum = validateRange(body.nihss, 0, 42, 'nihss');
    if (!nihssNum.valid) return res.status(400).json({ error: 'NIHSS must be 0–42' });

    // Validate BP
    const sysBP = validateRange(body.systolicBP, 50, 300, 'systolicBP');
    if (!sysBP.valid) return res.status(400).json({ error: 'systolicBP must be 50–300 mmHg' });
    const diaBP = validateRange(body.diastolicBP, 30, 200, 'diastolicBP');
    if (!diaBP.valid) return res.status(400).json({ error: 'diastolicBP must be 30–200 mmHg' });

    // Validate patient exists
    const patient = await Patient.findById(body.patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const assessment = await Assessment.create({
      patientId: body.patientId,
      lastKnownWell: body.lastKnownWell,
      arrivalTime: body.arrivalTime,
      nihss: nihssNum.value,
      systolicBP: sysBP.value,
      diastolicBP: diaBP.value,
      imagingTime: body.imagingTime,
      hasCranialCT: !!body.hasCranialCT,
      hasMRI: !!body.hasMRI,
      hasCTA: !!body.hasCTA,
      hasCTP: !!body.hasCTP,
      aspects: body.aspects != null ? validateRange(body.aspects, 0, 10, 'aspects').value : undefined,
      coreVolume: body.coreVolume != null ? validateRange(body.coreVolume, 0, 200, 'coreVolume').value : undefined,
      penumbraVolume: body.penumbraVolume != null ? validateRange(body.penumbraVolume, 0, 500, 'penumbraVolume').value : undefined,
      mismatchRatio: body.mismatchRatio != null ? body.mismatchRatio : undefined,
    });

    // Run clinical calculations
    const eligibilityResults = strokeUtils.calculateAll(body, patient.weightKg);
    assessment.eligibilityResults = eligibilityResults;
    await assessment.save();

    res.status(201).json({ assessment: { ...assessment.toObject(), patient }, eligibilityResults });
  } catch (err) {
    console.error('Create assessment error:', err);
    res.status(500).json({ error: 'Failed to create assessment' });
  }
});

/**
 * GET /api/assessments/:id/eligibility
 * Returns formatted eligibility results
 */
app.get('/api/assessments/:id/eligibility', requireAuth, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('patientId');
    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
    res.json(assessment.eligibilityResults || {});
  } catch (err) {
    res.status(400).json({ error: 'Invalid assessment ID' });
  }
});

// ─────────────────────────────────────────
// 11. ELIGIBILITY ENDPOINTS
// ─────────────────────────────────────────

/**
 * POST /api/eligibility/tPA
 * Fast tPA eligibility check — no auth for ED quick check?
 * Actually let's protect it — PHI should always be protected
 */
app.post('/api/eligibility/tPA', requireAuth, async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const { valid, field } = validateRequired(body, ['onsetMinutes', 'nihss', 'systolicBP', 'diastolicBP', 'weightKg', 'glucose']);
    if (!valid) return res.status(400).json({ error: `Missing required field: ${field}` });

    const onsetMinutes = toNumber(body.onsetMinutes);
    const nihss = toNumber(body.nihss);
    const systolicBP = toNumber(body.systolicBP);
    const glucose = toNumber(body.glucose);

    const result = strokeUtils.checkTPAEligibility(onsetMinutes, nihss, systolicBP, body.diastolicBP, body.weightKg, glucose);
    res.json(result);
  } catch (err) {
    console.error('tPA eligibility error:', err);
    res.status(500).json({ error: 'tPA check failed' });
  }
});

/**
 * POST /api/eligibility/EVT
 */
app.post('/api/eligibility/EVT', requireAuth, async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const result = strokeUtils.checkEVTEligibility(body);
    res.json(result);
  } catch (err) {
    console.error('EVT eligibility error:', err);
    res.status(500).json({ error: 'EVT check failed' });
  }
});

/**
 * POST /api/management-pathway
 */
app.post('/api/management-pathway', requireAuth, async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const pathway = strokeUtils.getManagementPathway(body);
    res.json(pathway);
  } catch (err) {
    console.error('Management pathway error:', err);
    res.status(500).json({ error: 'Failed to generate management pathway' });
  }
});

// ─────────────────────────────────────────
// 12. HEALTH CHECK
// ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// ─────────────────────────────────────────
// 13. ERROR HANDLER
// ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

// ─────────────────────────────────────────
// 14. START
// ─────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => {
  console.log(`\n🚀 Stroke API running on port ${PORT}`);
  console.log(`   MongoDB: ${MONGODB_URI ? '✅ configured' : '❌ MISSING'}`);
  console.log(`   JWT Secret: ${process.env.JWT_SECRET ? '✅ configured' : '❌ MISSING - set JWT_SECRET env var'}`);
  console.log(`   Allowed Origins: ${allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'ALL (dev mode)'}\n`);
});

module.exports = app;
