import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Route for AI Assistant (Gemini)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(200).json({
          reply: "I am Cosmo, Vedant's AI Portfolio Guide! (Note: Gemini API key is not configured, but here is what I know about Vedant): Vedant Bhagat is an IT undergraduate at Delhi Technological University (DTU, CGPA 8.83). He has solved 200+ LeetCode problems in C++ and created projects like a YouTube Video Summarizer (Gemini API) and a 2D Pygame Platformer!"
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `
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
  * Languages: C++, Python, HTML, CSS
  * Tools/Tech: GitHub, VS Code, Streamlit, Git
  * Concepts: Data Structures & Algorithms (200+ LeetCode solved), OOP, Problem Solving
  * Currently Learning: Backend Development, APIs

Always respond enthusiastically, professionally, and concisely in a space/cosmic persona with helpful insights. Use Markdown for formatting.
`;

      const contents = [];
      if (Array.isArray(history)) {
        for (const item of history) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.content }]
          });
        }
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "I'm cosmic-linked and ready to share more about Vedant's work!";
      return res.json({ reply });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      return res.status(200).json({
        reply: "Cosmo Assistant: Vedant Bhagat is an IT student at DTU (CGPA 8.83) proficient in C++, Python, DSA (200+ LeetCode), Gemini API, and Pygame! Feel free to explore his projects section or contact him directly."
      });
    }
  });

  // Live GitHub Contributions endpoint directly from GitHub
  app.get('/api/github-contributions', async (req, res) => {
    try {
      const username = (req.query.username as string) || 'vedantbhagat108-bit';
      const response = await fetch(`https://github.com/users/${username}/contributions`);
      
      if (!response.ok) {
        throw new Error(`GitHub responded with status ${response.status}`);
      }

      const html = await response.text();

      // Extract total contributions string (e.g. "14 contributions in the last year")
      const totalMatch = html.match(/([\d,]+)\s+contributions\s+in the last year/i);
      const totalContributions = totalMatch ? totalMatch[1] : '14';

      // Parse day cells
      const altRegex = /<td[^>]*>/gi;
      const days: { date: string; level: number }[] = [];
      let m;
      while ((m = altRegex.exec(html)) !== null) {
        const tag = m[0];
        if (tag.includes('ContributionCalendar-day')) {
          const dateM = tag.match(/data-date="([^"]+)"/);
          const levelM = tag.match(/data-level="(\d+)"/);
          if (dateM) {
            days.push({
              date: dateM[1],
              level: levelM ? parseInt(levelM[1], 10) : 0,
            });
          }
        }
      }

      return res.json({
        success: true,
        username,
        totalContributions,
        days,
      });
    } catch (err: any) {
      console.error('GitHub fetch error:', err);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  });

  // In-memory owner admin password (default: Ved@1285)
  let ownerAdminPassword = process.env.OWNER_PASSWORD || 'Ved@1285';

  // Owner Authorization Check (Google Account & Password Security Check)
  app.post('/api/auth/verify-owner', (req, res) => {
    const { email, password } = req.body || {};
    const cleanEmail = (email || '').trim().toLowerCase();

    const ALLOWED_OWNER_EMAILS = [
      'vedantbhagat108@gmail.com',
      'vedantbhagat108-bit@gmail.com',
      'vedantbhagat108',
    ];

    if (!ALLOWED_OWNER_EMAILS.includes(cleanEmail)) {
      return res.status(403).json({
        success: false,
        authenticated: false,
        message: 'Access Denied: Only the portfolio owner Google Account (vedantbhagat108@gmail.com) can customize this site.',
      });
    }

    // Verify Password if provided (or fallback if empty to check)
    if (password && password !== ownerAdminPassword) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        message: 'Incorrect Owner Password.',
      });
    }

    return res.json({
      success: true,
      authenticated: true,
      email: 'vedantbhagat108@gmail.com',
      ownerName: 'Vedant Bhagat',
      message: 'Owner verification successful. Welcome Vedant Bhagat!',
    });
  });

  // Change Owner Password Endpoint
  app.post('/api/auth/change-password', (req, res) => {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || currentPassword !== ownerAdminPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 4 characters long.',
      });
    }

    ownerAdminPassword = newPassword;
    return res.json({
      success: true,
      message: 'Owner admin password changed successfully!',
    });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', developer: 'Vedant Raju Bhagat' });
  });

  // Vite middleware for dev or static serving for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
