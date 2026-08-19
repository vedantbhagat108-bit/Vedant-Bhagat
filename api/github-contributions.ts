export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const username = (req.query.username as string) || 'vedantbhagat108-bit';
    const response = await fetch(`https://github.com/users/${username}/contributions`);

    if (!response.ok) {
      throw new Error(`GitHub responded with ${response.status}`);
    }

    const html = await response.text();
    const totalMatch = html.match(/([\d,]+)\s+contributions\s+in the last year/i);
    const totalContributions = totalMatch ? totalMatch[1] : '14';

    const dayMatches = html.matchAll(/data-date="([^"]+)"[^>]*data-level="([^"]+)"/g);
    const days: any[] = [];

    for (const match of dayMatches) {
      days.push({
        date: match[1],
        level: parseInt(match[2], 10) || 0,
      });
    }

    return res.status(200).json({
      username,
      totalContributions,
      daysCount: days.length,
      days: days.slice(-30),
    });
  } catch (err: any) {
    return res.status(200).json({
      username: 'vedantbhagat108-bit',
      totalContributions: '14',
      daysCount: 30,
      days: [],
    });
  }
}
