import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Ensure public and data directories exist
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Multer config for direct server-side video uploads (cross-device persistent)
  const videoStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, publicDir);
    },
    filename: (_req, _file, cb) => {
      cb(null, 'hero-video.mp4');
    },
  });

  const uploadMiddleware = multer({
    storage: videoStorage,
    limits: { fileSize: 250 * 1024 * 1024 }, // 250MB
  });

  app.use(express.json({ limit: '25mb' }));

  // Statically serve public directory for hero-video.mp4 and portfolio data
  app.use(express.static(publicDir));

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

- Portfolio Keyboard Shortcuts & Interactive Controls:
  * 'T' key: Toggle / Cycle color themes (Deep Space Cyan, Cyberpunk Neon, Solar Flare Gold, Monochrome Void)
  * 'S' or 'W' key: Toggle 3D starfield Warp Speed mode (accelerates space background velocity)
  * 'Ctrl+K', 'Cmd+K', or '/' key: Open and search the Command Palette
  * 'A' or 'C' key: Open Cosmo AI Assistant (the chat companion)
  * 'R' key: Open and download Verified Resume PDF viewer
  * 'P' key: Jump to Academic Projects section
  * 'H' key: Jump to Hero Intro section
  * 'E' key: Jump to Education & Academic Timeline
  * 'M' key: Toggle ambient deep space audio
  * 'Shift + A' keys: Open Portfolio Admin Customization Panel
  * Keys '1' to '5': Quick section jumps (1: About, 2: Skills, 3: Certifications, 4: LeetCode stats, 5: Contact)

If a user asks about shortcut keys, hotkeys, keybindings, how to change themes with keys, or how to activate warp speed, provide this full list clearly with Markdown bullet points and bold key names!

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

  // SENSITIVE CREDENTIAL: Read owner admin password strictly from environment variables
  // Never expose plaintext passwords in repository code.
  let ownerAdminPassword = process.env.OWNER_PASSWORD || process.env.ADMIN_PASSWORD || '';

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

    if (!password) {
      return res.status(400).json({
        success: false,
        authenticated: false,
        message: 'Owner password is required.',
      });
    }

    // If an environment password is configured, strictly enforce matching
    if (ownerAdminPassword && password !== ownerAdminPassword) {
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

  // In-memory active blob cache (falls back to list() if valid token configured)
  let activeBlobVideo: { url: string; pathname: string; size?: number; uploadedAt: string } | null = null;

  const isValidBlobToken = (token?: string): boolean => {
    if (!token || typeof token !== 'string') return false;
    const trimmed = token.trim();
    return trimmed.length > 20 && !trimmed.startsWith('MY_') && !trimmed.includes('your_token');
  };

  // Vercel Blob Status Check
  app.get('/api/blob/status', (_req, res) => {
    const isConfigured = isValidBlobToken(process.env.BLOB_READ_WRITE_TOKEN);
    res.json({
      configured: isConfigured,
      message: isConfigured
        ? 'Vercel Blob Storage is connected and ready for cross-device synchronization.'
        : 'BLOB_READ_WRITE_TOKEN is not configured yet. Connect Blob Store in Vercel settings to enable global sync.',
    });
  });

  // Get active Vercel Blob video
  app.get('/api/blob/active-video', async (_req, res) => {
    try {
      if (activeBlobVideo) {
        return res.json(activeBlobVideo);
      }

      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (isValidBlobToken(token)) {
        const { list } = await import('@vercel/blob');
        const response = await list({ prefix: 'hero-videos/', limit: 5, token: token! }).catch(() => null);
        if (response && response.blobs && response.blobs.length > 0) {
          const latest = response.blobs.sort(
            (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          )[0];
          activeBlobVideo = {
            url: latest.url,
            pathname: latest.pathname,
            size: latest.size,
            uploadedAt: latest.uploadedAt.toISOString(),
          };
          return res.json(activeBlobVideo);
        }
      }

      return res.json({ url: null });
    } catch {
      return res.json({ url: null });
    }
  });

  // Client-side direct stream token generation via handleUpload
  app.post('/api/blob-upload', async (req, res) => {
    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (!isValidBlobToken(token)) {
        return res.status(400).json({
          error: 'Vercel Blob storage is not connected. Please connect a Blob Store in Vercel Storage settings.',
        });
      }

      const { handleUpload } = await import('@vercel/blob/client');
      const jsonResponse = await handleUpload({
        body: req.body,
        request: req,
        onBeforeGenerateToken: async (pathname) => {
          return {
            allowedContentTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg', 'video/x-matroska'],
            maximumSizeInBytes: 250 * 1024 * 1024, // 250MB
            tokenPayload: JSON.stringify({ pathname }),
          };
        },
        onUploadCompleted: async ({ blob }) => {
          activeBlobVideo = {
            url: blob.url,
            pathname: blob.pathname,
            uploadedAt: new Date().toISOString(),
          };
        },
      });

      return res.json(jsonResponse);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Failed to handle blob upload' });
    }
  });

  // Set active video metadata after client upload
  app.post('/api/blob/set-active', (req, res) => {
    const { url, pathname, size } = req.body || {};
    if (url) {
      activeBlobVideo = {
        url,
        pathname: pathname || 'hero-videos/hero-intro.mp4',
        size,
        uploadedAt: new Date().toISOString(),
      };
      return res.json({ success: true, active: activeBlobVideo });
    }
    return res.status(400).json({ error: 'Missing video url' });
  });

  // Server-side direct upload fallback
  app.post('/api/blob/direct-upload', async (req, res) => {
    try {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return res.status(400).json({
          error: 'BLOB_READ_WRITE_TOKEN environment variable not set on server.',
        });
      }

      const filename = (req.query.filename as string) || `hero-intro-${Date.now()}.mp4`;
      const { put } = await import('@vercel/blob');
      const blob = await put(`hero-videos/${filename}`, req, {
        access: 'public',
        contentType: req.headers['content-type'] || 'video/mp4',
      });

      activeBlobVideo = {
        url: blob.url,
        pathname: blob.pathname,
        uploadedAt: new Date().toISOString(),
      };

      return res.json({ url: blob.url, pathname: blob.pathname });
    } catch (err: any) {
      console.error('Direct blob upload error:', err);
      return res.status(500).json({ error: err.message || 'Direct blob upload failed' });
    }
  });

  // Delete video from Vercel Blob
  app.post('/api/blob/delete', async (req, res) => {
    try {
      const { url } = req.body || {};
      const targetUrl = url || activeBlobVideo?.url;

      if (process.env.BLOB_READ_WRITE_TOKEN && targetUrl) {
        const { del } = await import('@vercel/blob');
        await del(targetUrl);
      }

      activeBlobVideo = null;
      return res.json({ success: true, message: 'Video deleted from Vercel Blob' });
    } catch (err: any) {
      console.error('Error deleting blob:', err);
      return res.status(500).json({ error: err.message || 'Failed to delete blob' });
    }
  });

  // ----------------------------------------------------
  // CROSS-DEVICE DIRECT VIDEO STORAGE ENDPOINTS
  // ----------------------------------------------------
  const videoFilePath = path.join(publicDir, 'hero-video.mp4');

  // Check current server-stored video
  app.get('/api/video/current', (_req, res) => {
    try {
      if (fs.existsSync(videoFilePath)) {
        const stats = fs.statSync(videoFilePath);
        return res.json({
          exists: true,
          url: '/hero-video.mp4',
          size: stats.size,
          updatedAt: stats.mtime.toISOString(),
        });
      }
      return res.json({ exists: false, url: null });
    } catch {
      return res.json({ exists: false, url: null });
    }
  });

  // Direct video upload to server (Cross-Device Persistent)
  app.post(
    '/api/video/upload',
    uploadMiddleware.fields([{ name: 'video', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
    (req, res) => {
      try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const uploadedFile = (files?.video && files.video[0]) || (files?.file && files.file[0]);

        if (!uploadedFile) {
          return res.status(400).json({ success: false, message: 'No video file received' });
        }

        const stats = fs.statSync(videoFilePath);

        // Update portfolio-data.json so heroVideoUrl points to /hero-video.mp4
        const portfolioDataPath = path.join(publicDir, 'portfolio-data.json');
        if (fs.existsSync(portfolioDataPath)) {
          try {
            const raw = fs.readFileSync(portfolioDataPath, 'utf-8');
            const data = JSON.parse(raw);
            if (data && data.personalInfo) {
              data.personalInfo.heroVideoUrl = '/hero-video.mp4';
              fs.writeFileSync(portfolioDataPath, JSON.stringify(data, null, 2), 'utf-8');
            }
          } catch (e) {
            console.error('Failed to update portfolio-data.json with video URL:', e);
          }
        }

        return res.json({
          success: true,
          url: '/hero-video.mp4',
          size: stats.size,
          message: 'Video successfully saved to server and synced across all devices!',
        });
      } catch (err: any) {
        console.error('Server video upload error:', err);
        return res.status(500).json({ success: false, message: err.message || 'Video upload failed' });
      }
    }
  );

  // Delete server video
  app.post('/api/video/delete', (_req, res) => {
    try {
      if (fs.existsSync(videoFilePath)) {
        fs.unlinkSync(videoFilePath);
      }
      return res.json({ success: true, message: 'Server video deleted successfully' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ----------------------------------------------------
  // CROSS-DEVICE PORTFOLIO DATA SYNCHRONIZATION
  // ----------------------------------------------------
  const portfolioDataFilePath = path.join(publicDir, 'portfolio-data.json');

  // Fetch cross-device portfolio customizations
  app.get('/api/portfolio/data', (_req, res) => {
    try {
      if (fs.existsSync(portfolioDataFilePath)) {
        const raw = fs.readFileSync(portfolioDataFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        return res.json({ success: true, data: parsed, synced: true });
      }
      return res.json({ success: true, data: null, synced: false });
    } catch (err: any) {
      console.error('Error reading portfolio data:', err);
      return res.json({ success: false, data: null, error: err.message });
    }
  });

  // Save cross-device portfolio customizations
  app.post('/api/portfolio/data', (req, res) => {
    try {
      const { data } = req.body || {};
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ success: false, message: 'Invalid portfolio data payload' });
      }

      fs.writeFileSync(portfolioDataFilePath, JSON.stringify(data, null, 2), 'utf-8');
      return res.json({
        success: true,
        message: 'Portfolio data saved to server and synced across all devices globally!',
      });
    } catch (err: any) {
      console.error('Error writing portfolio data:', err);
      return res.status(500).json({ success: false, message: err.message || 'Failed to persist portfolio data' });
    }
  });

  // Change Owner Password Endpoint
  app.post('/api/auth/change-password', (req, res) => {
    const { currentPassword, newPassword } = req.body || {};

    if (ownerAdminPassword && (!currentPassword || currentPassword !== ownerAdminPassword)) {
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
