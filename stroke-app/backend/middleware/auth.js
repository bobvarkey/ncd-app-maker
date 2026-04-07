/**
 * Authentication & Security Middleware — Stroke App
 * Replaces insecure hardcoded JWT secret with proper env-based verification
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Load secret from environment (fail fast if missing)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is required');
}
const JWT_EXPIRY = process.env.JWT_EXPIRY || '8h';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

// Use crypto.randomBytes for salt — no need for bcrypt's built-in salt gen
const SALT_ROUNDS = BCRYPT_ROUNDS;

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Middleware: require valid JWT
 * Extracts Bearer token from Authorization header
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(\S+)$/i);
  
  if (!match) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'NO_TOKEN'
    });
  }
  
  const token = match[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    });
  }
  
  req.user = decoded;
  next();
}

/**
 * Middleware: optional auth — attaches user if token present but doesn't require it
 */
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(\S+)$/i);
  
  if (match) {
    const decoded = verifyToken(match[1]);
    if (decoded) req.user = decoded;
  }
  
  next();
}

/**
 * Input sanitization — prevent NoSQL injection into MongoDB
 * Strips $ and . from object keys that could modify queries
 */
function sanitizeInput(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeInput);
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Reject keys starting with $ or containing .
    if (typeof key === 'string' && (key.startsWith('$') || key.includes('.'))) {
      continue; // skip malicious-looking keys
    }
    sanitized[key] = sanitizeInput(value);
  }
  return sanitized;
}

/**
 * Validate object has required string fields (prevent empty/injection inputs)
 */
function validateRequired(obj, fields) {
  for (const field of fields) {
    if (!obj[field] || typeof obj[field] !== 'string' || obj[field].trim() === '') {
      return { valid: false, field };
    }
    // Trim whitespace
    obj[field] = obj[field].trim();
  }
  return { valid: true };
}

/**
 * Validate numeric range
 */
function validateRange(value, min, max, fieldName) {
  const num = parseFloat(value);
  if (isNaN(num) || num < min || num > max) {
    return { valid: false, field: fieldName, min, max };
  }
  return { valid: true, value: num };
}

/**
 * Generate a secure random token (for password resets, etc.)
 */
function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

module.exports = {
  generateToken,
  verifyToken,
  requireAuth,
  optionalAuth,
  sanitizeInput,
  validateRequired,
  validateRange,
  generateSecureToken,
  SALT_ROUNDS
};
