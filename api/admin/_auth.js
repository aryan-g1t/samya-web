import crypto from 'crypto';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'samya-complexion-discovery-ultra-secret-key-2026';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Samya@2026';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// In-memory rate limiting map (IP -> { attempts, lockoutUntil })
const rateLimitMap = new Map();

export function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) return { allowed: true };

  if (record.lockoutUntil && record.lockoutUntil > now) {
    const remainingSec = Math.ceil((record.lockoutUntil - now) / 1000);
    return { allowed: false, message: `Too many failed attempts. Locked out for ${remainingSec} seconds.` };
  }

  if (record.lockoutUntil && record.lockoutUntil <= now) {
    rateLimitMap.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordLoginAttempt(ip, success) {
  const now = Date.now();
  if (success) {
    rateLimitMap.delete(ip);
    return;
  }

  const record = rateLimitMap.get(ip) || { attempts: 0 };
  record.attempts += 1;

  if (record.attempts >= 5) {
    record.lockoutUntil = now + 15 * 60 * 1000; // 15 min lockout
  }

  rateLimitMap.set(ip, record);
}

export function verifyCredentials(username, password) {
  if (typeof username !== 'string' || typeof password !== 'string') return false;

  const validUser = username.trim() === ADMIN_USERNAME;
  const validPass = password === ADMIN_PASSWORD;

  return validUser && validPass;
}

export function createSessionToken(username) {
  const timestamp = Date.now();
  const payload = `${username}.${timestamp}`;
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [username, timestampStr, hmac] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return null;

  // Check expiration
  if (Date.now() - timestamp > SESSION_TTL_MS) return null;

  const payload = `${username}.${timestamp}`;
  const expectedHmac = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');

  // Timing safe compare
  if (hmac.length !== expectedHmac.length) return null;
  const match = crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
  if (!match) return null;

  return { username, timestamp };
}

export function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;

  if (rc) {
    rc.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      const name = parts.shift()?.trim();
      if (name) {
        list[name] = decodeURIComponent(parts.join('='));
      }
    });
  }

  return list;
}

export function getAuthenticatedUser(req) {
  const cookies = parseCookies(req);
  const sessionToken = cookies['samya_admin_session'] || req.headers['x-admin-token'];
  return verifySessionToken(sessionToken);
}
