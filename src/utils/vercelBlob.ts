/**
 * Vercel Blob Storage Integration for Cross-Device Video Synchronization
 */
import { upload } from '@vercel/blob/client';

export interface VercelBlobVideoInfo {
  url: string;
  pathname: string;
  size?: number;
  uploadedAt?: string;
}

/**
 * Check if Vercel Blob is configured on the backend
 */
export async function checkVercelBlobStatus(): Promise<{ configured: boolean; message?: string }> {
  try {
    const res = await fetch('/api/blob/status');
    if (!res.ok) {
      return { configured: false, message: 'Vercel Blob API not available' };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    return { configured: false, message: 'Failed to contact Vercel Blob service' };
  }
}

/**
 * Fetch the currently active video URL stored in Vercel Blob
 */
export async function getActiveVercelBlobVideo(): Promise<VercelBlobVideoInfo | null> {
  try {
    const res = await fetch('/api/blob/active-video');
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.url) {
      return data;
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch active Vercel Blob video:', err);
    return null;
  }
}

/**
 * Upload a video file directly to Vercel Blob
 * Uses client-side direct streaming or server-side upload with fallback
 */
export async function uploadVideoToVercelBlob(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ url: string; pathname: string }> {
  const sanitizedName = `hero-intro-${Date.now()}.${file.name.split('.').pop() || 'mp4'}`;

  // Try direct client upload via @vercel/blob/client
  try {
    const blob = await upload(`hero-videos/${sanitizedName}`, file, {
      access: 'public',
      handleUploadUrl: '/api/blob-upload',
      onUploadProgress: (progress) => {
        if (onProgress) {
          onProgress(Math.round(progress.percentage));
        }
      },
    });

    // Notify backend to register this as the active hero video
    await fetch('/api/blob/set-active', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: blob.url, pathname: blob.pathname, size: file.size }),
    }).catch(() => {});

    return { url: blob.url, pathname: blob.pathname };
  } catch (clientErr) {
    console.warn('Client upload failed, attempting direct server API upload...', clientErr);

    // Fallback: Send to server endpoint
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', sanitizedName);

    const res = await fetch('/api/blob/direct-upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.message || 'Failed to upload video to Vercel Blob');
    }

    const data = await res.json();
    return { url: data.url, pathname: data.pathname };
  }
}

/**
 * Delete active video from Vercel Blob
 */
export async function deleteVercelBlobVideo(url?: string): Promise<boolean> {
  try {
    const res = await fetch('/api/blob/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to delete Vercel Blob video:', err);
    return false;
  }
}
