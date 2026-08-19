import { Project, SkillCategory, Certification, EducationItem, LeetCodeTopic } from '../types';

export const INITIAL_CERTIFICATIONS: Certification[] = [];

export const PERSONAL_INFO = {
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
};

export const EDUCATION_DATA: EducationItem[] = [
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
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'youtube-summarizer',
    title: 'YouTube Video Summarizer',
    subtitle: 'AI-Powered Content Extraction & Summarization App',
    category: 'AI & APIs',
    github: 'https://github.com/vedantbhagat108-bit/ai-project-',
    techStack: ['Python', 'Streamlit', 'Gemini API', 'YouTube Transcript API'],
    description: [
      'Built a web application that automatically extracts transcripts and generates concise AI summaries for YouTube videos.',
      'Integrated YouTube Transcript API to parse video subtitles and fed structured prompts to Google Gemini API.',
      'Designed a clean Streamlit user interface where users paste any YouTube link and instantly receive key takeaways.',
      'Implemented robust error handling for edge cases such as invalid URLs, disabled transcripts, and API quota limits.',
    ],
    highlights: [
      'Instant AI-driven transcript processing',
      'Clean Streamlit interactive dashboard',
      'Bullet-point and quick-summary generation',
      'Graceful error management for missing subtitles',
    ],
    featured: true,
    demoType: 'summarizer',
  },
  {
    id: 'jumper-game',
    title: '2D Platformer Game ("Jumper")',
    subtitle: 'Classic Arcade Style Game Engine with Custom Physics',
    category: 'Game Dev',
    github: 'https://github.com/vedantbhagat108-bit/jumper-game',
    techStack: ['Python', 'Pygame', 'OOP', 'Game Engine Architecture'],
    description: [
      'Developed an interactive 2D platformer game featuring customized player mechanics, jumping physics, collision detection, and enemy AI.',
      'Designed dynamic levels containing moving platforms, collectable coins, animated hazards, custom background parallax, flagpole finish, and castle ending sequence.',
      'Organized the codebase into a clean, modular object-oriented architecture split across player physics, level parser, asset loader, settings config, UI HUD, and main event loop.',
      'Enhanced player experience with custom audio sound effects and visual sprite animations.',
    ],
    highlights: [
      'Modular OOP code architecture',
      'Smooth gravity & jump collision physics',
      'Level hazards, coin tracking & score HUD',
      'Audio & particle effects',
    ],
    featured: true,
    demoType: 'game',
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
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
];

export interface LeetCodeSkillTier {
  tier: 'Advanced' | 'Intermediate' | 'Fundamental';
  color: string;
  badgeBg: string;
  dotColor: string;
  topics: { name: string; count: number }[];
}

export const LEETCODE_SKILL_METRICS: LeetCodeSkillTier[] = [
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
];

export const LEETCODE_TOPICS: LeetCodeTopic[] = [
  { name: 'Arrays & Strings', count: 169, color: 'from-cyan-500 to-blue-500' },
  { name: 'Two Pointers & Binary Search', count: 71, color: 'from-indigo-500 to-purple-500' },
  { name: 'Trees & Graphs (DFS/BFS)', count: 85, color: 'from-emerald-500 to-teal-500' },
  { name: 'Dynamic Programming & DP', count: 50, color: 'from-amber-500 to-orange-500' },
  { name: 'Sorting, Stack & Hash Tables', count: 76, color: 'from-rose-500 to-pink-500' },
];
