// Client-side knowledge engine for Cosmo AI assistant (works even in static deployments / offline / missing API key)

export interface LocalKnowledgeAnswer {
  keywords: string[];
  response: string;
}

const KNOWLEDGE_BASE: LocalKnowledgeAnswer[] = [
  {
    keywords: ['cgpa', 'grade', 'marks', 'percentage', 'score', 'academics', 'dtu cgpa'],
    response: `**Vedant Raju Bhagat's Academic Records:**
- **Degree:** B.Tech in Information Technology (2024–2028)
- **Institution:** Delhi Technological University (DTU, formerly DCE), New Delhi
- **Current CGPA:** **8.83 / 10.0**
- **CBSE Class XII:** Sandipani School, Nagpur (2023) — **93.8%**
- **CBSE Class X:** The Central County School, Nagpur (2021) — **96.2%**`,
  },
  {
    keywords: ['youtube', 'summarizer', 'ai project', 'transcript', 'gemini api', 'ai summarizer', 'streamlit'],
    response: `**YouTube Video Summarizer (AI Project):**
- **Tech Stack:** Python, Streamlit, Google Gemini API, YouTube Transcript API
- **Key Features:**
  - Automatically fetches video transcripts and generates concise, structured executive summaries.
  - Interactive Streamlit web interface with responsive layout and dark/light themes.
  - Robust exception handling for videos without closed captions or invalid URLs.
- **GitHub Repository:** [vedantbhagat108-bit/ai-project-](https://github.com/vedantbhagat108-bit/ai-project-)`,
  },
  {
    keywords: ['mario', 'game', 'pygame', 'platformer', 'jumper', 'python game'],
    response: `**2D Platformer Game (Pygame):**
- **Tech Stack:** Python, Pygame, Modular Object-Oriented Design
- **Key Features:**
  - Classic retro platformer physics with double-jumping, variable velocity, and smooth camera scrolling.
  - Animated sprite mechanics for enemies, collectible coins, dynamic platforms, and castle finish levels.
  - High-score tracking with integrated audio synthesis and retro SFX.
- **GitHub Repository:** [vedantbhagat108-bit/jumper-game](https://github.com/vedantbhagat108-bit/jumper-game)`,
  },
  {
    keywords: ['leetcode', 'dsa', 'c++', 'problem solving', 'solved', 'coding stats', 'rating'],
    response: `**LeetCode & DSA Problem Solving Profile:**
- **Problems Solved:** **200+ LeetCode problems solved**
- **Primary Language:** Modern C++ (C++17/C++20) & STL
- **Key Topics:**
  - Arrays, Two Pointers, Sliding Window
  - Binary Trees, BSTs & Binary Search
  - Dynamic Programming, Recursion & Backtracking
  - Graphs (BFS, DFS, Dijkstra)
  - Hash Maps, Heaps & Stacks
- **LeetCode Profile:** [leetcode.com/u/Vedant1205/](https://leetcode.com/u/Vedant1205/)`,
  },
  {
    keywords: ['skills', 'tech stack', 'languages', 'technologies', 'tools', 'frontend', 'backend'],
    response: `**Vedant's Technical Skill Matrix:**
- **Core Languages:** C++, Python, JavaScript/TypeScript, SQL, HTML5, CSS3
- **Frameworks & Libraries:** React.js, Tailwind CSS, Streamlit, Express, Pygame
- **Developer Tools:** Git, GitHub, VS Code, Linux CLI, Postman
- **Core Competencies:** Data Structures & Algorithms, Object-Oriented Programming (OOP), REST APIs, Prompt Engineering with Gemini AI.`,
  },
  {
    keywords: ['contact', 'email', 'phone', 'reach', 'hire', 'message', 'linkedin', 'github'],
    response: `**Get in Touch with Vedant:**
- **Email:** vedantbhagat108@gmail.com
- **College Email:** vedantrajubhagat_it24a10_055@dtu.ac.in
- **Phone:** +91 8149746503
- **GitHub:** [github.com/vedantbhagat108-bit](https://github.com/vedantbhagat108-bit)
- **LeetCode:** [leetcode.com/u/Vedant1205](https://leetcode.com/u/Vedant1205/)
- **Location:** Delhi Technological University, New Delhi, India`,
  },
  {
    keywords: ['education', 'college', 'school', 'delhi technological university', 'dtu', 'university'],
    response: `**Educational Background:**
- **B.Tech in Information Technology:** Delhi Technological University (DTU), New Delhi (2024–2028) | CGPA: **8.83**
- **Senior Secondary (Class XII):** Sandipani School, Nagpur (2023) | Score: **93.8%**
- **Secondary School (Class X):** The Central County School, Nagpur (2021) | Score: **96.2%**`,
  },
  {
    keywords: ['who', 'about', 'vedant', 'intro', 'profile', 'summary'],
    response: `**About Vedant Raju Bhagat:**
Vedant is an Information Technology undergraduate at **Delhi Technological University (DTU)** with an impressive **8.83 CGPA**. He combines strong theoretical computer science foundations with hands-on software development in Python, modern C++, React, and AI APIs. He has solved **200+ LeetCode problems** and is passionate about building scalable web applications, interactive games, and AI-powered systems.`,
  },
];

export function getSmartLocalResponse(query: string): string {
  const clean = query.toLowerCase().trim();

  // Search for best matching knowledge
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some((k) => clean.includes(k))) {
      return entry.response;
    }
  }

  // General fallback response
  return `Greetings! I am **Cosmo**, Vedant's portfolio AI guide. 
Vedant is an IT undergraduate at **Delhi Technological University (DTU, 8.83 CGPA)** proficient in:
- **Languages & DSA:** C++ (200+ LeetCode solved), Python, JavaScript
- **Featured Projects:** YouTube AI Video Summarizer (Gemini API), 2D Pygame Platformer
- **Education:** B.Tech IT at DTU New Delhi (2024-2028)

Feel free to ask me specifically about his **projects**, **grades/CGPA**, **LeetCode stats**, **skills**, or **contact info**!`;
}
