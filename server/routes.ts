import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertToolUsageSchema, 
  insertUserFileSchema, 
  insertPdfLogSchema,
  insertAdminActivityLogSchema,
  insertSystemFeedbackSchema,
  insertBlogCategorySchema,
  insertBlogTagSchema,
  insertBlogPostSchema,
  insertBlogCommentSchema,
  insertBlogSubscriptionSchema
} from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware for admin authentication
  const requireAdmin = (req: any, res: any, next: any) => {
    // For now, use simple authentication - in production, use proper Firebase auth
    const adminPassword = req.headers['x-admin-password'] || req.query.admin_key;
    if (adminPassword !== 'purvish_admin_2025') {
      return res.status(401).json({ error: 'Unauthorized admin access' });
    }
    next();
  };

  // User management routes
  app.get('/api/users', async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await storage.getAllUsers(page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Invalid user data' });
    }
  });

  app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.updateUser(id, req.body);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  // Admin Panel Routes (SEO-hidden at /purvish_toolspravaah)
  app.get('/purvish_toolspravaah', requireAdmin, (req, res) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>PDFo Admin Panel</title>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
        <meta name="description" content="Admin panel for PDFo platform management">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
          .header { border-bottom: 1px solid #ddd; margin-bottom: 20px; padding-bottom: 10px; }
          .nav { display: flex; gap: 20px; margin: 20px 0; }
          .nav a { text-decoration: none; color: #0066cc; padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; }
          .nav a:hover { background: #f0f8ff; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
          .stat-card { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #0066cc; }
          .stat-number { font-size: 24px; font-weight: bold; color: #0066cc; }
          .stat-label { color: #666; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PDFo Admin Panel</h1>
            <p>Comprehensive platform management dashboard</p>
          </div>
          
          <div class="nav">
            <a href="/purvish_toolspravaah/users?admin_key=purvish_admin_2025">User Management</a>
            <a href="/purvish_toolspravaah/analytics?admin_key=purvish_admin_2025">Analytics</a>
            <a href="/purvish_toolspravaah/blog?admin_key=purvish_admin_2025">Blog CMS</a>
            <a href="/purvish_toolspravaah/feedback?admin_key=purvish_admin_2025">Feedback System</a>
            <a href="/purvish_toolspravaah/security?admin_key=purvish_admin_2025">Security Logs</a>
          </div>

          <div class="stats">
            <div class="stat-card">
              <div class="stat-number" id="totalUsers">Loading...</div>
              <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-card">
              <div class="stat-number" id="todayActivity">Loading...</div>
              <div class="stat-label">Today's Activity</div>
            </div>
            <div class="stat-card">
              <div class="stat-number" id="totalProcessed">Loading...</div>
              <div class="stat-label">Files Processed</div>
            </div>
            <div class="stat-card">
              <div class="stat-number" id="pendingFeedback">Loading...</div>
              <div class="stat-label">Pending Feedback</div>
            </div>
          </div>

          <div style="margin-top: 30px;">
            <h3>Quick Actions</h3>
            <p><a href="/purvish_toolspravaah/export?admin_key=purvish_admin_2025">Export Analytics Data</a></p>
            <p><a href="/purvish_toolspravaah/backup?admin_key=purvish_admin_2025">Database Backup</a></p>
            <p><a href="/purvish_toolspravaah/logs?admin_key=purvish_admin_2025">View System Logs</a></p>
          </div>
        </div>

        <script>
          // Load dashboard stats
          fetch('/api/admin/stats?admin_key=purvish_admin_2025')
            .then(res => res.json())
            .then(data => {
              document.getElementById('totalUsers').textContent = data.totalUsers || '0';
              document.getElementById('todayActivity').textContent = data.todayActivity || '0';
              document.getElementById('totalProcessed').textContent = data.totalProcessed || '0';
              document.getElementById('pendingFeedback').textContent = data.pendingFeedback || '0';
            })
            .catch(err => console.error('Failed to load stats:', err));
        </script>
      </body>
      </html>
    `);
  });

  // Admin API routes
  app.get('/api/admin/stats', requireAdmin, async (req, res) => {
    try {
      const globalStats = await storage.getGlobalToolUsageStats();
      const pendingFeedback = await storage.getAllSystemFeedback('pending');
      
      res.json({
        totalUsers: globalStats.totalUsers,
        todayActivity: globalStats.dailyActivity[0]?.count || 0,
        totalProcessed: globalStats.totalProcessedFiles,
        pendingFeedback: pendingFeedback.total
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
  });

  // Blog management routes
  app.get('/api/blog/categories', async (req, res) => {
    try {
      const categories = await storage.getAllBlogCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  app.post('/api/blog/categories', requireAdmin, async (req, res) => {
    try {
      const categoryData = insertBlogCategorySchema.parse(req.body);
      const category = await storage.createBlogCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: 'Invalid category data' });
    }
  });

  app.get('/api/blog/posts', async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      
      const result = status === 'published' 
        ? await storage.getPublishedBlogPosts(page, limit)
        : await storage.getAllBlogPosts(status, page, limit);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });

  app.get('/api/blog/posts/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      // Increment view count for published posts
      if (post.status === 'published') {
        await storage.incrementBlogPostViews(post.id);
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  });

  app.post('/api/blog/posts', requireAdmin, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: 'Invalid post data' });
    }
  });

  // Blog subscription routes
  app.post('/api/blog/subscribe', async (req, res) => {
    try {
      const subscriptionData = insertBlogSubscriptionSchema.parse(req.body);
      const subscription = await storage.createBlogSubscription({
        ...subscriptionData,
        unsubscribeToken: crypto.randomUUID()
      });
      res.status(201).json({ message: 'Subscription created successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Invalid subscription data' });
    }
  });

  // Feedback system routes
  app.get('/api/feedback', requireAdmin, async (req, res) => {
    try {
      const status = req.query.status as string;
      const category = req.query.category as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await storage.getAllSystemFeedback(status, category, page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch feedback' });
    }
  });

  app.post('/api/feedback', async (req, res) => {
    try {
      const feedbackData = insertSystemFeedbackSchema.parse(req.body);
      const feedback = await storage.createSystemFeedback(feedbackData);
      res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Invalid feedback data' });
    }
  });

  // Tool usage tracking
  app.post('/api/tool-usage', async (req, res) => {
    try {
      const usageData = insertToolUsageSchema.parse(req.body);
      const usage = await storage.createToolUsage(usageData);
      res.status(201).json(usage);
    } catch (error) {
      res.status(400).json({ error: 'Invalid usage data' });
    }
  });

  app.get('/api/tool-usage/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const timeRange = req.query.timeRange as 'today' | 'week' | 'month' | 'all';
      const usage = await storage.getUserToolUsage(userId, timeRange);
      res.json(usage);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tool usage' });
    }
  });

  app.get('/api/tool-usage-stats/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const stats = await storage.getToolUsageStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tool usage stats' });
    }
  });

  // PDF logs
  app.post('/api/pdf-logs', async (req, res) => {
    try {
      const logData = insertPdfLogSchema.parse(req.body);
      const log = await storage.createPdfLog(logData);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ error: 'Invalid log data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}