import { getPortfolioData } from '../../server/db';
import { list } from '@vercel/blob';

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  try {
    // 1. First priority: Check authoritative single source of truth in Postgres
    const portfolio = await getPortfolioData();
    const heroVideoUrl = portfolio?.data?.personalInfo?.heroVideoUrl;

    if (heroVideoUrl && heroVideoUrl.trim().length > 0) {
      return res.status(200).json({
        url: heroVideoUrl.trim(),
        pathname: 'hero-video',
        source: 'database',
      });
    }

    // 2. Second: Check Vercel Blob store if token is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { blobs } = await list({ prefix: 'hero-videos/', limit: 1 });
      if (blobs && blobs.length > 0) {
        return res.status(200).json({
          url: blobs[0].url,
          pathname: blobs[0].pathname,
          uploadedAt: blobs[0].uploadedAt,
          size: blobs[0].size,
          source: 'blob',
        });
      }
    }

    return res.status(200).json({ url: null, pathname: null });
  } catch (err: any) {
    return res.status(200).json({ url: null, pathname: null, error: err.message });
  }
}
