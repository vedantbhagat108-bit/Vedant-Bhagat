import { changeOwnerPassword } from '../server/db.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Both currentPassword and newPassword are required.',
    });
  }

  try {
    const result = await changeOwnerPassword(currentPassword, newPassword);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err: any) {
    console.error('Error changing owner password:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to change password.',
    });
  }
}
