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
    issueDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    imageUrl?: string;
    skillsAcquired?: string[];
    description?: string;
  }>;
  leetcodeTopics: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  leetcodeSkillMetrics: Array<{
    tier: string;
    color: string;
    badgeBg: string;
    dotColor: string;
    topics: Array<{ name: string; count: number }>;
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
      category: 'AI & APIs',
      featured: true,
      demoType: 'summarizer',
    },
    {
      id: 'jumper-game',
      title: '2D Platformer Game ("Jumper")',
      subtitle: 'Classic Arcade Style Game Engine with Custom Physics',
      description: [
        'Developed an interactive 2D platformer game featuring customized player mechanics, jumping physics, collision detection, and enemy AI.',
        'Designed dynamic levels containing moving platforms, collectable coins, animated hazards, custom background parallax, flagpole finish, and castle ending sequence.',
        'Organized the codebase into a clean, modular object-oriented architecture split across player physics, level parser, asset loader, settings config, UI HUD, and main event loop.',
      ],
      techStack: ['Python', 'Pygame', 'OOP', 'Game Engine Architecture'],
      github: 'https://github.com/vedantbhagat108-bit/jumper-game',
      highlights: [
        'Modular OOP code architecture',
        'Smooth gravity & jump collision physics',
        'Level hazards, coin tracking & score HUD',
        'Audio & particle effects',
      ],
      category: 'Game Dev',
      featured: true,
      demoType: 'game',
    },
  ],
  skillCategories: [
    {
      title: 'Programming Languages',
      skills: [
        { name: 'C++', level: 90, iconName: 'Code2', description: 'Primary language for DSA & competitive problem solving on LeetCode' },
        { name: 'Python', level: 88, iconName: 'Terminal', description: 'Used for AI/ML projects, APIs, Pygame, and Streamlit apps' },
        { name: 'HTML & CSS', level: 85, iconName: 'Layout', description: 'Web interface layouts, modern Tailwind styling & responsive UI' },
      ],
    },
    {
      title: 'Tools & Technologies',
      skills: [
        { name: 'GitHub & Git', level: 85, iconName: 'GitBranch', description: 'Version control, repository management, and collaboration' },
        { name: 'VS Code', level: 92, iconName: 'Cpu', description: 'Primary development environment with custom workflows' },
        { name: 'Streamlit', level: 82, iconName: 'Layers', description: 'Fast prototyping of AI and Python web applications' },
        { name: 'Gemini API', level: 88, iconName: 'Sparkles', description: 'Integrating Generative AI for text summarization & assistants' },
      ],
    },
    {
      title: 'Core CS Concepts',
      skills: [
        { name: 'Data Structures & Algorithms', level: 88, iconName: 'Binary', description: '200+ LeetCode problems solved across Arrays, Trees, Graphs, DP' },
        { name: 'Object-Oriented Programming', level: 86, iconName: 'Box', description: 'Class abstractions, inheritance, encapsulation in C++ and Python' },
        { name: 'Problem Solving', level: 90, iconName: 'Brain', description: 'Algorithmic thinking, time complexity optimization, clean code' },
      ],
    },
    {
      title: 'Currently Learning & Focus',
      skills: [
        { name: 'Backend Development', level: 78, iconName: 'Server', description: 'Node.js, Express, RESTful APIs, and Database Architectures' },
        { name: 'APIs & Microservices', level: 80, iconName: 'Network', description: 'Designing clean API contracts and HTTP services' },
      ],
    },
  ],
  certifications: [],
  leetcodeTopics: [
    { name: 'Arrays & Strings', count: 169, color: 'from-cyan-500 to-blue-500' },
    { name: 'Two Pointers & Binary Search', count: 71, color: 'from-indigo-500 to-purple-500' },
    { name: 'Trees & Graphs (DFS/BFS)', count: 85, color: 'from-emerald-500 to-teal-500' },
    { name: 'Dynamic Programming & DP', count: 50, color: 'from-amber-500 to-orange-500' },
    { name: 'Sorting, Stack & Hash Tables', count: 76, color: 'from-rose-500 to-pink-500' },
  ],
  leetcodeSkillMetrics: [
    {
      tier: 'Advanced',
      color: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
      dotColor: 'bg-rose-500',
      topics: [
        { name: 'Dynamic Programming', count: 50 },
        { name: 'Backtracking', count: 14 },
        { name: 'Union-Find', count: 12 },
        { name: 'Divide and Conquer', count: 11 },
        { name: 'Monotonic Stack', count: 4 },
        { name: 'Binary Indexed Tree', count: 3 },
        { name: 'Segment Tree', count: 3 },
        { name: 'Shortest Path', count: 3 },
      ],
    },
    {
      tier: 'Intermediate',
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      dotColor: 'bg-amber-500',
      topics: [
        { name: 'Binary Search', count: 41 },
        { name: 'Depth-First Search', count: 29 },
        { name: 'Hash Table', count: 28 },
        { name: 'Breadth-First Search', count: 28 },
        { name: 'Math', count: 28 },
        { name: 'Greedy', count: 18 },
        { name: 'Tree', count: 14 },
        { name: 'Binary Tree', count: 14 },
      ],
    },
    {
      tier: 'Fundamental',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      dotColor: 'bg-emerald-500',
      topics: [
        { name: 'Array', count: 133 },
        { name: 'Sorting', count: 37 },
        { name: 'String', count: 36 },
        { name: 'Two Pointers', count: 30 },
        { name: 'Matrix', count: 23 },
        { name: 'Linked List', count: 22 },
        { name: 'Stack', count: 11 },
        { name: 'Simulation', count: 4 },
      ],
    },
  ],
  leetcodeSolvedCount: '200+',
  updatedAt: new Date().toISOString(),
  version: 1,
};

/**
 * Universal Cloud Database Manager
 * Supports:
 *  1. Vercel Postgres / Neon / Supabase SQL (POSTGRES_URL / DATABASE_URL)
 *  2. Vercel KV / Upstash Redis (KV_REST_API_URL, KV_REST_API_TOKEN, UPSTASH_REDIS_REST_URL, REDIS_URL)
 *  3. Vercel Blob Store (BLOB_READ_WRITE_TOKEN)
 *  4. Local Disk & In-Memory Fallback
 */
class CloudPortfolioDatabase {
  private inMemoryCache: PortfolioDatabaseSchema;
  private localDbPath: string;
  private isTableInitialized = false;

  constructor() {
    this.inMemoryCache = { ...DEFAULT_DATABASE_STATE };
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {}
    }
    this.localDbPath = path.join(dataDir, 'portfolio-database.json');
    this.loadFromLocalDisk();
  }

  private loadFromLocalDisk() {
    try {
      if (fs.existsSync(this.localDbPath)) {
        const raw = fs.readFileSync(this.localDbPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          this.inMemoryCache = this.mergeWithDefault(parsed);
        }
      }
    } catch {}
  }

  private saveToLocalDisk(data: PortfolioDatabaseSchema) {
    try {
      fs.writeFileSync(this.localDbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch {}
  }

  public mergeWithDefault(incoming: Partial<PortfolioDatabaseSchema>): PortfolioDatabaseSchema {
    return {
      ...DEFAULT_DATABASE_STATE,
      ...incoming,
      personalInfo: {
        ...DEFAULT_DATABASE_STATE.personalInfo,
        ...(incoming.personalInfo || {}),
      },
      education: incoming.education || DEFAULT_DATABASE_STATE.education,
      projects: incoming.projects || DEFAULT_DATABASE_STATE.projects,
      skillCategories: incoming.skillCategories || DEFAULT_DATABASE_STATE.skillCategories,
      certifications: incoming.certifications || DEFAULT_DATABASE_STATE.certifications,
      leetcodeTopics: incoming.leetcodeTopics || DEFAULT_DATABASE_STATE.leetcodeTopics,
      leetcodeSkillMetrics: incoming.leetcodeSkillMetrics || DEFAULT_DATABASE_STATE.leetcodeSkillMetrics,
      leetcodeSolvedCount: incoming.leetcodeSolvedCount || DEFAULT_DATABASE_STATE.leetcodeSolvedCount,
    };
  }

  private isValidBlobToken(token?: string): boolean {
    if (!token || typeof token !== 'string') return false;
    const trimmed = token.trim();
    return (
      trimmed.startsWith('vercel_blob_rw_') &&
      trimmed.length > 30 &&
      !trimmed.includes('your_token') &&
      !trimmed.includes('MY_')
    );
  }

  // -------------------------------------------------------------
  // CLOUD STORAGE ADAPTERS
  // -------------------------------------------------------------

  /**
   * 1. Postgres / Neon Provider
   */
  private async getPostgresClient() {
    const connString = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
    if (!connString || connString.includes('MY_') || connString.length < 10) return null;

    try {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(connString);

      if (!this.isTableInitialized) {
        await sql`
          CREATE TABLE IF NOT EXISTS portfolio_cloud_store (
            id VARCHAR(64) PRIMARY KEY,
            data JSONB NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;
        this.isTableInitialized = true;
      }
      return sql;
    } catch {
      return null;
    }
  }

  /**
   * 2. Vercel KV / Upstash Redis Provider
   */
  private async getRedisClient() {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token || url.includes('MY_') || token.includes('MY_')) return null;

    try {
      const { Redis } = await import('@upstash/redis');
      return new Redis({ url, token });
    } catch {
      return null;
    }
  }

  // -------------------------------------------------------------
  // PUBLIC ASYNC DATABASE OPERATIONS
  // -------------------------------------------------------------

  /**
   * Fetch latest portfolio state from the active Cloud Database
   */
  public async getCloudData(): Promise<{ data: PortfolioDatabaseSchema; provider: string }> {
    // 1. Try Postgres / Neon
    try {
      const sql = await this.getPostgresClient();
      if (sql) {
        const rows = await sql`
          SELECT data FROM portfolio_cloud_store WHERE id = 'vedant_portfolio' LIMIT 1;
        `;
        if (rows && rows.length > 0 && rows[0].data) {
          const cloudData = this.mergeWithDefault(rows[0].data as Partial<PortfolioDatabaseSchema>);
          this.inMemoryCache = cloudData;
          this.saveToLocalDisk(cloudData);
          return { data: cloudData, provider: 'postgres' };
        }
      }
    } catch {}

    // 2. Try Upstash / Vercel KV
    try {
      const redis = await this.getRedisClient();
      if (redis) {
        const raw = await redis.get('portfolio_database');
        if (raw) {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          const cloudData = this.mergeWithDefault(parsed);
          this.inMemoryCache = cloudData;
          this.saveToLocalDisk(cloudData);
          return { data: cloudData, provider: 'kv' };
        }
      }
    } catch {}

    // 3. Try Vercel Blob JSON Store fallback (only if valid token is provided)
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (this.isValidBlobToken(blobToken)) {
      try {
        const { list } = await import('@vercel/blob');
        const listRes = await list({ prefix: 'portfolio-store/data.json', limit: 1, token: blobToken });
        if (listRes && listRes.blobs && listRes.blobs.length > 0) {
          const blobUrl = listRes.blobs[0].url;
          const fetchRes = await fetch(`${blobUrl}?t=${Date.now()}`);
          if (fetchRes.ok) {
            const parsed = await fetchRes.json();
            const cloudData = this.mergeWithDefault(parsed);
            this.inMemoryCache = cloudData;
            this.saveToLocalDisk(cloudData);
            return { data: cloudData, provider: 'blob' };
          }
        }
      } catch {}
    }

    // 4. Local File / Memory Fallback
    return { data: { ...this.inMemoryCache }, provider: 'local' };
  }

  /**
   * Save/Update portfolio state persistently into the active Cloud Database
   */
  public async saveCloudData(partial: Partial<PortfolioDatabaseSchema>): Promise<{ data: PortfolioDatabaseSchema; provider: string }> {
    const current = this.inMemoryCache;
    const merged: PortfolioDatabaseSchema = {
      ...current,
      ...partial,
      personalInfo: {
        ...current.personalInfo,
        ...(partial.personalInfo || {}),
      },
      updatedAt: new Date().toISOString(),
      version: (current.version || 1) + 1,
    };

    this.inMemoryCache = merged;
    this.saveToLocalDisk(merged);

    let savedProvider = 'local';

    // 1. Persist to Postgres / Neon
    try {
      const sql = await this.getPostgresClient();
      if (sql) {
        await sql`
          INSERT INTO portfolio_cloud_store (id, data, updated_at)
          VALUES ('vedant_portfolio', ${JSON.stringify(merged)}::jsonb, CURRENT_TIMESTAMP)
          ON CONFLICT (id) DO UPDATE
          SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
        `;
        savedProvider = 'postgres';
      }
    } catch {}

    // 2. Persist to Upstash / Vercel KV
    try {
      const redis = await this.getRedisClient();
      if (redis) {
        await redis.set('portfolio_database', JSON.stringify(merged));
        savedProvider = savedProvider === 'postgres' ? 'postgres+kv' : 'kv';
      }
    } catch {}

    // 3. Persist to Vercel Blob Store (only if valid token is provided)
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (this.isValidBlobToken(blobToken)) {
      try {
        const { put } = await import('@vercel/blob');
        await put('portfolio-store/data.json', JSON.stringify(merged, null, 2), {
          access: 'public',
          addRandomSuffix: false,
          contentType: 'application/json',
          token: blobToken,
        });
        savedProvider = savedProvider !== 'local' ? `${savedProvider}+blob` : 'blob';
      } catch {}
    }

    return { data: merged, provider: savedProvider };
  }

  /**
   * Reset database back to original verified default state
   */
  public async resetCloudData(): Promise<{ data: PortfolioDatabaseSchema; provider: string }> {
    const resetState: PortfolioDatabaseSchema = {
      ...DEFAULT_DATABASE_STATE,
      updatedAt: new Date().toISOString(),
      version: (this.inMemoryCache.version || 1) + 1,
    };
    return this.saveCloudData(resetState);
  }

  // Synchronous helpers for server.ts / backward-compatible endpoints
  public getData(): PortfolioDatabaseSchema {
    return { ...this.inMemoryCache };
  }

  public updateData(partial: Partial<PortfolioDatabaseSchema>): PortfolioDatabaseSchema {
    const updated = this.mergeWithDefault({ ...this.inMemoryCache, ...partial });
    this.inMemoryCache = updated;
    this.saveToLocalDisk(updated);
    // Trigger background cloud save
    this.saveCloudData(partial).catch((err) => console.warn('Background cloud sync warning:', err));
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
    this.inMemoryCache = { ...DEFAULT_DATABASE_STATE };
    this.saveToLocalDisk(DEFAULT_DATABASE_STATE);
    this.resetCloudData().catch((err) => console.warn('Background cloud reset warning:', err));
    return DEFAULT_DATABASE_STATE;
  }
}

export const db = new CloudPortfolioDatabase();
