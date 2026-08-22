import { neon } from '@neondatabase/serverless';
import crypto from 'node:crypto';

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
        { name: 'Array', count: 124 },
        { name: 'String', count: 75 },
        { name: 'Two Pointers', count: 45 },
        { name: 'Sorting', count: 39 },
        { name: 'Matrix', count: 20 },
        { name: 'Simulation', count: 15 },
        { name: 'Enumeration', count: 10 },
      ],
    },
  ],
  leetcodeSolvedCount: '200+',
  updatedAt: new Date().toISOString(),
  version: 1,
};

export function mergeWithDefault(incoming: Partial<PortfolioDatabaseSchema>): PortfolioDatabaseSchema {
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

/**
 * Owner password: persisted (hashed) in Postgres once changed.
 * Falls back to OWNER_PASSWORD/ADMIN_PASSWORD env var until a change is made.
 */
function hashPassword(password: string, existingSalt?: string): string {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPasswordAgainstHash(candidate: string, stored: string): boolean {
  const [salt, derivedHex] = stored.split(':');
  if (!salt || !derivedHex) return false;
  try {
    const candidateHex = crypto.scryptSync(candidate, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(derivedHex, 'hex'), Buffer.from(candidateHex, 'hex'));
  } catch {
    return false;
  }
}

async function ensureSecretsTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS app_secrets (
      id TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `;
}

async function getStoredOwnerPasswordHash(): Promise<string | null> {
  const sql = getPostgresClient();
  if (!sql) return null;
  try {
    await ensureSecretsTable(sql);
    const rows = await sql`SELECT value FROM app_secrets WHERE id = 'owner_password_hash' LIMIT 1;`;
    return rows && rows.length > 0 ? rows[0].value : null;
  } catch {
    return null;
  }
}

export async function verifyOwnerPassword(candidate: string): Promise<boolean> {
  if (!candidate) return false;

  const storedHash = await getStoredOwnerPasswordHash();
  if (storedHash) {
    return verifyPasswordAgainstHash(candidate, storedHash);
  }

  const envPass = process.env.OWNER_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!envPass) return false;
  return candidate === envPass;
}

export async function changeOwnerPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const isCurrentValid = await verifyOwnerPassword(currentPassword);
  if (!isCurrentValid) {
    return { success: false, message: 'Current password does not match.' };
  }

  if (!newPassword || newPassword.length < 4) {
    return { success: false, message: 'New password must be at least 4 characters long.' };
  }

  const sql = getPostgresClient();
  if (!sql) {
    return {
      success: false,
      message: 'Database persistence failed: no database connection is configured on the server, so the new password cannot be saved.',
    };
  }

  await ensureSecretsTable(sql);
  const newHash = hashPassword(newPassword);
  await sql`
    INSERT INTO app_secrets (id, value, updated_at)
    VALUES ('owner_password_hash', ${newHash}, NOW())
    ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
  `;

  return { success: true, message: 'Owner password updated successfully and persisted across all devices!' };
}

let isTableInitialized = false;

function getPostgresClient() {
  const connString =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.SUPABASE_DB_URL;

  if (!connString || connString.includes('MY_') || connString.length < 10) {
    return null;
  }

  try {
    return neon(connString);
  } catch (e) {
    console.warn('Neon connection initialization warning:', e);
    return null;
  }
}

async function ensureTable(sql: any) {
  if (isTableInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_data (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;
    isTableInitialized = true;
  } catch (e) {
    console.warn('Table initialization warning:', e);
  }
}

/**
 * Fetch portfolio data from Neon/Postgres (Single Row: id = 'main')
 */
export async function getPortfolioData(): Promise<{
  data: PortfolioDatabaseSchema;
  provider: 'postgres' | 'default';
  updatedAt: string;
  synced: boolean;
}> {
  const sql = getPostgresClient();

  if (sql) {
    await ensureTable(sql);
    const rows = await sql`
      SELECT data, updated_at
      FROM portfolio_data
      WHERE id = 'main'
      LIMIT 1;
    `;

    if (rows && rows.length > 0 && rows[0].data) {
      const cloudData = mergeWithDefault(rows[0].data as Partial<PortfolioDatabaseSchema>);
      return {
        data: cloudData,
        provider: 'postgres',
        updatedAt: rows[0].updated_at ? new Date(rows[0].updated_at).toISOString() : new Date().toISOString(),
        synced: true,
      };
    }

    // Check legacy identifier for backward compatibility
    try {
      const legacyRows = await sql`
        SELECT data, updated_at
        FROM portfolio_data
        WHERE id = 'vedant_portfolio'
        LIMIT 1;
      `;
      if (legacyRows && legacyRows.length > 0 && legacyRows[0].data) {
        const legacyData = mergeWithDefault(legacyRows[0].data as Partial<PortfolioDatabaseSchema>);
        await sql`
          INSERT INTO portfolio_data (id, data, updated_at)
          VALUES ('main', ${JSON.stringify(legacyData)}::jsonb, NOW())
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
        `;
        return {
          data: legacyData,
          provider: 'postgres',
          updatedAt: new Date().toISOString(),
          synced: true,
        };
      }
    } catch {}

    // Seed default state into table
    await sql`
      INSERT INTO portfolio_data (id, data, updated_at)
      VALUES ('main', ${JSON.stringify(DEFAULT_DATABASE_STATE)}::jsonb, NOW())
      ON CONFLICT (id) DO NOTHING;
    `;

    return {
      data: DEFAULT_DATABASE_STATE,
      provider: 'postgres',
      updatedAt: DEFAULT_DATABASE_STATE.updatedAt || new Date().toISOString(),
      synced: true,
    };
  }

  // When POSTGRES_URL is absent (local dev without cloud database)
  return {
    data: DEFAULT_DATABASE_STATE,
    provider: 'default',
    updatedAt: DEFAULT_DATABASE_STATE.updatedAt || new Date().toISOString(),
    synced: false,
  };
}

/**
 * Save portfolio data to Neon/Postgres (Single Row: id = 'main')
 * Throws error if POSTGRES_URL is missing or write fails.
 */
export async function savePortfolioData(
  partial: Partial<PortfolioDatabaseSchema>
): Promise<{
  data: PortfolioDatabaseSchema;
  provider: 'postgres';
  updatedAt: string;
  synced: boolean;
}> {
  const sql = getPostgresClient();

  if (!sql) {
    throw new Error(
      'Database persistence failed: POSTGRES_URL or DATABASE_URL environment variable is not configured on the server.'
    );
  }

  await ensureTable(sql);

  // Fetch current row to merge partial changes
  let current = DEFAULT_DATABASE_STATE;
  try {
    const existing = await sql`
      SELECT data
      FROM portfolio_data
      WHERE id = 'main'
      LIMIT 1;
    `;
    if (existing && existing.length > 0 && existing[0].data) {
      current = mergeWithDefault(existing[0].data as Partial<PortfolioDatabaseSchema>);
    }
  } catch {}

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

  const nowIso = merged.updatedAt;

  // Atomic UPSERT into Postgres table
  await sql`
    INSERT INTO portfolio_data (id, data, updated_at)
    VALUES ('main', ${JSON.stringify(merged)}::jsonb, NOW())
    ON CONFLICT (id)
    DO UPDATE SET
      data = EXCLUDED.data,
      updated_at = NOW();
  `;

  return {
    data: merged,
    provider: 'postgres',
    updatedAt: nowIso,
    synced: true,
  };
}

/**
 * Reset portfolio data to default state in Neon/Postgres (id = 'main')
 */
export async function resetPortfolioData(): Promise<{
  data: PortfolioDatabaseSchema;
  provider: 'postgres';
  updatedAt: string;
  synced: boolean;
}> {
  const sql = getPostgresClient();

  if (!sql) {
    throw new Error(
      'Database persistence failed: POSTGRES_URL or DATABASE_URL environment variable is not configured on the server.'
    );
  }

  await ensureTable(sql);

  const resetState: PortfolioDatabaseSchema = {
    ...DEFAULT_DATABASE_STATE,
    updatedAt: new Date().toISOString(),
    version: 1,
  };

  await sql`
    INSERT INTO portfolio_data (id, data, updated_at)
    VALUES ('main', ${JSON.stringify(resetState)}::jsonb, NOW())
    ON CONFLICT (id)
    DO UPDATE SET
      data = EXCLUDED.data,
      updated_at = NOW();
  `;

  return {
    data: resetState,
    provider: 'postgres',
    updatedAt: resetState.updatedAt,
    synced: true,
  };
}

/**
 * Object wrapper for compatibility with Express server.ts
 */
export const db = {
  getCloudData: getPortfolioData,
  saveCloudData: savePortfolioData,
  resetCloudData: resetPortfolioData,
  getData: () => DEFAULT_DATABASE_STATE,
  setHeroVideo: async (videoUrl: string) => {
    return savePortfolioData({
      personalInfo: {
        ...DEFAULT_DATABASE_STATE.personalInfo,
        heroVideoUrl: videoUrl,
      },
    });
  },
};
