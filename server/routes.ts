import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertToolUsageSchema, 
  insertUserFileSchema, 
  insertPdfLogSchema,
  insertAdminSchema,
  insertBlogPostSchema,
  insertBlogCategorySchema,
  insertSystemAnalyticsSchema,
  insertUserPreferencesSchema
} from "@shared/schema";

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

  // Admin management routes
  app.post("/api/admin/create", async (req, res) => {
    try {
      const adminData = insertAdminSchema.parse(req.body);
      const admin = await storage.createAdmin(adminData);
      res.json(admin);
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({ error: "Failed to create admin" });
    }
  });

  app.get("/api/admin/check/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const isAdmin = await storage.isUserAdmin(userId);
      res.json({ isAdmin });
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ error: "Failed to check admin status" });
    }
  });

  app.get("/api/admin/all", async (req, res) => {
    try {
      const admins = await storage.getAllAdmins();
      res.json(admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ error: "Failed to fetch admins" });
    }
  });

  // Blog management routes
  app.post("/api/blog/posts", async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.put("/api/blog/posts/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const postData = req.body;
      const post = await storage.updateBlogPost(id, postData);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/posts/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  app.get("/api/blog/posts", async (req, res) => {
    try {
      const status = req.query.status as string;
      const posts = await storage.getAllBlogPosts(status);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/published", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const posts = await storage.getPublishedBlogPosts(limit, offset);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching published blog posts:", error);
      res.status(500).json({ error: "Failed to fetch published blog posts" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      await storage.incrementBlogPostViews(post.id);
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Blog categories routes
  app.post("/api/blog/categories", async (req, res) => {
    try {
      const categoryData = insertBlogCategorySchema.parse(req.body);
      const category = await storage.createBlogCategory(categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error creating blog category:", error);
      res.status(500).json({ error: "Failed to create blog category" });
    }
  });

  app.get("/api/blog/categories", async (req, res) => {
    try {
      const categories = await storage.getAllBlogCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      res.status(500).json({ error: "Failed to fetch blog categories" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/dashboard", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  app.post("/api/analytics/system", async (req, res) => {
    try {
      const analyticsData = insertSystemAnalyticsSchema.parse(req.body);
      const analytics = await storage.createSystemAnalytics(analyticsData);
      res.json(analytics);
    } catch (error) {
      console.error("Error creating system analytics:", error);
      res.status(500).json({ error: "Failed to create system analytics" });
    }
  });

  // User preferences routes
  app.post("/api/users/:userId/preferences", async (req, res) => {
    try {
      const userId = req.params.userId;
      const preferencesData = { ...insertUserPreferencesSchema.parse(req.body), userId };
      const preferences = await storage.createUserPreferences(preferencesData);
      res.json(preferences);
    } catch (error) {
      console.error("Error creating user preferences:", error);
      res.status(500).json({ error: "Failed to create user preferences" });
    }
  });

  app.get("/api/users/:userId/preferences", async (req, res) => {
    try {
      const userId = req.params.userId;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ error: "Failed to fetch user preferences" });
    }
  });

  // Export routes for data download
  app.get("/api/analytics/export/usage/:format", async (req, res) => {
    try {
      const format = req.params.format;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      
      const stats = await storage.getDashboardStats();
      
      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="usage-report.json"');
        res.json({
          exportDate: new Date(),
          dateRange: { startDate, endDate },
          ...stats
        });
      } else if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="usage-report.csv"');
        
        // CSV format for top tools
        const csvHeader = 'Tool Name,Usage Count,Category\n';
        const csvRows = stats.topTools.map(tool => 
          `"${tool.name}",${tool.count},"${tool.category}"`
        ).join('\n');
        
        res.send(csvHeader + csvRows);
      } else {
        res.status(400).json({ error: "Unsupported export format" });
      }
    } catch (error) {
      console.error("Error exporting usage data:", error);
      res.status(500).json({ error: "Failed to export usage data" });
    }
  });

  // Admin subdomain/route handling
  app.get("/admin*", (req, res) => {
    // Check if request is for admin subdomain or admin routes
    const host = req.get('host') || '';
    const isAdminSubdomain = host.startsWith('admin.');
    const isAdminRoute = req.path.startsWith('/admin');
    
    if (isAdminSubdomain || isAdminRoute) {
      // Serve admin HTML
      res.sendFile('admin.html', { root: '.' });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
