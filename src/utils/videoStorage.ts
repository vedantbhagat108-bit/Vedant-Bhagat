// IndexedDB storage utility for large user videos
const DB_NAME = 'VedantPortfolioMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'user_media';
const VIDEO_KEY = 'hero_intro_video';

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

export async function saveVideoFile(file: File | Blob): Promise<string> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(file, VIDEO_KEY);

      request.onsuccess = () => {
        const objectUrl = URL.createObjectURL(file);
        resolve(objectUrl);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to save video to IndexedDB:', error);
    // Fallback to in-memory URL
    return URL.createObjectURL(file);
  }
}

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
    console.warn('Could not load saved video:', error);
    return null;
  }
}

export async function deleteSavedVideo(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(VIDEO_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to delete video:', error);
  }
}
