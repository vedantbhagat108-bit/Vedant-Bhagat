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

  if (process.env.BLOB_READ_WRITE_TOKEN) {
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
        success: true,
        url: blob.url,
        message: 'Video successfully uploaded and saved to cloud database.',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(400).json({
    success: false,
    message: 'Server video uploads in production require BLOB_READ_WRITE_TOKEN.',
  });
}
