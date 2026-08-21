import { del } from '@vercel/blob';
import { savePortfolioData } from '../../server/db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body || {};

  try {
    if (url && process.env.BLOB_READ_WRITE_TOKEN && url.includes('blob.vercel-storage.com')) {
      await del(url).catch(() => {});
    }

    // Always clear from Postgres database as well
    await savePortfolioData({
      personalInfo: {
        heroVideoUrl: '',
      } as any,
    });

    return res.status(200).json({
      success: true,
      message: 'Video deleted from Blob and cleared from cloud database.',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to delete video.',
    });
  }
}
