export type ThemeMode = 'deep-space' | 'cyberpunk' | 'minimal-dark' | 'solar-gold';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'AI & APIs' | 'Game Dev' | 'Backend Systems';
  github: string;
  techStack: string[];
  description: string[];
  highlights: string[];
  featured: boolean;
  demoType: 'summarizer' | 'game';
}

export interface SkillCategory {
  title: string;
  skills: {
    name: string;
    level: number; // 0 - 100
    iconName: string;
    description: string;
  }[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  description?: string;
  skillsAcquired?: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  score: string;
  scoreType: 'CGPA' | 'Percentage';
  details: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface LeetCodeTopic {
  name: string;
  count: number;
  color: string;
}
