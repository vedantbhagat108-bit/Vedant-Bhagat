import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        reply:
          "I am Cosmo, Vedant's AI Portfolio Guide! Gemini API is not configured yet.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
You are Cosmo, an intelligent, friendly space-themed AI Assistant for Vedant Raju Bhagat's Portfolio.

Verified information about Vedant:

- Name: Vedant Raju Bhagat
- Education: B.Tech in Information Technology at Delhi Technological University (DTU), New Delhi (2024-2028), CGPA: 8.83
- Strong DSA practice with 200+ LeetCode problems solved
- GitHub: https://github.com/vedantbhagat108-bit
- LeetCode: https://leetcode.com/u/Vedant1205/
- Projects:
  1. YouTube Video Summarizer — Python, Streamlit, Gemini API, YouTube Transcript API
  2. 2D Platformer Game — Python, Pygame

Technical skills:
- C++, Python, HTML, CSS
- GitHub, VS Code, Streamlit, Git
- Data Structures & Algorithms, OOP, Problem Solving
- Currently learning Backend Development and APIs

Always respond enthusiastically, professionally, concisely, and in a space/cosmic persona.
Use Markdown formatting.
`;

    const contents = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.content }],
        });
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      reply:
        response.text ||
        "I'm cosmic-linked and ready to share more about Vedant's work!",
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return res.status(500).json({
      reply: "Cosmo encountered a temporary cosmic connection problem.",
    });
  }
});

app.get("/api/github-contributions", async (req, res) => {
  try {
    const username =
      (req.query.username as string) || "vedantbhagat108-bit";

    const response = await fetch(
      `https://github.com/users/${username}/contributions`
    );

    if (!response.ok) {
      throw new Error(`GitHub responded with status ${response.status}`);
    }

    const html = await response.text();

    const totalMatch = html.match(
      /([\d,]+)\s+contributions\s+in the last year/i
    );

    const totalContributions = totalMatch ? totalMatch[1] : "0";

    const altRegex = /<td[^>]*>/gi;
    const days: { date: string; level: number }[] = [];

    let match;

    while ((match = altRegex.exec(html)) !== null) {
      const tag = match[0];

      if (tag.includes("ContributionCalendar-day")) {
        const dateMatch = tag.match(/data-date="([^"]+)"/);
        const levelMatch = tag.match(/data-level="(\d+)"/);

        if (dateMatch) {
          days.push({
            date: dateMatch[1],
            level: levelMatch ? parseInt(levelMatch[1], 10) : 0,
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
  } catch (error: any) {
    console.error("GitHub fetch error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    developer: "Vedant Raju Bhagat",
  });
});

// In-memory active blob cache
let activeBlobVideo: { url: string; pathname: string; size?: number; uploadedAt: string } | null = null;

const isValidBlobToken = (token?: string): boolean => {
  if (!token || typeof token !== "string") return false;
  const trimmed = token.trim();
  return trimmed.length > 20 && !trimmed.startsWith("MY_") && !trimmed.includes("your_token");
};

app.get("/api/blob/status", (_req, res) => {
  const isConfigured = isValidBlobToken(process.env.BLOB_READ_WRITE_TOKEN);
  res.json({
    configured: isConfigured,
    message: isConfigured
      ? "Vercel Blob Storage is connected and ready for cross-device synchronization."
      : "BLOB_READ_WRITE_TOKEN is not configured yet. Connect Blob Store in Vercel settings to enable global sync.",
  });
});

app.get("/api/blob/active-video", async (_req, res) => {
  try {
    if (activeBlobVideo) {
      return res.json(activeBlobVideo);
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (isValidBlobToken(token)) {
      const { list } = await import("@vercel/blob");
      const response = await list({ prefix: "hero-videos/", limit: 5, token: token! }).catch(() => null);
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

app.post("/api/blob-upload", async (req, res) => {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!isValidBlobToken(token)) {
      return res.status(400).json({
        error: "Vercel Blob storage is not connected. Please connect a Blob Store in Vercel Storage settings.",
      });
    }

    const { handleUpload } = await import("@vercel/blob/client");
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime", "video/ogg", "video/x-matroska"],
          maximumSizeInBytes: 250 * 1024 * 1024,
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
    return res.status(400).json({ error: error.message || "Failed to handle blob upload" });
  }
});

app.post("/api/blob/set-active", (req, res) => {
  const { url, pathname, size } = req.body || {};
  if (url) {
    activeBlobVideo = {
      url,
      pathname: pathname || "hero-videos/hero-intro.mp4",
      size,
      uploadedAt: new Date().toISOString(),
    };
    return res.json({ success: true, active: activeBlobVideo });
  }
  return res.status(400).json({ error: "Missing video url" });
});

app.post("/api/blob/delete", async (req, res) => {
  try {
    const { url } = req.body || {};
    const targetUrl = url || activeBlobVideo?.url;

    if (process.env.BLOB_READ_WRITE_TOKEN && targetUrl) {
      const { del } = await import("@vercel/blob");
      await del(targetUrl);
    }

    activeBlobVideo = null;
    return res.json({ success: true, message: "Video deleted from Vercel Blob" });
  } catch (err: any) {
    console.error("Error deleting blob:", err);
    return res.status(500).json({ error: err.message || "Failed to delete blob" });
  }
});

app.post("/api/auth/verify-owner", (req, res) => {
  const { email, password } = req.body || {};

  const cleanEmail = (email || "").trim().toLowerCase();
  const ownerPassword = process.env.OWNER_PASSWORD;

  const allowedEmails = [
    "vedantbhagat108@gmail.com",
    "vedantbhagat108-bit@gmail.com",
    "vedantbhagat108",
  ];

  if (!ownerPassword) {
    return res.status(500).json({
      success: false,
      authenticated: false,
      message: "Owner authentication is not configured.",
    });
  }

  if (!allowedEmails.includes(cleanEmail)) {
    return res.status(403).json({
      success: false,
      authenticated: false,
      message: "Access denied.",
    });
  }

  if (!password || password !== ownerPassword) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      message: "Incorrect owner password.",
    });
  }

  return res.json({
    success: true,
    authenticated: true,
    email: "vedantbhagat108@gmail.com",
    ownerName: "Vedant Bhagat",
    message: "Owner verification successful.",
  });
});

export default app;