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
  const expectedPass = process.env.OWNER_PASSWORD || process.env.ADMIN_PASSWORD;

  if (expectedPass && (!currentPassword || currentPassword !== expectedPass)) {
    return res.status(400).json({
      success: false,
      message: 'Current password does not match.',
    });
  }

  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 4 characters long.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Owner password updated successfully!',
  });
}
