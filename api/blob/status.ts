export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const isConfigured = !!(token && token.trim().length > 10 && !token.includes('MY_'));

  return res.status(200).json({
    configured: isConfigured,
    message: isConfigured
      ? 'Vercel Blob Storage is active and connected.'
      : 'Vercel Blob Storage is not configured. Set BLOB_READ_WRITE_TOKEN in Vercel environment variables.',
  });
}
