# Stroke Workup App — Deployment Guide

## Quick Start (Local Development)

```bash
cd backend
cp .env.example .env
# Edit .env: set JWT_SECRET and MONGODB_URI
npm install
node server.js

# Mobile app
cd ../mobile
npx expo start
```

---

## Deploy to Production

### Option 1: Railway + MongoDB Atlas (Recommended — ~$5/month)

**1. Backend on Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli
railway login

# Deploy
cd stroke-app/backend
railway init
railway add --variable MONGODB_URI="your-atlas-uri"
railway add --variable JWT_SECRET="$(openssl rand -hex 32)"
railway up
railway domain  # → gives you https://xxx.railway.app
```

**2. Mobile app — Update API URL**
In `mobile/config/api.js`, set:
```js
BASE_URL: 'https://xxx.railway.app'  // your Railway domain
```

**3. Rebuild mobile app**
```bash
cd mobile
EXPO_PUBLIC_API_URL=https://xxx.railway.app eas build --platform ios --profile production
```

---

### Option 2: Docker (Self-hosted VPS)

```bash
cd stroke-app/backend/docker

# Generate secrets
export JWT_SECRET=$(openssl rand -hex 32)
export MONGO_PASSWORD=$(openssl rand -hex 16)
export ALLOWED_ORIGINS=https://yourdomain.com

# Edit docker-compose.yml with your values, then:
docker-compose up -d

# Get SSL certificate (using Certbot)
certbot --nginx -d api.yourdomain.com
```

---

### Option 3: Vercel (Backend) + Railway (quick)

```bash
cd backend
vercel --prod
# Sets EXPO_PUBLIC_API_URL=https://xxx.vercel.app
```

---

## MongoDB Atlas Setup

1. Create free cluster at [cloud.mongodb.com](https://www.mongodb.com/atlas)
2. Create database user: `strokeuser`
3. Whitelist IP `0.0.0.0/0` (for development) or your server IP
4. Copy connection string:
   ```
   mongodb+srv://strokeuser:YOUR_PASSWORD@cluster.mongodb.net/stroke
   ```

---

## Critical Security Checklist

Before going live:

- [ ] `JWT_SECRET` set to random 256-bit value (`openssl rand -hex 32`)
- [ ] `MONGODB_URI` uses authentication
- [ ] `ALLOWED_ORIGINS` set to your mobile app domain only
- [ ] Rate limiting configured
- [ ] HTTPS enforced (nginx or platform SSL)
- [ ] Password policy enforced (bcrypt, min 8 chars)
- [ ] Account lockout after 5 failed login attempts
- [ ] MongoDB IP whitelist restricted
- [ ] No PHI in logs
- [ ] NIHSS validation (0–42)
- [ ] Weight in kg validated (not lbs without conversion)

---

## Docker Production Deployment

```bash
# 1. Generate secrets
export JWT_SECRET=$(openssl rand -hex 32)
export MONGO_PASSWORD=$(openssl rand -hex 16)

# 2. Create SSL directory and add certificates
mkdir -p ssl

# 3. Edit docker-compose.yml with JWT_SECRET, MongoDB settings

# 4. Start
docker-compose up -d

# 5. Check logs
docker-compose logs -f api
```

---

## API Documentation

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/health` | GET | No | Health check |
| `/api/auth/register` | POST | No | Register new user |
| `/api/auth/login` | POST | No | Login → JWT |
| `/api/auth/me` | GET | Yes | Current user info |
| `/api/patients` | GET | Yes | List patients |
| `/api/patients` | POST | Yes | Create patient |
| `/api/patients/:id` | GET | Yes | Get patient |
| `/api/assessments` | POST | Yes | Create assessment |
| `/api/assessments/:id/eligibility` | GET | Yes | Get eligibility |
| `/api/eligibility/tPA` | POST | Yes | Quick tPA check |
| `/api/eligibility/EVT` | POST | Yes | Quick EVT check |
| `/api/management-pathway` | POST | Yes | Get pathway |

---

## File Structure

```
stroke-app/
├── backend/
│   ├── server.js              # Main Express app
│   ├── middleware/
│   │   └── auth.js           # JWT + input sanitization
│   ├── utils/
│   │   └── strokeUtils.js    # Clinical logic (FIXED)
│   ├── models/               # MongoDB schemas
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   └── docker/
│       ├── docker-compose.yml
│       ├── nginx.conf
│       └── ssl/              # Place cert.pem, key.pem here
└── mobile/
    ├── config/
    │   └── api.js           # API client (production-ready)
    ├── screens/
    │   └── AssessmentScreen.js
    ├── components/
    │   ├── EligibilityCard.js
    │   ├── DosageCard.js
    │   └── ManagementPathway.js
    └── package.json
```
