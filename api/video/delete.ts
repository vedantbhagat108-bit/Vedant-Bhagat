import { savePortfolioData } from '../../server/db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await savePortfolioData({
      personalInfo: {
        heroVideoUrl: '',
      } as any,
    });
    return res.status(200).json({ success: true, message: 'Hero video removed from database' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
