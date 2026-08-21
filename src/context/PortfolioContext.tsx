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
import { EducationItem, SkillCategory, Certification, LeetCodeTopic } from '../types';

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
  updatePortfolioData: (newData: Partial<PortfolioData>) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  refetchCloudData: () => Promise<void>;
}

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
  // 1. Always start directly with verified DEFAULT_PORTFOLIO_DATA (no stale localStorage override)
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const isFetchingRef = useRef<boolean>(false);
  const dataRef = useRef<PortfolioData>(data);
  dataRef.current = data;

  /**
   * Primary Cloud Data Fetcher (Source of Truth)
   * Fetches latest data from GET /api/portfolio across all devices.
   */
  const fetchCloudPortfolioData = useCallback(async (isBackground = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      // Anti-cache query parameter and headers to ensure fresh data
      const res = await fetch(`/api/portfolio?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          Pragma: 'no-cache',
        },
        cache: 'no-store',
      });

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

          // Update React state with fresh cloud database response
          setData(merged);
          setIsCloudSynced(true);
        }
      }
    } catch (err) {
      if (!isBackground) {
        console.warn('Cloud database fetch notice:', err);
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // 1. Fetch latest data on initial application load
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

    // Periodic polling every 45 seconds to keep any open device tabs synchronized
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
      localStorage.removeItem('vedant_portfolio_cache_v3');
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
    };
    window.addEventListener('beforeunload', handleClose);
    window.addEventListener('pagehide', handleClose);
    return () => {
      window.removeEventListener('beforeunload', handleClose);
      window.removeEventListener('pagehide', handleClose);
    };
  }, []);

  /**
   * Sync portfolio data to Cloud Database via POST /api/portfolio
   * Waits for database confirmation before updating state.
   */
  const syncToCloud = async (overrideData?: PortfolioData): Promise<boolean> => {
    const payload = overrideData || dataRef.current;
    const sessionPass = sessionStorage.getItem(ADMIN_PASS_KEY) || '';

    if (!sessionPass) {
      // No active owner password session in this tab; local state updated only
      return false;
    }

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': sessionPass,
        },
        body: JSON.stringify({ data: payload, password: sessionPass }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          const confirmed: PortfolioData = {
            ...DEFAULT_PORTFOLIO_DATA,
            ...json.data,
            personalInfo: {
              ...DEFAULT_PORTFOLIO_DATA.personalInfo,
              ...(json.data.personalInfo || {}),
            },
          };
          setData(confirmed);
        }
        setIsCloudSynced(true);
        return true;
      } else if (res.status === 401) {
        console.warn('Portfolio database write requires valid owner authorization.');
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.warn('Database write response:', errJson);
      }
    } catch (e) {
      console.warn('Failed to persist portfolio customizations to database:', e);
    }
    return false;
  };

  /**
   * Update Portfolio Data:
   * Sends update to POST /api/portfolio, waits for database persistence, and updates state.
   */
  const updatePortfolioData = async (newData: Partial<PortfolioData>): Promise<boolean> => {
    const current = dataRef.current;
    const merged: PortfolioData = {
      ...current,
      ...newData,
      personalInfo: {
        ...current.personalInfo,
        ...(newData.personalInfo || {}),
      },
    };

    // Optimistically update React state
    setData(merged);

    // Persist to Cloud Database and update with server response
    const success = await syncToCloud(merged);
    return success;
  };

  /**
   * Reset Portfolio to Verified Defaults
   */
  const resetToDefaults = async (): Promise<boolean> => {
    setData(DEFAULT_PORTFOLIO_DATA);
    const sessionPass = sessionStorage.getItem(ADMIN_PASS_KEY) || '';

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': sessionPass,
        },
        body: JSON.stringify({ action: 'reset', password: sessionPass }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          setData(json.data);
        }
        setIsCloudSynced(true);
        return true;
      }
    } catch (e) {
      console.error('Reset error:', e);
    }
    return false;
  };

  /**
   * Admin Authentication (Strict Server-Verified Only)
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
        message: 'Password is required to log in as Owner.',
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

      const resData = await response.json().catch(() => ({}));
      if (response.ok && resData.success) {
        setIsAdminLoggedIn(true);
        setAdminEmail('vedantbhagat108@gmail.com');
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        sessionStorage.setItem(ADMIN_PASS_KEY, password);
        return { success: true, message: 'Owner Identity Verified. Cloud Customization Enabled!' };
      }

      return {
        success: false,
        message: resData.message || 'Authentication failed. Please check your owner password.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Unable to connect to authentication server. Please check your network connection.',
      };
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

      const resData = await response.json().catch(() => ({}));
      if (response.ok && resData.success) {
        sessionStorage.setItem(ADMIN_PASS_KEY, cleanNewPass);
        return { success: true, message: 'Password successfully updated!' };
      }

      return {
        success: false,
        message: resData.message || 'Failed to update owner password.',
      };
    } catch {
      return {
        success: false,
        message: 'Unable to connect to server to update password.',
      };
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(ADMIN_PASS_KEY);
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
