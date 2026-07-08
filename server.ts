import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { readDB, writeDB } from "./src/server/db.ts";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialize Gemini API client to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // ---------------------------------------------------------------------------
  // API Routes
  // ---------------------------------------------------------------------------

  // GET /api/profile - Returns settings, projects, and skills
  app.get("/api/profile", (req, res) => {
    try {
      const db = readDB();
      res.json({
        settings: db.settings,
        projects: db.projects,
        skills: db.skills,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to load profile data", details: error.message });
    }
  });

  // POST /api/profile/settings - Updates general settings and AI persona
  app.post("/api/profile/settings", (req, res) => {
    try {
      const db = readDB();
      db.settings = { ...db.settings, ...req.body };
      writeDB(db);
      res.json({ success: true, settings: db.settings });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update settings", details: error.message });
    }
  });

  // POST /api/projects - Adds or updates a project
  app.post("/api/projects", (req, res) => {
    try {
      const db = readDB();
      const project = req.body;

      if (!project.title || !project.description || !project.category) {
        return res.status(400).json({ error: "Missing required project fields" });
      }

      if (project.id) {
        // Update existing
        const index = db.projects.findIndex(p => p.id === project.id);
        if (index !== -1) {
          db.projects[index] = { ...db.projects[index], ...project };
        } else {
          db.projects.push(project);
        }
      } else {
        // Create new
        project.id = Date.now().toString();
        db.projects.push(project);
      }

      writeDB(db);
      res.json({ success: true, projects: db.projects });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to save project", details: error.message });
    }
  });

  // DELETE /api/projects/:id - Deletes a project
  app.delete("/api/projects/:id", (req, res) => {
    try {
      const db = readDB();
      const { id } = req.params;
      db.projects = db.projects.filter(p => p.id !== id);
      writeDB(db);
      res.json({ success: true, projects: db.projects });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete project", details: error.message });
    }
  });

  // POST /api/skills - Adds or updates a skill
  app.post("/api/skills", (req, res) => {
    try {
      const db = readDB();
      const skill = req.body;

      if (!skill.name || !skill.category || skill.level === undefined) {
        return res.status(400).json({ error: "Missing required skill fields" });
      }

      if (skill.id) {
        const index = db.skills.findIndex(s => s.id === skill.id);
        if (index !== -1) {
          db.skills[index] = { ...db.skills[index], ...skill };
        } else {
          db.skills.push(skill);
        }
      } else {
        skill.id = Date.now().toString();
        db.skills.push(skill);
      }

      writeDB(db);
      res.json({ success: true, skills: db.skills });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to save skill", details: error.message });
    }
  });

  // DELETE /api/skills/:id - Deletes a skill
  app.delete("/api/skills/:id", (req, res) => {
    try {
      const db = readDB();
      const { id } = req.params;
      db.skills = db.skills.filter(s => s.id !== id);
      writeDB(db);
      res.json({ success: true, skills: db.skills });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete skill", details: error.message });
    }
  });

  // GET /api/messages - Returns list of contact messages (Admin only view, but public for portfolio demo)
  app.get("/api/messages", (req, res) => {
    try {
      const db = readDB();
      res.json(db.messages);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // POST /api/messages - Submits contact message from the frontend contact form
  app.post("/api/messages", (req, res) => {
    try {
      const db = readDB();
      const { name, email, subject, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required fields" });
      }

      const newMessage = {
        id: Date.now().toString(),
        name,
        email,
        subject: subject || "No Subject",
        message,
        createdAt: new Date().toISOString(),
        read: false
      };

      db.messages.unshift(newMessage); // Insert at beginning of messages list
      writeDB(db);
      res.json({ success: true, message: "Your message was sent successfully!" });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to submit message", details: error.message });
    }
  });

  // POST /api/messages/:id/read - Toggles read state of a message
  app.post("/api/messages/:id/read", (req, res) => {
    try {
      const db = readDB();
      const { id } = req.params;
      const msg = db.messages.find(m => m.id === id);
      if (msg) {
        msg.read = !msg.read;
        writeDB(db);
      }
      res.json({ success: true, messages: db.messages });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update message read state" });
    }
  });

  // DELETE /api/messages/:id - Deletes a contact message
  app.delete("/api/messages/:id", (req, res) => {
    try {
      const db = readDB();
      const { id } = req.params;
      db.messages = db.messages.filter(m => m.id !== id);
      writeDB(db);
      res.json({ success: true, messages: db.messages });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  // POST /api/chat - Chats with the AI Representative (represents Alex)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const db = readDB();
      const settings = db.settings;
      const projectsText = db.projects.map(p => 
        `- ${p.title} (${p.category}): ${p.description}. Tags: ${p.tags.join(", ")}. GitHub: ${p.githubUrl || 'N/A'}, Live URL: ${p.liveUrl || 'N/A'}`
      ).join("\n");
      const skillsText = db.skills.map(s => `- ${s.name} (${s.category}): Level ${s.level}%`).join("\n");

      // Construct a highly rich system prompt with portfolio context
      const fullSystemInstruction = `${settings.aiPersona}

You are answering questions on behalf of Alex.
Here is the official up-to-date portfolio context you MUST use:
PROFILE DETAILS:
- Name: ${settings.name}
- Current Title: ${settings.title}
- Subtitle: ${settings.subtitle}
- Short Bio: ${settings.bio}
- Contact Email: ${settings.email}
- GitHub: ${settings.github}
- LinkedIn: ${settings.linkedin}

PROJECTS ALREADY BUILT:
${projectsText}

SKILLS INVENTORY:
${skillsText}

Answer the user directly, keep your responses friendly, visually formatted (with bullet points or short paragraphs), and professional. If they ask to contact Alex, supply his official contact details: ${settings.email}. Make sure to suggest they use the "Contact Form" on the website!`;

      const client = getAIClient();
      if (!client) {
        // Fallback mock response if GEMINI_API_KEY is missing
        const mockResponses = [
          `Hi there! (Note: Gemini API is running in Demo Mode). I'm Alex's AI portfolio representative. Based on his profile, Alex is a **${settings.title}** specializing in React, Node.js, and generative AI. He's built impressive systems like **Synthia AI** and **ChronoPlanner**. Feel free to send a contact message or email him at **${settings.email}**!`,
          `Hello! I am Alex's AI assistant. He loves building full-stack applications with elegant visual micro-interactions. If you want to collaborate, feel free to use the contact form below or connect via LinkedIn!`,
          `Welcome to Alex Rivera's portfolio! I can tell you about his expertise in **${db.skills.slice(0, 3).map(s => s.name).join(", ")}** or walk you through his featured projects. What would you like to explore?`
        ];
        const randomMock = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        return res.json({ response: randomMock });
      }

      // Format history properly for @google/genai contents format
      const formattedContents = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          formattedContents.push({
            role: turn.sender === "user" ? "user" : "model",
            parts: [{ text: turn.text }]
          });
        }
      }
      formattedContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: fullSystemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ response: response.text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: "Gemini API failed to generate a response", details: error.message });
    }
  });

  // ---------------------------------------------------------------------------
  // Vite Integration & Static Asset Serving
  // ---------------------------------------------------------------------------

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
