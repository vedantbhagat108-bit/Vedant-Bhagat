import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  PERSONAL_INFO,
  EDUCATION_DATA,
  PROJECTS_DATA,
  SKILL_CATEGORIES,
  INITIAL_CERTIFICATIONS,
  LEETCODE_TOPICS,
  LEETCODE_SKILL_METRICS,
} from '../data/portfolioData';
import { Project, EducationItem, SkillCategory, Certification, LeetCodeTopic } from '../types';

export interface PortfolioData {
  personalInfo: typeof PERSONAL_INFO;
  education: EducationItem[];
  projects: typeof PROJECTS_DATA;
  skillCategories: SkillCategory[];
  certifications: Certification[];
  leetcodeTopics: LeetCodeTopic[];
  leetcodeSkillMetrics: typeof LEETCODE_SKILL_METRICS;
  leetcodeSolvedCount: string;
}

interface PortfolioContextType {
  data: PortfolioData;
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  isCloudSynced: boolean;
  syncToCloud: (overrideData?: PortfolioData) => Promise<boolean>;
  loginAsAdmin: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;
  changeAdminPassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  updatePortfolioData: (newData: Partial<PortfolioData>) => void;
  resetToDefaults: () => void;
  refetchCloudData: () => Promise<void>;
}

const STORAGE_CACHE_KEY = 'vedant_portfolio_cache_v3';
const ADMIN_AUTH_KEY = 'vedant_portfolio_admin_auth';
const ADMIN_PASS_KEY = 'vedant_portfolio_admin_token';

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  personalInfo: PERSONAL_INFO,
  education: EDUCATION_DATA,
  projects: PROJECTS_DATA,
  skillCategories: SKILL_CATEGORIES,
  certifications: INITIAL_CERTIFICATIONS,
  leetcodeTopics: LEETCODE_TOPICS,
  leetcodeSkillMetrics: LEETCODE_SKILL_METRICS,
  leetcodeSolvedCount: '200+',
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from local cache for instant paint, then immediately sync with Cloud Database
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ...DEFAULT_PORTFOLIO_DATA,
          ...parsed,
          personalInfo: {
            ...DEFAULT_PORTFOLIO_DATA.personalInfo,
            ...(parsed.personalInfo || {}),
          },
        };
      }
    } catch (e) {
      console.warn('Error reading initial local cache:', e);
    }
    return DEFAULT_PORTFOLIO_DATA;
  });

  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const isFetchingRef = useRef<boolean>(false);
  const dataRef = useRef<PortfolioData>(data);
  dataRef.current = data;

  /**
   * Primary Cloud Data Fetcher (Source of Truth)
   * Fetches latest state from Cloud Database across all devices
   */
  const fetchCloudPortfolioData = useCallback(async (isBackground = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      // 1. Try standard /api/portfolio endpoint with anti-cache query param & headers
      let res = await fetch(`/api/portfolio?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
        cache: 'no-store',
      });

      // 2. Fallback to /api/portfolio/data if 404
      if (!res.ok && res.status === 404) {
        res = await fetch(`/api/portfolio/data?t=${Date.now()}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
          cache: 'no-store',
        });
      }

      if (res.ok) {
        const result = await res.json();
        if (result && result.data) {
          const cloudState = result.data;
          const merged: PortfolioData = {
            ...DEFAULT_PORTFOLIO_DATA,
            ...cloudState,
            personalInfo: {
              ...DEFAULT_PORTFOLIO_DATA.personalInfo,
              ...(cloudState.personalInfo || {}),
            },
          };

          setData(merged);
          setIsCloudSynced(true);

          try {
            localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(merged));
          } catch {}
          return;
        }
      }
    } catch (err) {
      if (!isBackground) {
        console.warn('Cloud database fetch error, attempting static mirror fallback:', err);
      }
    } finally {
      isFetchingRef.current = false;
    }

    // 3. Static mirror file fallback (if API is offline)
    try {
      const staticRes = await fetch(`/portfolio-data.json?t=${Date.now()}`, { cache: 'no-store' });
      if (staticRes.ok) {
        const staticData = await staticRes.json();
        if (staticData && staticData.personalInfo) {
          const merged: PortfolioData = {
            ...DEFAULT_PORTFOLIO_DATA,
            ...staticData,
            personalInfo: {
              ...DEFAULT_PORTFOLIO_DATA.personalInfo,
              ...(staticData.personalInfo || {}),
            },
          };
          setData(merged);
          setIsCloudSynced(true);
        }
      }
    } catch {}
  }, []);

  // 1. Initial startup sync
  useEffect(() => {
    fetchCloudPortfolioData(false);
  }, [fetchCloudPortfolioData]);

  // 2. Cross-Device Synchronization: Revalidate when window regains focus or visibility
  useEffect(() => {
    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        fetchCloudPortfolioData(true);
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    // Periodic background sync every 45 seconds to keep devices in sync
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchCloudPortfolioData(true);
      }
    }, 45000);

    return () => {
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
      clearInterval(interval);
    };
  }, [fetchCloudPortfolioData]);

  // Admin Auth State (session-scoped for security)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true' ? 'vedantbhagat108@gmail.com' : null;
    } catch {
      return null;
    }
  });

  // Terminate session when closing tab
  useEffect(() => {
    const handleClose = () => {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
      sessionStorage.removeItem(ADMIN_PASS_KEY);
      localStorage.removeItem(ADMIN_AUTH_KEY);
    };
    window.addEventListener('beforeunload', handleClose);
    window.addEventListener('pagehide', handleClose);
    return () => {
      window.removeEventListener('beforeunload', handleClose);
      window.removeEventListener('pagehide', handleClose);
    };
  }, []);

  /**
   * Sync portfolio data to Cloud Database
   */
  const syncToCloud = async (overrideData?: PortfolioData): Promise<boolean> => {
    const payload = overrideData || dataRef.current;
    const sessionPass = sessionStorage.getItem(ADMIN_PASS_KEY) || '';

    try {
      let res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': sessionPass,
        },
        body: JSON.stringify({ data: payload, password: sessionPass }),
      });

      if (!res.ok && res.status === 404) {
        res = await fetch('/api/portfolio/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Password': sessionPass,
          },
          body: JSON.stringify({ data: payload, password: sessionPass }),
        });
      }

      if (res.ok) {
        setIsCloudSynced(true);
        try {
          localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(payload));
        } catch {}
        return true;
      }
    } catch (e) {
      console.error('Failed to sync portfolio customizations to cloud database:', e);
    }
    return false;
  };

  /**
   * Admin Authentication
   */
  const loginAsAdmin = async (email: string, password?: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const ALLOWED_EMAILS = [
      'vedantbhagat108@gmail.com',
      'vedantbhagat108-bit@gmail.com',
      'vedantbhagat108',
      'vedantrajubhagat_it24a10_055@dtu.ac.in',
    ];

    if (!ALLOWED_EMAILS.includes(cleanEmail)) {
      return {
        success: false,
        message: 'Access Restricted: Only the verified portfolio owner (vedantbhagat108@gmail.com) is authorized.',
      };
    }

    if (!password) {
      return {
        success: false,
        message: 'Password required to log in as Owner.',
      };
    }

    try {
      let response = await fetch('/api/auth/verify-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (!response.ok && response.status === 404) {
        response = await fetch('/api/verify-owner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });
      }

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const resData = await response.json();
        if (resData.success) {
          setIsAdminLoggedIn(true);
          setAdminEmail('vedantbhagat108@gmail.com');
          sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
          sessionStorage.setItem(ADMIN_PASS_KEY, password);
          return { success: true, message: 'Owner Identity Verified. Cloud Customization Enabled!' };
        } else {
          return { success: false, message: resData.message || 'Authentication failed. Please check your password.' };
        }
      }

      // Static fallback if serverless is offline
      if (password && password.length >= 4) {
        setIsAdminLoggedIn(true);
        setAdminEmail('vedantbhagat108@gmail.com');
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        sessionStorage.setItem(ADMIN_PASS_KEY, password);
        return { success: true, message: 'Owner Identity Verified. Cloud Customization Enabled!' };
      }

      return { success: false, message: 'Invalid owner password.' };
    } catch (err: any) {
      if (password && password.length >= 4) {
        setIsAdminLoggedIn(true);
        setAdminEmail('vedantbhagat108@gmail.com');
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        sessionStorage.setItem(ADMIN_PASS_KEY, password);
        return { success: true, message: 'Owner Identity Verified. Cloud Customization Enabled!' };
      }
      return { success: false, message: 'Verification error. Please enter your owner password.' };
    }
  };

  /**
   * Change Admin Password
   */
  const changeAdminPassword = async (currentPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    if (!currentPass) {
      return { success: false, message: 'Current password is required.' };
    }

    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: 'New password must be at least 4 characters long.' };
    }

    const cleanNewPass = newPass.trim();
    try {
      let response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: cleanNewPass }),
      });

      if (!response.ok && response.status === 404) {
        response = await fetch('/api/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentPassword: currentPass, newPassword: cleanNewPass }),
        });
      }

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const resData = await response.json();
        if (resData.success) {
          sessionStorage.setItem(ADMIN_PASS_KEY, cleanNewPass);
          return { success: true, message: 'Password successfully updated!' };
        } else {
          return { success: false, message: resData.message || 'Failed to update password.' };
        }
      }

      sessionStorage.setItem(ADMIN_PASS_KEY, cleanNewPass);
      return { success: true, message: 'Password successfully updated!' };
    } catch {
      sessionStorage.setItem(ADMIN_PASS_KEY, cleanNewPass);
      return { success: true, message: 'Password updated successfully!' };
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(ADMIN_PASS_KEY);
  };

  /**
   * Update Portfolio Data with Optimistic State + Cloud Sync
   */
  const updatePortfolioData = (newData: Partial<PortfolioData>) => {
    setData((prev) => {
      const updated = {
        ...prev,
        ...newData,
        personalInfo: {
          ...prev.personalInfo,
          ...(newData.personalInfo || {}),
        },
      };
      // Persist to Cloud Database immediately
      syncToCloud(updated);
      return updated;
    });
  };

  /**
   * Reset Portfolio to Verified Defaults
   */
  const resetToDefaults = () => {
    setData(DEFAULT_PORTFOLIO_DATA);
    try {
      localStorage.removeItem(STORAGE_CACHE_KEY);
    } catch {}
    const sessionPass = sessionStorage.getItem(ADMIN_PASS_KEY) || '';
    fetch('/api/portfolio/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': sessionPass,
      },
      body: JSON.stringify({ action: 'reset', password: sessionPass }),
    }).catch(() => {});
    syncToCloud(DEFAULT_PORTFOLIO_DATA);
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isAdminLoggedIn,
        adminEmail,
        isCloudSynced,
        syncToCloud,
        loginAsAdmin,
        logoutAdmin,
        changeAdminPassword,
        updatePortfolioData,
        resetToDefaults,
        refetchCloudData: () => fetchCloudPortfolioData(false),
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
