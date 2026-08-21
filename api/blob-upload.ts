import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const body = request.body as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Generate a client token for the browser to upload directly to Vercel Blob
        return {
          allowedContentTypes: [
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'video/x-matroska',
            'video/ogg',
            'video/*',
          ],
          maximumSizeInBytes: 250 * 1024 * 1024, // 250MB limit
          tokenPayload: JSON.stringify({
            uploadedAt: new Date().toISOString(),
          }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Vercel Blob upload completed:', blob.url);
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error: any) {
    return response.status(400).json({ error: error.message || 'Failed to handle blob upload' });
  }
}
