import { db } from '../server/db';

export default async function handler(req: any, res: any) {
  // Anti-caching headers to guarantee fresh data across all devices
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

  // 1. GET: Fetch latest portfolio data from Cloud Database
  if (req.method === 'GET') {
    try {
      const result = await db.getCloudData();
      return res.status(200).json({
        success: true,
        data: result.data,
        provider: result.provider,
        synced: true,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Error fetching portfolio cloud data:', err);
      // Fallback to in-memory/default data
      return res.status(200).json({
        success: true,
        data: db.getData(),
        provider: 'fallback',
        synced: false,
        error: err.message,
      });
    }
  }

  // 2. POST / PUT / PATCH: Save portfolio data to Cloud Database
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = req.body || {};
      const isReset = body.action === 'reset' || req.query?.action === 'reset';

      // Check if this is a reset request
      if (isReset) {
        const resetResult = await db.resetCloudData();
        return res.status(200).json({
          success: true,
          data: resetResult.data,
          provider: resetResult.provider,
          message: 'Portfolio successfully reset to default verified data in cloud database.',
        });
      }

      const payload = body.data || body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Invalid payload: expected portfolio data object.',
        });
      }

      // Owner Admin Authorization Check
      const clientPassword =
        body.password ||
        req.headers['x-admin-password'] ||
        (req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ', '').trim() : '');

      const configuredOwnerPassword = process.env.OWNER_PASSWORD || process.env.ADMIN_PASSWORD;

      if (configuredOwnerPassword) {
        if (!clientPassword || clientPassword !== configuredOwnerPassword) {
          return res.status(401).json({
            success: false,
            message: 'Unauthorized: Valid owner password is required to publish portfolio customizations.',
          });
        }
      }

      // Persist to Cloud Database
      const saveResult = await db.saveCloudData(payload);

      return res.status(200).json({
        success: true,
        data: saveResult.data,
        provider: saveResult.provider,
        message: 'Portfolio customizations saved to cloud database and synchronized live across all devices!',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Error updating portfolio cloud data:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to persist portfolio customizations to cloud database.',
      });
    }
  }

  // 3. DELETE: Reset database
  if (req.method === 'DELETE') {
    try {
      const resetResult = await db.resetCloudData();
      return res.status(200).json({
        success: true,
        data: resetResult.data,
        provider: resetResult.provider,
        message: 'Portfolio reset to default state in cloud database.',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
