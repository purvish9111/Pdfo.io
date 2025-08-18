import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertToolUsageSchema, insertUserFileSchema, insertPdfLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  });

  // User management routes
  app.post("/api/user", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByFirebaseUid(userData.firebaseUid);
      if (existingUser) {
        return res.json(existingUser);
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/user/firebase/:uid", async (req, res) => {
    try {
      const user = await storage.getUserByFirebaseUid(req.params.uid);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Tool usage tracking routes
  app.post("/api/user/usage", async (req, res) => {
    try {
      const usageData = insertToolUsageSchema.parse(req.body);
      const usage = await storage.createToolUsage(usageData);
      res.json(usage);
    } catch (error) {
      console.error("Error creating tool usage:", error);
      res.status(400).json({ error: "Invalid usage data" });
    }
  });

  app.get("/api/user/stats/:userId", async (req, res) => {
    try {
      const stats = await storage.getToolUsageStats(req.params.userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/user/usage/:userId", async (req, res) => {
    try {
      const timeRange = req.query.timeRange as 'today' | 'week' | 'month' | 'all' | undefined;
      const usage = await storage.getUserToolUsage(req.params.userId, timeRange);
      res.json(usage);
    } catch (error) {
      console.error("Error fetching user usage:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // File management routes
  app.post("/api/user/files", async (req, res) => {
    try {
      const fileData = insertUserFileSchema.parse(req.body);
      
      // Set expiry to 1 hour from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
      fileData.expiresAt = expiresAt;
      
      const file = await storage.createUserFile(fileData);
      res.json(file);
    } catch (error) {
      console.error("Error creating user file:", error);
      res.status(400).json({ error: "Invalid file data" });
    }
  });

  app.get("/api/user/files/:userId", async (req, res) => {
    try {
      const files = await storage.getUserFiles(req.params.userId);
      res.json(files);
    } catch (error) {
      console.error("Error fetching user files:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/user/files/:fileId", async (req, res) => {
    try {
      const deleted = await storage.deleteUserFile(req.params.fileId);
      if (!deleted) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user file:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/user/files/download/:fileId", async (req, res) => {
    try {
      const file = await storage.getUserFile(req.params.fileId);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      
      // In a real implementation, you would serve the actual file
      // For now, return file metadata
      res.json({
        id: file.id,
        originalName: file.originalName,
        fileName: file.fileName,
        filePath: file.filePath,
        mimeType: file.mimeType,
        fileSize: file.fileSize,
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // PDF processing logs
  app.post("/api/user/logs", async (req, res) => {
    try {
      const logData = insertPdfLogSchema.parse(req.body);
      const log = await storage.createPdfLog(logData);
      res.json(log);
    } catch (error) {
      console.error("Error creating PDF log:", error);
      res.status(400).json({ error: "Invalid log data" });
    }
  });

  app.get("/api/user/logs/:userId", async (req, res) => {
    try {
      const logs = await storage.getUserPdfLogs(req.params.userId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching user logs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Cleanup expired files endpoint (can be called by a cron job)
  app.post("/api/cleanup/expired-files", async (req, res) => {
    try {
      const deletedCount = await storage.deleteExpiredFiles();
      res.json({ 
        success: true, 
        deletedFiles: deletedCount,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error cleaning up expired files:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // PDF processing endpoint (keeping existing functionality)
  app.post("/api/pdf/log", async (req, res) => {
    try {
      const { tool, filename, status } = req.body;
      
      // In a real implementation, you might log to database
      console.log(`PDF Processing Log: ${tool} - ${filename} - ${status}`);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to log PDF processing" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
