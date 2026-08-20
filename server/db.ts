import fs from 'fs';
import path from 'path';

export interface PortfolioDatabaseSchema {
  personalInfo: {
    name: string;
    title: string;
    subtitle: string;
    location: string;
    email: string;
    secondaryEmail: string;
    phone: string;
    dtuRoll: string;
    github: string;
    leetcode: string;
    heroVideoUrl: string;
    bio: string;
    cgpa?: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    period: string;
    score: string;
    scoreType: string;
    details: string[];
  }>;
  projects: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string[];
    techStack: string[];
    github: string;
    live?: string;
    highlights: string[];
    category: string;
    featured: boolean;
    demoType?: string;
  }>;
  skillCategories: Array<{
    title: string;
    skills: Array<{
      name: string;
      level: number;
      iconName?: string;
      description: string;
    }>;
  }>;
  certifications: Array<{
    id: string;
    title: string;
    issuer: string;
    issueDate: string;
    credentialId?: string;
    credentialUrl?: string;
    imageUrl?: string;
    skillsAcquired?: string[];
    description?: string;
  }>;
  leetcodeTopics: Array<{
    name: string;
    solved: number;
    total: number;
    color: string;
    percentage: number;
  }>;
  leetcodeSkillMetrics: Array<{
    category: string;
    level: string;
    problemsSolved: number;
    accuracy: string;
  }>;
  leetcodeSolvedCount: string;
  updatedAt?: string;
  version?: number;
}

export const DEFAULT_DATABASE_STATE: PortfolioDatabaseSchema = {
  personalInfo: {
    name: 'Vedant Raju Bhagat',
    title: 'IT Undergraduate @ DTU',
    subtitle: 'Software Engineer • Backend Systems & AI Applications',
    location: 'Delhi Technological University, New Delhi / Nagpur, India',
    email: 'vedantrajubhagat_it24a10_055@dtu.ac.in',
    secondaryEmail: 'vedantbhagat108@gmail.com',
    phone: '+91 8149746503',
    dtuRoll: '2K24/IT/188',
    github: 'https://github.com/vedantbhagat108-bit',
    leetcode: 'https://leetcode.com/u/Vedant1205/',
    heroVideoUrl: '',
    bio: 'IT undergraduate at Delhi Technological University (DTU) with hands-on project experience in Python, APIs, and game development. Strong Data Structures & Algorithms foundation (200+ LeetCode problems) and a passion for building scalable backend systems and intelligent AI solutions.',
    cgpa: '8.83',
  },
  education: [
    {
      degree: 'B.Tech in Information Technology',
      institution: 'Delhi Technological University (DTU)',
      location: 'New Delhi, India',
      period: '2024 – 2028',
      score: '8.83',
      scoreType: 'CGPA',
      details: [
        'Focusing on Computer Science & Information Technology fundamentals.',
        'Active practice in Data Structures, Algorithms, Object-Oriented Programming, and System Design concepts.',
        'Maintaining an outstanding CGPA of 8.83 in initial academic coursework.',
      ],
    },
    {
      degree: 'CBSE (Class XII)',
      institution: 'Sandipani School',
      location: 'Nagpur, India',
      period: '2023',
      score: '93.8%',
      scoreType: 'Percentage',
      details: [
        'Completed Senior Secondary Education with Physics, Chemistry, and Mathematics focus.',
        'Achieved a distinction aggregate of 93.8%.',
      ],
    },
    {
      degree: 'CBSE (Class X)',
      institution: 'The Central County School',
      location: 'Nagpur, India',
      period: '2021',
      score: '96.2%',
      scoreType: 'Percentage',
      details: [
        'Completed Secondary Education with high academic distinction.',
        'Achieved top score of 96.2%.',
      ],
    },
  ],
  projects: [
    {
      id: 'youtube-summarizer',
      title: 'YouTube Video Summarizer',
      subtitle: 'Gemini API & Streamlit Content Intelligence',
      description: [
        'Built an AI application that automatically extracts transcripts and generates structured summaries using the Google Gemini API.',
        'Integrated Python with the YouTube Transcript API to fetch English and multilingual transcripts with fallback handling.',
        'Designed an interactive Streamlit UI with error-handling for invalid video URLs and non-captioned media.',
      ],
      techStack: ['Python', 'Streamlit', 'Gemini API', 'YouTube Transcript API', 'Prompt Engineering'],
      github: 'https://github.com/vedantbhagat108-bit/ai-project-',
      highlights: [
        'Real-time transcript processing & Gemini LLM summarization',
        'Intuitive web interface with robust edge-case exception handling',
        'Structured markdown output for instant key point takeaways',
      ],
      category: 'AI & Automation',
      featured: true,
      demoType: 'summarizer',
    },
    {
      id: 'pygame-2d-platformer',
      title: '2D Platformer Game',
      subtitle: 'Modular Physics & Collision Game Engine in Python',
      description: [
        'Engineered a complete 2D side-scrolling platformer with physics, jump mechanics, and bounding-box collision detection.',
        'Designed an enemy AI patrolling system, platform generation, collectible scoring, and interactive sound effects.',
        'Implemented a castle milestone level-completion architecture with modular object-oriented game state management.',
      ],
      techStack: ['Python', 'Pygame', 'OOP Game Loop', 'Physics Engine', 'Audio System'],
      github: 'https://github.com/vedantbhagat108-bit/jumper-game',
      highlights: [
        'Fluid kinematic player movement and custom gravity curve',
        'Interactive coin scoring, live health, and enemy collision logic',
        'Modular sound engine with background audio and jump SFX',
      ],
      category: 'Game Development',
      featured: true,
      demoType: 'platformer',
    },
  ],
  skillCategories: [
    {
      title: 'Programming Languages',
      skills: [
        { name: 'C++', level: 90, iconName: 'Binary', description: 'Primary language for Data Structures, Algorithms & Competitive Programming' },
        { name: 'Python', level: 88, iconName: 'Terminal', description: 'Scripting, Automation, AI model integrations & Pygame development' },
        { name: 'HTML5', level: 85, iconName: 'Layout', description: 'Semantic markup, modern web structure & accessibility' },
        { name: 'CSS3 / Tailwind', level: 82, iconName: 'Layers', description: 'Responsive layouts, grid systems & modern cosmic aesthetics' },
      ],
    },
    {
      title: 'Frameworks & Libraries',
      skills: [
        { name: 'Streamlit', level: 85, iconName: 'Globe', description: 'Rapid deployment of interactive AI and Python dashboards' },
        { name: 'Pygame', level: 82, iconName: 'Box', description: '2D game loop architecture, sprite animation & physics' },
        { name: 'Google Gemini API', level: 88, iconName: 'Sparkles', description: 'Multimodal LLM prompting, transcript intelligence & text analysis' },
        { name: 'YouTube Transcript API', level: 84, iconName: 'Network', description: 'Video transcript extraction and stream manipulation' },
      ],
    },
    {
      title: 'Tools & Platforms',
      skills: [
        { name: 'Git & GitHub', level: 86, iconName: 'GitBranch', description: 'Version control, branch workflows & open-source collaboration' },
        { name: 'VS Code', level: 90, iconName: 'Code2', description: 'Primary IDE, debugging workflows & environment configurations' },
        { name: 'Linux / CLI', level: 78, iconName: 'Terminal', description: 'Bash commands, process management & container workflows' },
      ],
    },
    {
      title: 'Core Fundamentals',
      skills: [
        { name: 'Data Structures & Algorithms', level: 88, iconName: 'Brain', description: 'Arrays, Trees, Graphs, Dynamic Programming & 200+ LeetCode problems solved' },
        { name: 'Object-Oriented Programming', level: 86, iconName: 'Cpu', description: 'Inheritance, Polymorphism, Encapsulation & Design Patterns' },
        { name: 'Backend & APIs (Learning)', level: 75, iconName: 'Server', description: 'REST APIs, server-side data processing and database persistence' },
      ],
    },
  ],
  certifications: [],
  leetcodeTopics: [
    { name: 'Arrays & Strings', solved: 65, total: 100, color: 'from-cyan-500 to-blue-500', percentage: 65 },
    { name: 'Hash Tables & Maps', solved: 40, total: 60, color: 'from-emerald-500 to-teal-500', percentage: 67 },
    { name: 'Trees & Graphs', solved: 35, total: 50, color: 'from-purple-500 to-indigo-500', percentage: 70 },
    { name: 'Dynamic Programming', solved: 30, total: 50, color: 'from-amber-500 to-orange-500', percentage: 60 },
    { name: 'Two Pointers & Binary Search', solved: 30, total: 40, color: 'from-rose-500 to-pink-500', percentage: 75 },
  ],
  leetcodeSkillMetrics: [
    { category: 'Data Structures', level: 'Advanced', problemsSolved: 110, accuracy: '88%' },
    { category: 'Algorithms', level: 'Intermediate', problemsSolved: 90, accuracy: '84%' },
    { category: 'C++ STL', level: 'Expert', problemsSolved: 200, accuracy: '92%' },
  ],
  leetcodeSolvedCount: '200+',
  updatedAt: new Date().toISOString(),
  version: 1,
};

class PortfolioDatabase {
  private dbFilePath: string;
  private publicMirrorPath: string;
  private inMemoryCache: PortfolioDatabaseSchema;

  constructor() {
    const dataDir = path.resolve(process.cwd(), 'data');
    const publicDir = path.resolve(process.cwd(), 'public');

    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {}
    }
    if (!fs.existsSync(publicDir)) {
      try {
        fs.mkdirSync(publicDir, { recursive: true });
      } catch {}
    }

    this.dbFilePath = path.join(dataDir, 'portfolio-database.json');
    this.publicMirrorPath = path.join(publicDir, 'portfolio-data.json');
    this.inMemoryCache = this.loadFromDisk();
  }

  private loadFromDisk(): PortfolioDatabaseSchema {
    // 1. Try primary database file
    try {
      if (fs.existsSync(this.dbFilePath)) {
        const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.personalInfo) {
          return {
            ...DEFAULT_DATABASE_STATE,
            ...parsed,
            personalInfo: { ...DEFAULT_DATABASE_STATE.personalInfo, ...parsed.personalInfo },
          };
        }
      }
    } catch (err) {
      console.error('Error reading primary database file:', err);
    }

    // 2. Try public mirror file
    try {
      if (fs.existsSync(this.publicMirrorPath)) {
        const raw = fs.readFileSync(this.publicMirrorPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.personalInfo) {
          const merged = {
            ...DEFAULT_DATABASE_STATE,
            ...parsed,
            personalInfo: { ...DEFAULT_DATABASE_STATE.personalInfo, ...parsed.personalInfo },
          };
          this.persistToDisk(merged);
          return merged;
        }
      }
    } catch (err) {
      console.error('Error reading public mirror database file:', err);
    }

    // 3. Fallback to default schema and write initial file
    this.persistToDisk(DEFAULT_DATABASE_STATE);
    return DEFAULT_DATABASE_STATE;
  }

  private persistToDisk(data: PortfolioDatabaseSchema) {
    const payload = JSON.stringify(data, null, 2);
    try {
      fs.writeFileSync(this.dbFilePath, payload, 'utf-8');
    } catch (e) {
      console.error('Failed to write to primary dbFilePath:', e);
    }
    try {
      fs.writeFileSync(this.publicMirrorPath, payload, 'utf-8');
    } catch (e) {
      console.error('Failed to write to publicMirrorPath:', e);
    }
  }

  public getData(): PortfolioDatabaseSchema {
    return { ...this.inMemoryCache };
  }

  public updateData(partial: Partial<PortfolioDatabaseSchema>): PortfolioDatabaseSchema {
    const current = this.inMemoryCache;
    const updated: PortfolioDatabaseSchema = {
      ...current,
      ...partial,
      personalInfo: {
        ...current.personalInfo,
        ...(partial.personalInfo || {}),
      },
      updatedAt: new Date().toISOString(),
      version: (current.version || 1) + 1,
    };

    this.inMemoryCache = updated;
    this.persistToDisk(updated);
    return updated;
  }

  public setHeroVideo(videoUrl: string): PortfolioDatabaseSchema {
    return this.updateData({
      personalInfo: {
        ...this.inMemoryCache.personalInfo,
        heroVideoUrl: videoUrl,
      },
    });
  }

  public reset(): PortfolioDatabaseSchema {
    const resetData = {
      ...DEFAULT_DATABASE_STATE,
      updatedAt: new Date().toISOString(),
      version: (this.inMemoryCache.version || 1) + 1,
    };
    this.inMemoryCache = resetData;
    this.persistToDisk(resetData);
    return resetData;
  }
}

export const db = new PortfolioDatabase();
