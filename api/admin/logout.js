export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.setHeader(
    'Set-Cookie',
    'samya_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  );

  return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
}
