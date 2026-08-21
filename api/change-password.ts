import { updateAdminPassword } from '../server/db';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Admin-Password'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { oldPassword, currentPassword, newPassword } = req.body || {};
  const existingPassword = oldPassword || currentPassword;

  if (!existingPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Both current password and new password are required.',
    });
  }

  if (newPassword.trim().length < 4) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 4 characters long.',
    });
  }

  try {
    const result = await updateAdminPassword(existingPassword, newPassword);
    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message || 'Password update failed.',
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message || 'Password successfully updated and securely persisted in Neon/Postgres.',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error while updating password.',
    });
  }
}
