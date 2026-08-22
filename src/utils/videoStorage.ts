import { getActiveVercelBlobVideo } from './vercelBlob';

// IndexedDB storage utility for large user videos and repo asset auto-discovery
const DB_NAME = 'VedantPortfolioMediaDB';
const DB_VERSION = 2;
const STORE_NAME = 'user_media';
const VIDEO_KEY = 'hero_intro_video';
const META_KEY = 'hero_intro_video_meta';
const VIDEO_DISABLED_KEY = 'vedant_hero_video_disabled';

export interface VideoMetadata {
  name: string;
  size: number;
  type: string;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save user-uploaded video file into IndexedDB (persists across reloads on this device)
 */
export async function saveVideoFile(file: File | Blob, customName?: string): Promise<string> {
  try {
    const db = await openDB();
    const meta: VideoMetadata = {
      name: customName || (file instanceof File ? file.name : 'custom-video.mp4'),
      size: file.size,
      type: file.type || 'video/mp4',
      updatedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(file, VIDEO_KEY);
      store.put(meta, META_KEY);

      tx.oncomplete = () => {
        // Clear any previous disabled flag when user uploads new video
        if (typeof window !== 'undefined') {
          localStorage.removeItem(VIDEO_DISABLED_KEY);
        }
        const objectUrl = URL.createObjectURL(file);
        resolve(objectUrl);
      };

      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to save video to IndexedDB:', error);
    // Fallback to in-memory URL
    return URL.createObjectURL(file);
  }
}

/**
 * Load user-uploaded video from IndexedDB
 */
export async function loadSavedVideo(): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(VIDEO_KEY);

      request.onsuccess = () => {
        const result = request.result;
        if (result && (result instanceof Blob || result instanceof File)) {
          resolve(URL.createObjectURL(result));
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Could not load saved video from IndexedDB:', error);
    return null;
  }
}

/**
 * Load metadata for user-uploaded video
 */
export async function loadSavedVideoMetadata(): Promise<VideoMetadata | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(META_KEY);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Delete user-uploaded video completely from IndexedDB
 */
export async function deleteSavedVideo(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(VIDEO_KEY);
      store.delete(META_KEY);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to delete video from IndexedDB:', error);
  }
}

/**
 * Candidates for video files committed to GitHub / public / assets folders
 */
const PROJECT_VIDEO_CANDIDATES = [
  '/intro.mp4',
  '/video.mp4',
  '/hero.mp4',
  '/hero-video.mp4',
  '/cinematic.mp4',
  '/cinematic-intro.mp4',
  '/portfolio.mp4',
  '/vedant.mp4',
  '/vedant-bhagat.mp4',
  '/bg.mp4',
  '/background.mp4',
  '/assets/intro.mp4',
  '/assets/video.mp4',
  '/assets/hero.mp4',
  '/assets/cinematic.mp4',
  '/intro.webm',
  '/video.webm',
  '/hero.webm',
];

/**
 * Auto-detect if an MP4 / video file was added to the GitHub repository / public folder
 */
export async function detectProjectRepoVideo(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  for (const candidate of PROJECT_VIDEO_CANDIDATES) {
    try {
      const res = await fetch(candidate, { method: 'HEAD' });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        // If content-type is video, or if status is 200 and not returning HTML fallback
        if (contentType.includes('video') || contentType.includes('application/octet-stream') || res.status === 200) {
          // Double-check it didn't return index.html SPA fallback
          if (!contentType.includes('text/html')) {
            return candidate;
          }
        }
      }
    } catch {
      // Continue checking next candidate
    }
  }

  return null;
}

export interface UploadProgressEvent {
  percent: number;
  loaded: number;
  total: number;
}

/**
 * Direct Server-Side Video Storage Helpers (Syncs across all devices without requiring cloud tokens)
 */
export function uploadDirectServerVideo(
  file: File,
  onProgress?: (progress: UploadProgressEvent) => void,
  signal?: AbortSignal
): Promise<{ success: boolean; url: string; message: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('video', file);

    xhr.open('POST', '/api/video/upload', true);

    if (signal) {
      if (signal.aborted) {
        reject(new DOMException('Upload aborted by user', 'AbortError'));
        return;
      }
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
          const res = JSON.parse(xhr.responseText);
          resolve(res);
        } catch {
          resolve({ success: true, url: '/hero-video.mp4', message: 'Video uploaded' });
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during video upload'));
    };

    xhr.onabort = () => {
      reject(new DOMException('Upload cancelled by user', 'AbortError'));
    };

    xhr.send(formData);
  });
}

export async function getCurrentServerVideo(): Promise<{ exists: boolean; url: string | null; size?: number }> {
  try {
    const res = await fetch('/api/video/current');
    if (!res.ok) return { exists: false, url: null };
    return await res.json();
  } catch {
    return { exists: false, url: null };
  }
}

export async function deleteCurrentServerVideo(): Promise<boolean> {
  try {
    const res = await fetch('/api/video/delete', { method: 'POST' });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Unified resolver for the active Hero video:
 * 1. Explicit Custom URL from Portfolio Settings (if entered)
 * 2. Server-stored video (/hero-video.mp4 or via /api/video/current)
 * 3. Vercel Blob Cloud Video (synced across all devices)
 * 4. Uploaded video file from IndexedDB (local device override)
 * 5. Video file added to GitHub / public folder (e.g. /intro.mp4, /video.mp4, etc.)
 */
export async function resolveActiveHeroVideo(configuredUrl?: string | null): Promise<string | null> {
  // 1. If explicit URL provided in customization, prioritize it
  const cleanUrl = configuredUrl?.trim();
  if (cleanUrl) {
    return cleanUrl;
  }

  // 2. Check if a direct server-stored video exists (cross-device sync)
  try {
    const serverVideo = await getCurrentServerVideo();
    if (serverVideo && serverVideo.exists && serverVideo.url) {
      return serverVideo.url;
    }
  } catch {
    // Proceed
  }

  // 3. Check if Vercel Blob cloud video is available (syncs to all devices globally)
  try {
    const blobVideo = await getActiveVercelBlobVideo();
    if (blobVideo && blobVideo.url) {
      return blobVideo.url;
    }
  } catch {
    // Ignore and proceed to local fallbacks
  }

  // 4. Check if a local video file was uploaded via customization on this device
  const savedUploadedVideo = await loadSavedVideo();
  if (savedUploadedVideo) {
    return savedUploadedVideo;
  }

  // 5. If user has not explicitly disabled video, probe GitHub repo / public static files
  const isExplicitlyDisabled = typeof window !== 'undefined' && localStorage.getItem(VIDEO_DISABLED_KEY) === 'true';
  if (!isExplicitlyDisabled) {
    const repoVideo = await detectProjectRepoVideo();
    if (repoVideo) {
      return repoVideo;
    }
  }

  return null;
}

/**
 * Toggle user preference to disable video (shows Cosmic Portal only)
 */
export function setVideoDisabledPreference(disabled: boolean): void {
  if (typeof window !== 'undefined') {
    if (disabled) {
      localStorage.setItem(VIDEO_DISABLED_KEY, 'true');
    } else {
      localStorage.removeItem(VIDEO_DISABLED_KEY);
    }
  }
}

export function isVideoDisabledPreference(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(VIDEO_DISABLED_KEY) === 'true';
}
