import { getPortfolioData } from '../../server/db';

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  try {
    const portfolio = await getPortfolioData();
    const videoUrl = portfolio?.data?.personalInfo?.heroVideoUrl;

    if (videoUrl && videoUrl.trim().length > 0) {
      return res.status(200).json({
        exists: true,
        url: videoUrl.trim(),
      });
    }

    return res.status(200).json({ exists: false, url: null });
  } catch {
    return res.status(200).json({ exists: false, url: null });
  }
}
