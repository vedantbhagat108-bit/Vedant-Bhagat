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

/**
 * Unified resolver for the active Hero video:
 * 1. Explicit Custom URL from Portfolio Settings (if entered)
 * 2. Uploaded video file from IndexedDB (if uploaded)
 * 3. Video file added to GitHub / public folder (e.g. /intro.mp4, /video.mp4, etc.)
 */
export async function resolveActiveHeroVideo(configuredUrl?: string | null): Promise<string | null> {
  // 1. If explicit URL provided in customization, prioritize it
  const cleanUrl = configuredUrl?.trim();
  if (cleanUrl) {
    return cleanUrl;
  }

  // 2. Check if a local video file was uploaded via customization
  const savedUploadedVideo = await loadSavedVideo();
  if (savedUploadedVideo) {
    return savedUploadedVideo;
  }

  // 3. If user has not explicitly disabled video, probe GitHub repo / public static files
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
