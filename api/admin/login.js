import {
  checkRateLimit,
  recordLoginAttempt,
  verifyCredentials,
  createSessionToken,
  getAuthenticatedUser
} from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Check session status
  if (req.method === 'GET') {
    const user = getAuthenticatedUser(req);
    if (user) {
      return res.status(200).json({ authenticated: true, user: user.username });
    }
    return res.status(200).json({ authenticated: false });
  }

  // POST: Login
  if (req.method === 'POST') {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return res.status(429).json({ error: rateCheck.message });
    }

    const { username, password } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    if (!verifyCredentials(username, password)) {
      recordLoginAttempt(ip, false);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    recordLoginAttempt(ip, true);
    const token = createSessionToken(username);

    const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
    const cookieFlags = [
      `samya_admin_session=${token}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      'Max-Age=43200', // 12 hours
      isProd ? 'Secure' : ''
    ].filter(Boolean).join('; ');

    res.setHeader('Set-Cookie', cookieFlags);

    return res.status(200).json({
      status: 'success',
      message: 'Authenticated successfully',
      user: username,
      token // Also returned for client fallback header (X-Admin-Token)
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
