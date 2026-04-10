/**
 * API Configuration — Production-Ready Mobile Client
 * Set EXPO_PUBLIC_API_URL in .env.production before building
 */

import Constants from 'expo-constants';

const env = Constants.expoConfig?.extra || {};

export const API_CONFIG = {
  // Configure via EXPO_PUBLIC_API_URL environment variable
  // Development: http://localhost:5000
  // Production: https://your-api-domain.com
  BASE_URL: env.EXPO_PUBLIC_API_URL || 'http://localhost:5000',
  TIMEOUT_MS: 15000,
};

export function getApiUrl(endpoint) {
  const base = API_CONFIG.BASE_URL.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  const { token, ...rest } = options;

  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await response.json();
    if (!response.ok) throw new ApiError(data.error || `Error ${response.status}`, response.status, data.code);
    return data;
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') throw new ApiError('Request timed out', 408, 'TIMEOUT');
    throw err;
  }
}

// ─────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password } }),
  register: (email, password, name) =>
    request('/api/auth/register', { method: 'POST', body: { email, password, name } }),
  getMe: (token) => request('/api/auth/me', { method: 'GET', token }),
};

// ─────────────────────────────────────────
// PATIENTS
// ─────────────────────────────────────────
export const patientsApi = {
  list: (token, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/patients${qs ? '?' + qs : ''}`, { method: 'GET', token });
  },
  get: (token, id) => request(`/api/patients/${id}`, { method: 'GET', token }),
  create: (token, data) => request('/api/patients', { method: 'POST', body: data, token }),
  update: (token, id, data) => request(`/api/patients/${id}`, { method: 'PUT', body: data, token }),
  delete: (token, id) => request(`/api/patients/${id}`, { method: 'DELETE', token }),
};

// ─────────────────────────────────────────
// ASSESSMENTS
// ─────────────────────────────────────────
export const assessmentsApi = {
  create: (token, data) => request('/api/assessments', { method: 'POST', body: data, token }),
  getEligibility: (token, id) => request(`/api/assessments/${id}/eligibility`, { method: 'GET', token }),
};

// ─────────────────────────────────────────
// ELIGIBILITY
// ─────────────────────────────────────────
export const eligibilityApi = {
  checkTPA: (token, data) => request('/api/eligibility/tPA', { method: 'POST', body: data, token }),
  checkEVT: (token, data) => request('/api/eligibility/EVT', { method: 'POST', body: data, token }),
  getPathway: (token, data) => request('/api/management-pathway', { method: 'POST', body: data, token }),
};

// ─────────────────────────────────────────
// TOKEN MANAGEMENT
// ─────────────────────────────────────────
let _token = null;
export const setToken = (t) => { _token = t; };
export const getToken = () => _token;
export const clearToken = () => { _token = null; };
