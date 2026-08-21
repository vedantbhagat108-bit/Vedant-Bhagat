import { savePortfolioData } from '../../server/db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body || {};
  if (!url) {
    return res.status(400).json({ error: 'Video URL is required.' });
  }

  try {
    const updated = await savePortfolioData({
      personalInfo: {
        heroVideoUrl: url,
      } as any,
    });

    return res.status(200).json({
      success: true,
      url,
      updatedAt: updated.updatedAt,
      message: 'Active hero video registered in Postgres cloud database',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to set active video in database.',
    });
  }
}
