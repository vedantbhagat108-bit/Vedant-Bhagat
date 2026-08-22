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
  } catch {
    return null;
  }
}

export interface BlobUploadProgressEvent {
  percent: number;
  loaded?: number;
  total?: number;
}

/**
 * Upload a video file directly to Vercel Blob
 * Uses client-side direct streaming or server-side upload with fallback
 */
export async function uploadVideoToVercelBlob(
  file: File,
  onProgress?: (progress: BlobUploadProgressEvent) => void,
  signal?: AbortSignal
): Promise<{ url: string; pathname: string }> {
  if (signal?.aborted) {
    throw new DOMException('Upload aborted by user', 'AbortError');
  }

  const sanitizedName = `hero-intro-${Date.now()}.${file.name.split('.').pop() || 'mp4'}`;

  // Try direct client upload via @vercel/blob/client
  try {
    const blob = await upload(`hero-videos/${sanitizedName}`, file, {
      access: 'public',
      handleUploadUrl: '/api/blob-upload',
      abortSignal: signal,
      onUploadProgress: (progress) => {
        if (onProgress) {
          onProgress({
            percent: Math.min(100, Math.round(progress.percentage)),
            loaded: progress.loaded,
            total: progress.total,
          });
        }
      },
    });

    if (signal?.aborted) {
      throw new DOMException('Upload aborted by user', 'AbortError');
    }

    // Notify backend to register this as the active hero video
    await fetch('/api/blob/set-active', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: blob.url, pathname: blob.pathname, size: file.size }),
      signal,
    }).catch(() => {});

    return { url: blob.url, pathname: blob.pathname };
  } catch (clientErr: any) {
    if (signal?.aborted || clientErr?.name === 'AbortError') {
      throw new DOMException('Upload cancelled by user', 'AbortError');
    }
    console.warn('Client upload failed, attempting direct server API upload...', clientErr);

    // Fallback: Send to server endpoint using XMLHttpRequest with progress and abort signal
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', sanitizedName);

      xhr.open('POST', '/api/blob/direct-upload', true);

      if (signal) {
        signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new DOMException('Upload cancelled', 'AbortError'));
        });
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
          onProgress({
            percent,
            loaded: event.loaded,
            total: event.total,
          });
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({ url: data.url, pathname: data.pathname });
          } catch {
            reject(new Error('Invalid response from server'));
          }
        } else {
          try {
            const errJson = JSON.parse(xhr.responseText);
            reject(new Error(errJson.error || errJson.message || 'Failed to upload video to Vercel Blob'));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error during Vercel Blob upload'));
      xhr.onabort = () => reject(new DOMException('Upload cancelled by user', 'AbortError'));

      xhr.send(formData);
    });
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
