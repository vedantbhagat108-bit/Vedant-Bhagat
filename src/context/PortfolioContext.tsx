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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save portfolio data:', e);
    }
  }, [data]);

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
      // Send verification to backend endpoint
      const response = await fetch('/api/auth/verify-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const resData = await response.json();

      if (resData.success) {
        setIsAdminLoggedIn(true);
        setAdminEmail('vedantbhagat108@gmail.com');
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        localStorage.removeItem(ADMIN_AUTH_KEY);
        return { success: true, message: 'Owner Identity Verified. Admin Customization Enabled!' };
      } else {
        return { success: false, message: resData.message || 'Authentication failed. Please verify your owner password.' };
      }
    } catch (err: any) {
      return { success: false, message: 'Server communication error. Could not verify owner credentials.' };
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
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: cleanNewPass }),
      });
      const resData = await response.json();
      if (resData.success) {
        return { success: true, message: 'Password successfully updated!' };
      } else {
        return { success: false, message: resData.message || 'Failed to update password.' };
      }
    } catch (e) {
      return { success: false, message: 'Network error while attempting to update password.' };
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem(ADMIN_AUTH_KEY);
  };

  const updatePortfolioData = (newData: Partial<PortfolioData>) => {
    setData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const resetToDefaults = () => {
    setData(defaultPortfolioData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isAdminLoggedIn,
        adminEmail,
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
