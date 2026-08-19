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

  const { email, password } = req.body || {};
  const cleanEmail = (email || '').trim().toLowerCase();

  const ALLOWED_OWNER_EMAILS = [
    'vedantbhagat108@gmail.com',
    'vedantbhagat108-bit@gmail.com',
    'vedantbhagat108',
    'vedantrajubhagat_it24a10_055@dtu.ac.in',
  ];

  if (!ALLOWED_OWNER_EMAILS.includes(cleanEmail)) {
    return res.status(403).json({
      success: false,
      authenticated: false,
      message: 'Access Denied: Only the portfolio owner is authorized to customize this site.',
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      authenticated: false,
      message: 'Owner password is required.',
    });
  }

  const expectedPass = process.env.OWNER_PASSWORD || process.env.ADMIN_PASSWORD;

  // If an environment password is configured on Vercel, verify it
  if (expectedPass && password !== expectedPass) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      message: 'Incorrect Owner Password.',
    });
  }

  return res.status(200).json({
    success: true,
    authenticated: true,
    email: 'vedantbhagat108@gmail.com',
    ownerName: 'Vedant Bhagat',
    message: 'Owner verification successful. Welcome Vedant Bhagat!',
  });
}
