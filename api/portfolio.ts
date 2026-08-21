import {
  getPortfolioData,
  savePortfolioData,
  resetPortfolioData,
  debugEnvKeys,
  PortfolioDatabaseSchema,
} from '../server/db';

export default async function handler(req: any, res: any) {
  // Strict anti-caching headers for real-time cross-device data synchronization
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,PATCH,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Admin-Password'
  );
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
    // TEMPORARY DEBUG — remove after diagnosing
  if (req.query?.debug === '1') {
    return res.status(200).json({ envKeys: debugEnvKeys() });
  }

  // 1. GET: Fetch latest portfolio data from single persistent Neon/Postgres table
  if (req.method === 'GET') {
    try {
      const result = await getPortfolioData();
      return res.status(200).json({
        success: true,
        data: result.data,
        provider: result.provider,
        updatedAt: result.updatedAt,
        synced: result.synced,
      });
    } catch (err: any) {
      console.error('Error fetching portfolio data from database:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Database read failure',
      });
    }
  }

  // 2. Helper to verify owner authorization for write operations
  const verifyOwnerAuthorization = (req: any): boolean => {
    const configuredOwnerPassword = process.env.OWNER_PASSWORD || process.env.ADMIN_PASSWORD;

    // In production, OWNER_PASSWORD must be defined
    if (!configuredOwnerPassword) {
      return false;
    }

    const clientPassword =
      req.body?.password ||
      req.headers['x-admin-password'] ||
      (req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ', '').trim() : '');

    return clientPassword === configuredOwnerPassword;
  };

  // 3. POST / PUT / PATCH: Save portfolio data or reset
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const configuredOwnerPassword = process.env.OWNER_PASSWORD || process.env.ADMIN_PASSWORD;

    // Secure authentication check
    if (!configuredOwnerPassword) {
      return res.status(500).json({
        success: false,
        message: 'Server Configuration Error: OWNER_PASSWORD environment variable is not configured on the server.',
      });
    }

    if (!verifyOwnerAuthorization(req)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Valid owner password is required to modify portfolio data.',
      });
    }

    const body = req.body || {};
    const isReset = body.action === 'reset' || req.query?.action === 'reset';

    if (isReset) {
      try {
        const resetResult = await resetPortfolioData();
        return res.status(200).json({
          success: true,
          data: resetResult.data,
          provider: resetResult.provider,
          updatedAt: resetResult.updatedAt,
          synced: resetResult.synced,
          message: 'Portfolio successfully reset to default data in Postgres.',
        });
      } catch (err: any) {
        console.error('Error resetting portfolio in database:', err);
        return res.status(500).json({
          success: false,
          message: err.message || 'Database reset failed',
        });
      }
    }

    const payload = body.data || body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload: expected portfolio data object.',
      });
    }

    try {
      const savedResult = await savePortfolioData(payload as Partial<PortfolioDatabaseSchema>);
      return res.status(200).json({
        success: true,
        data: savedResult.data,
        provider: savedResult.provider,
        updatedAt: savedResult.updatedAt,
        synced: savedResult.synced,
        message: 'Portfolio customizations successfully persisted to Neon/Postgres and synchronized across all devices!',
      });
    } catch (err: any) {
      console.error('Error saving portfolio data to database:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to persist portfolio data to database.',
      });
    }
  }

  // 4. DELETE: Reset database to defaults
  if (req.method === 'DELETE') {
    const configuredOwnerPassword = process.env.OWNER_PASSWORD || process.env.ADMIN_PASSWORD;

    if (!configuredOwnerPassword) {
      return res.status(500).json({
        success: false,
        message: 'Server Configuration Error: OWNER_PASSWORD environment variable is not configured on the server.',
      });
    }

    if (!verifyOwnerAuthorization(req)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Valid owner password is required.',
      });
    }

    try {
      const resetResult = await resetPortfolioData();
      return res.status(200).json({
        success: true,
        data: resetResult.data,
        provider: resetResult.provider,
        updatedAt: resetResult.updatedAt,
        synced: resetResult.synced,
        message: 'Portfolio reset to default state in database.',
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to reset portfolio in database.',
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
