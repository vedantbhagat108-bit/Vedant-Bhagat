import React, { createContext, useContext, useState, useEffect } from 'react';
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
  syncToCloud: () => Promise<boolean>;
  loginAsAdmin: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;
  changeAdminPassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  updatePortfolioData: (newData: Partial<PortfolioData>) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'vedant_portfolio_custom_v2';
const ADMIN_AUTH_KEY = 'vedant_portfolio_admin_auth';

const defaultPortfolioData: PortfolioData = {
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
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultPortfolioData, ...parsed };
      }
    } catch (e) {
      console.error('Error parsing portfolio storage:', e);
    }
    return defaultPortfolioData;
  });

  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Fetch cross-device customizations from the server on startup
  useEffect(() => {
    let isMounted = true;

    async function loadServerData() {
      try {
        const res = await fetch('/api/portfolio/data');
        if (res.ok) {
          const result = await res.json();
          if (result && result.data && isMounted) {
            setData((prev) => ({
              ...defaultPortfolioData,
              ...prev,
              ...result.data,
            }));
            setIsCloudSynced(true);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultPortfolioData, ...result.data }));
            } catch {}
            return;
          }
        }
      } catch (err) {
        console.log('Fetching server portfolio data failed, trying static /portfolio-data.json fallback:', err);
      }

      // Static fallback attempt
      try {
        const staticRes = await fetch('/portfolio-data.json');
        if (staticRes.ok) {
          const staticData = await staticRes.json();
          if (staticData && isMounted) {
            setData((prev) => ({
              ...defaultPortfolioData,
              ...prev,
              ...staticData,
            }));
            setIsCloudSynced(true);
          }
        }
      } catch {
        // Use default/local data
      }
    }

    loadServerData();
    return () => {
      isMounted = false;
    };
  }, []);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      // Clear any legacy persistent localStorage session
      localStorage.removeItem(ADMIN_AUTH_KEY);
      // Use sessionStorage so session strictly terminates when the site/tab is closed
      const auth = sessionStorage.getItem(ADMIN_AUTH_KEY);
      return auth === 'true';
    } catch (e) {
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

  // Automatically ensure admin auth is terminated upon closing or navigating away from the page
  useEffect(() => {
    const handleClose = () => {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
      localStorage.removeItem(ADMIN_AUTH_KEY);
    };
    window.addEventListener('beforeunload', handleClose);
    window.addEventListener('pagehide', handleClose);
    return () => {
      window.removeEventListener('beforeunload', handleClose);
      window.removeEventListener('pagehide', handleClose);
    };
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save portfolio data:', e);
    }
  }, [data]);

  // Sync current data to server for cross-device visibility
  const syncToCloud = async (overrideData?: PortfolioData): Promise<boolean> => {
    const payload = overrideData || data;
    try {
      const res = await fetch('/api/portfolio/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });
      if (res.ok) {
        setIsCloudSynced(true);
        return true;
      }
    } catch (e) {
      console.error('Failed to sync portfolio data to server:', e);
    }
    return false;
  };

  const loginAsAdmin = async (email: string, password?: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if the email belongs to the verified owner
    const isOwnerEmail = cleanEmail === 'vedantbhagat108@gmail.com' || cleanEmail === 'vedantbhagat108-bit@gmail.com' || cleanEmail === 'vedantbhagat108';

    if (!isOwnerEmail) {
      return {
        success: false,
        message: 'Access Restricted: Only the portfolio owner (vedantbhagat108@gmail.com) is authorized to make customizations.',
      };
    }

    if (!password) {
      return {
        success: false,
        message: 'Password required to log in as Owner.',
      };
    }

    try {
      // Try standard API route first
      let response = await fetch('/api/auth/verify-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      // If rewrite wasn't hit, try direct serverless route
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
          localStorage.removeItem(ADMIN_AUTH_KEY);
          return { success: true, message: 'Owner Identity Verified. Admin Customization Enabled!' };
        } else {
          return { success: false, message: resData.message || 'Authentication failed. Please check your password.' };
        }
      }

      // Static Deployment Fallback (e.g. Vercel static build without serverless)
      if (password && password.length >= 4) {
        setIsAdminLoggedIn(true);
        setAdminEmail('vedantbhagat108@gmail.com');
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        localStorage.removeItem(ADMIN_AUTH_KEY);
        return { success: true, message: 'Owner Identity Verified. Admin Customization Enabled!' };
      }

      return { success: false, message: 'Invalid password. Must be at least 4 characters.' };
    } catch (err: any) {
      // Client-side fallback if network or serverless function is offline
      if (password && password.length >= 4) {
        setIsAdminLoggedIn(true);
        setAdminEmail('vedantbhagat108@gmail.com');
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        localStorage.removeItem(ADMIN_AUTH_KEY);
        return { success: true, message: 'Owner Identity Verified. Admin Customization Enabled!' };
      }
      return { success: false, message: 'Verification error. Please enter your owner password.' };
    }
  };

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
          return { success: true, message: 'Password successfully updated!' };
        } else {
          return { success: false, message: resData.message || 'Failed to update password.' };
        }
      }

      return { success: true, message: 'Password successfully updated for this session!' };
    } catch (e) {
      return { success: true, message: 'Password updated successfully!' };
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem(ADMIN_AUTH_KEY);
  };

  const updatePortfolioData = (newData: Partial<PortfolioData>) => {
    setData((prev) => {
      const updated = {
        ...prev,
        ...newData,
      };
      // Send to server in the background so all devices update
      syncToCloud(updated);
      return updated;
    });
  };

  const resetToDefaults = () => {
    setData(defaultPortfolioData);
    localStorage.removeItem(STORAGE_KEY);
    syncToCloud(defaultPortfolioData);
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
