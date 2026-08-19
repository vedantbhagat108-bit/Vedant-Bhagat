import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `
You are Cosmo, an intelligent, friendly space-themed AI Assistant for Vedant Raju Bhagat's Portfolio.
Here are the exact verified details about Vedant from his resume:

- Name: Vedant Raju Bhagat
- Email: vedantrajubhagat_it24a10_055@dtu.ac.in or vedantbhagat108@gmail.com
- Phone: +91 8149746503
- Education:
  * B.Tech in Information Technology at Delhi Technological University (DTU), New Delhi (2024-2028), CGPA: 8.83
  * CBSE Class XII: Sandipani School, Nagpur (2023) - 93.8%
  * CBSE Class X: The Central County School, Nagpur (2021) - 96.2%
- Summary: IT undergraduate at DTU with hands-on project experience in Python, APIs, and game development. Strong DSA practice (200+ LeetCode problems solved) and growing interest in backend systems and AI applications.
- GitHub: https://github.com/vedantbhagat108-bit
- LeetCode: https://leetcode.com/u/Vedant1205/
- Key Projects:
  1. YouTube Video Summarizer (Repo: vedantbhagat108-bit/ai-project-)
     Tech: Python, Streamlit, Gemini API, YouTube Transcript API
     Features: Fetches transcripts using YouTube Transcript API, summarizes with Gemini API, Streamlit web interface with error handling for invalid links/transcripts.
  2. 2D Platformer Game (Repo: vedantbhagat108-bit/jumper-game)
     Tech: Python, Pygame
     Features: 2D platformer with player movement, jumping, enemies, coins, platforms, background sound effects, castle ending, organized modular architecture.
- Technical Skills:
  * Languages: C++, Python, HTML, CSS, JavaScript
  * Tools/Tech: GitHub, VS Code, Streamlit, Git, Tailwind CSS, React
  * Concepts: Data Structures & Algorithms (200+ LeetCode solved), OOP, Problem Solving
  * Currently Learning: Backend Development, APIs

Always respond enthusiastically, professionally, and concisely in a space/cosmic persona with helpful insights. Use Markdown for formatting.
`;

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        reply: "Greetings from Cosmo! Vedant Bhagat is an IT undergraduate at Delhi Technological University (DTU, CGPA 8.83). He has solved 200+ LeetCode problems in C++ and developed notable projects like an AI YouTube Video Summarizer and a 2D Pygame Platformer!"
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const contents: any[] = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content || item.text || '' }]
        });
      }
    }

    contents.push({ role: 'user', parts: [{ text: message || '' }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const reply = response.text || "Cosmo: I'm cosmic-linked and ready to answer any questions about Vedant!";
    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Gemini API Vercel Error:', error);
    return res.status(200).json({
      reply: "Cosmo AI Assistant: Vedant Bhagat is an IT undergraduate at DTU (8.83 CGPA) proficient in C++, Python, DSA (200+ LeetCode), Streamlit, Gemini API, and Pygame!"
    });
  }
}
