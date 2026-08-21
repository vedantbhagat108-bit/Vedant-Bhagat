import { put } from '@vercel/blob';
import { savePortfolioData } from '../../server/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(400).json({
      error: 'Vercel Blob is not configured. Please set BLOB_READ_WRITE_TOKEN in Vercel.',
    });
  }

  try {
    const filename = `hero-videos/hero-intro-${Date.now()}.mp4`;
    const blob = await put(filename, req, {
      access: 'public',
    });

    await savePortfolioData({
      personalInfo: {
        heroVideoUrl: blob.url,
      } as any,
    });

    return res.status(200).json({
      url: blob.url,
      pathname: blob.pathname,
      success: true,
    });
  } catch (err: any) {
    console.error('Blob direct upload failed:', err);
    return res.status(500).json({
      error: err.message || 'Direct upload to Vercel Blob failed',
    });
  }
}
