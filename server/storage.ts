import { 
  User, 
  InsertUser, 
  ToolUsage, 
  InsertToolUsage, 
  UserFile, 
  InsertUserFile, 
  PdfLog, 
  InsertPdfLog,
  Admin,
  InsertAdmin,
  BlogPost,
  InsertBlogPost,
  BlogCategory,
  InsertBlogCategory,
  SystemAnalytics,
  InsertSystemAnalytics,
  UserPreferences,
  InsertUserPreferences
} from "@shared/schema";

export interface IStorage {
  // User management
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | null>;
  updateUser(id: string, user: Partial<User>): Promise<User | null>;

  // Tool usage tracking
  createToolUsage(usage: InsertToolUsage): Promise<ToolUsage>;
  getUserToolUsage(userId: string, timeRange?: 'today' | 'week' | 'month' | 'all'): Promise<ToolUsage[]>;
  getToolUsageStats(userId: string): Promise<{
    totalUsage: number;
    todayUsage: number;
    weekUsage: number;
    monthUsage: number;
    favoriteTools: Array<{ toolName: string; count: number; category: string }>;
    recentActivity: Array<{ toolName: string; timestamp: string; filesProcessed: number }>;
    categoryStats: Record<string, number>;
  }>;

  // File management
  createUserFile(file: InsertUserFile): Promise<UserFile>;
  getUserFiles(userId: string): Promise<UserFile[]>;
  deleteUserFile(id: string): Promise<boolean>;
  deleteExpiredFiles(): Promise<number>;
  getUserFile(id: string): Promise<UserFile | null>;

  // PDF processing logs
  createPdfLog(log: InsertPdfLog): Promise<PdfLog>;
  getUserPdfLogs(userId: string): Promise<PdfLog[]>;

  // Admin management
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  getAdminByUserId(userId: string): Promise<Admin | null>;
  isUserAdmin(userId: string): Promise<boolean>;
  getAllAdmins(): Promise<Admin[]>;

  // Blog management
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost | null>;
  deleteBlogPost(id: string): Promise<boolean>;
  getBlogPost(id: string): Promise<BlogPost | null>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | null>;
  getAllBlogPosts(status?: string): Promise<BlogPost[]>;
  getPublishedBlogPosts(limit?: number, offset?: number): Promise<BlogPost[]>;
  incrementBlogPostViews(id: string): Promise<void>;

  // Blog categories
  createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory>;
  updateBlogCategory(id: string, category: Partial<BlogCategory>): Promise<BlogCategory | null>;
  deleteBlogCategory(id: string): Promise<boolean>;
  getAllBlogCategories(): Promise<BlogCategory[]>;
  getBlogCategory(id: string): Promise<BlogCategory | null>;

  // System analytics
  createSystemAnalytics(analytics: InsertSystemAnalytics): Promise<SystemAnalytics>;
  getSystemAnalytics(startDate: Date, endDate: Date): Promise<SystemAnalytics[]>;
  getLatestSystemAnalytics(): Promise<SystemAnalytics | null>;
  getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalToolUsage: number;
    totalFilesProcessed: number;
    errorRate: number;
    avgProcessingTime: number;
    topTools: Array<{ name: string; count: number; category: string }>;
    userGrowth: Array<{ date: string; count: number }>;
    toolUsageByCategory: Record<string, number>;
  }>;

  // User preferences
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences | null>;
  getUserPreferences(userId: string): Promise<UserPreferences | null>;
}

// In-memory storage implementation for development
class MemStorage implements IStorage {
  private users: User[] = [];
  private toolUsage: ToolUsage[] = [];
  private userFiles: UserFile[] = [];
  private pdfLogs: PdfLog[] = [];
  private admins: Admin[] = [];
  private blogPosts: BlogPost[] = [];
  private blogCategories: BlogCategory[] = [];
  private systemAnalytics: SystemAnalytics[] = [];
  private userPreferences: UserPreferences[] = [];

  // User management
  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: crypto.randomUUID(),
      ...user,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.users.find(u => u.firebaseUid === firebaseUid) || null;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    this.users[index] = { 
      ...this.users[index], 
      ...user, 
      updatedAt: new Date() 
    };
    return this.users[index];
  }

  // Tool usage tracking
  async createToolUsage(usage: InsertToolUsage): Promise<ToolUsage> {
    const newUsage: ToolUsage = {
      id: crypto.randomUUID(),
      ...usage,
      filesProcessed: usage.filesProcessed || null,
      metadata: usage.metadata || null,
      timestamp: new Date(),
    };
    this.toolUsage.push(newUsage);
    return newUsage;
  }

  async getUserToolUsage(userId: string, timeRange?: 'today' | 'week' | 'month' | 'all'): Promise<ToolUsage[]> {
    let usages = this.toolUsage.filter(u => u.userId === userId);
    
    if (timeRange && timeRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (timeRange) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }
      
      usages = usages.filter(u => u.timestamp >= cutoff);
    }
    
    return usages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getToolUsageStats(userId: string) {
    const allUsage = await this.getUserToolUsage(userId, 'all');
    const todayUsage = await this.getUserToolUsage(userId, 'today');
    const weekUsage = await this.getUserToolUsage(userId, 'week');
    const monthUsage = await this.getUserToolUsage(userId, 'month');

    // Calculate favorite tools
    const toolCounts = new Map<string, { count: number; category: string }>();
    allUsage.forEach(usage => {
      const current = toolCounts.get(usage.toolName) || { count: 0, category: usage.toolType };
      toolCounts.set(usage.toolName, { 
        ...current, 
        count: current.count + (usage.filesProcessed || 1) 
      });
    });

    const favoriteTools = Array.from(toolCounts.entries())
      .map(([toolName, data]) => ({ toolName, count: data.count, category: data.category }))
      .sort((a, b) => b.count - a.count);

    // Recent activity
    const recentActivity = allUsage.slice(0, 10).map(usage => ({
      toolName: usage.toolName,
      timestamp: usage.timestamp.toISOString(),
      filesProcessed: usage.filesProcessed || 1,
    }));

    // Category stats
    const categoryStats: Record<string, number> = {};
    allUsage.forEach(usage => {
      categoryStats[usage.toolType] = (categoryStats[usage.toolType] || 0) + (usage.filesProcessed || 1);
    });

    return {
      totalUsage: allUsage.reduce((sum, u) => sum + (u.filesProcessed || 1), 0),
      todayUsage: todayUsage.reduce((sum, u) => sum + (u.filesProcessed || 1), 0),
      weekUsage: weekUsage.reduce((sum, u) => sum + (u.filesProcessed || 1), 0),
      monthUsage: monthUsage.reduce((sum, u) => sum + (u.filesProcessed || 1), 0),
      favoriteTools,
      recentActivity,
      categoryStats,
    };
  }

  // File management
  async createUserFile(file: InsertUserFile): Promise<UserFile> {
    const newFile: UserFile = {
      id: crypto.randomUUID(),
      ...file,
      toolUsed: file.toolUsed || null,
      uploadedAt: new Date(),
    };
    this.userFiles.push(newFile);
    return newFile;
  }

  async getUserFiles(userId: string): Promise<UserFile[]> {
    // Clean up expired files first
    await this.deleteExpiredFiles();
    
    return this.userFiles
      .filter(f => f.userId === userId)
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }

  async deleteUserFile(id: string): Promise<boolean> {
    const index = this.userFiles.findIndex(f => f.id === id);
    if (index === -1) return false;
    
    this.userFiles.splice(index, 1);
    return true;
  }

  async deleteExpiredFiles(): Promise<number> {
    const now = new Date();
    const expired = this.userFiles.filter(f => f.expiresAt < now);
    
    this.userFiles = this.userFiles.filter(f => f.expiresAt >= now);
    
    return expired.length;
  }

  async getUserFile(id: string): Promise<UserFile | null> {
    return this.userFiles.find(f => f.id === id) || null;
  }

  // PDF processing logs
  async createPdfLog(log: InsertPdfLog): Promise<PdfLog> {
    const newLog: PdfLog = {
      id: crypto.randomUUID(),
      ...log,
      userId: log.userId || null,
      fileName: log.fileName || null,
      fileSize: log.fileSize || null,
      processingTime: log.processingTime || null,
      errorMessage: log.errorMessage || null,
      timestamp: new Date(),
    };
    this.pdfLogs.push(newLog);
    return newLog;
  }

  async getUserPdfLogs(userId: string): Promise<PdfLog[]> {
    return this.pdfLogs
      .filter(l => l.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Admin management
  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const newAdmin: Admin = {
      id: crypto.randomUUID(),
      ...admin,
      permissions: admin.permissions || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.admins.push(newAdmin);
    return newAdmin;
  }

  async getAdminByUserId(userId: string): Promise<Admin | null> {
    return this.admins.find(admin => admin.userId === userId) || null;
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    return this.admins.some(admin => admin.userId === userId);
  }

  async getAllAdmins(): Promise<Admin[]> {
    return this.admins.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Blog management
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const newPost: BlogPost = {
      id: crypto.randomUUID(),
      ...post,
      excerpt: post.excerpt || null,
      featuredImage: post.featuredImage || null,
      tags: post.tags || null,
      metaTitle: post.metaTitle || null,
      metaDescription: post.metaDescription || null,
      readingTime: post.readingTime || null,
      viewCount: 0,
      publishedAt: post.publishedAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.push(newPost);
    return newPost;
  }

  async updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost | null> {
    const index = this.blogPosts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.blogPosts[index] = { 
      ...this.blogPosts[index], 
      ...post, 
      updatedAt: new Date() 
    };
    return this.blogPosts[index];
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const index = this.blogPosts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.blogPosts.splice(index, 1);
    return true;
  }

  async getBlogPost(id: string): Promise<BlogPost | null> {
    return this.blogPosts.find(p => p.id === id) || null;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    return this.blogPosts.find(p => p.slug === slug) || null;
  }

  async getAllBlogPosts(status?: string): Promise<BlogPost[]> {
    let posts = this.blogPosts;
    if (status) {
      posts = posts.filter(p => p.status === status);
    }
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPublishedBlogPosts(limit = 10, offset = 0): Promise<BlogPost[]> {
    return this.blogPosts
      .filter(p => p.status === 'published')
      .sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime())
      .slice(offset, offset + limit);
  }

  async incrementBlogPostViews(id: string): Promise<void> {
    const post = this.blogPosts.find(p => p.id === id);
    if (post) {
      post.viewCount = (post.viewCount || 0) + 1;
    }
  }

  // Blog categories
  async createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory> {
    const newCategory: BlogCategory = {
      id: crypto.randomUUID(),
      ...category,
      description: category.description || null,
      createdAt: new Date(),
    };
    this.blogCategories.push(newCategory);
    return newCategory;
  }

  async updateBlogCategory(id: string, category: Partial<BlogCategory>): Promise<BlogCategory | null> {
    const index = this.blogCategories.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.blogCategories[index] = { 
      ...this.blogCategories[index], 
      ...category 
    };
    return this.blogCategories[index];
  }

  async deleteBlogCategory(id: string): Promise<boolean> {
    const index = this.blogCategories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.blogCategories.splice(index, 1);
    return true;
  }

  async getAllBlogCategories(): Promise<BlogCategory[]> {
    return this.blogCategories.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getBlogCategory(id: string): Promise<BlogCategory | null> {
    return this.blogCategories.find(c => c.id === id) || null;
  }

  // System analytics
  async createSystemAnalytics(analytics: InsertSystemAnalytics): Promise<SystemAnalytics> {
    const newAnalytics: SystemAnalytics = {
      id: crypto.randomUUID(),
      ...analytics,
      topTools: analytics.topTools || null,
      metadata: analytics.metadata || null,
    };
    this.systemAnalytics.push(newAnalytics);
    return newAnalytics;
  }

  async getSystemAnalytics(startDate: Date, endDate: Date): Promise<SystemAnalytics[]> {
    return this.systemAnalytics
      .filter(a => a.date >= startDate && a.date <= endDate)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async getLatestSystemAnalytics(): Promise<SystemAnalytics | null> {
    return this.systemAnalytics
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0] || null;
  }

  async getDashboardStats() {
    const totalUsers = this.users.length;
    const totalToolUsage = this.toolUsage.length;
    const totalFilesProcessed = this.userFiles.length;
    const errorCount = this.pdfLogs.filter(log => log.status === 'error').length;
    const successCount = this.pdfLogs.filter(log => log.status === 'success').length;
    const errorRate = successCount > 0 ? (errorCount / (errorCount + successCount)) * 100 : 0;

    // Calculate active users (users with activity in last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const activeUsers = new Set(
      this.toolUsage
        .filter(usage => usage.timestamp >= weekAgo)
        .map(usage => usage.userId)
    ).size;

    // Calculate average processing time
    const processingTimes = this.pdfLogs
      .filter(log => log.processingTime !== null)
      .map(log => log.processingTime!);
    const avgProcessingTime = processingTimes.length > 0 
      ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length 
      : 0;

    // Top tools
    const toolCounts = this.toolUsage.reduce((acc, usage) => {
      acc[usage.toolName] = (acc[usage.toolName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTools = Object.entries(toolCounts)
      .map(([name, count]) => ({ 
        name, 
        count, 
        category: this.toolUsage.find(t => t.toolName === name)?.toolType || 'unknown'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // User growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const userGrowth = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = this.users.filter(u => 
        u.createdAt <= date
      ).length;
      userGrowth.push({ date: dateStr, count });
    }

    // Tool usage by category
    const toolUsageByCategory = this.toolUsage.reduce((acc, usage) => {
      const category = usage.toolType || 'unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalUsers,
      activeUsers,
      totalToolUsage,
      totalFilesProcessed,
      errorRate,
      avgProcessingTime,
      topTools,
      userGrowth,
      toolUsageByCategory,
    };
  }

  // User preferences
  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const newPreferences: UserPreferences = {
      id: crypto.randomUUID(),
      ...preferences,
      favoriteTools: preferences.favoriteTools || null,
      emailNotifications: preferences.emailNotifications || null,
      dashboardLayout: preferences.dashboardLayout || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userPreferences.push(newPreferences);
    return newPreferences;
  }

  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences | null> {
    const index = this.userPreferences.findIndex(p => p.userId === userId);
    if (index === -1) return null;
    
    this.userPreferences[index] = { 
      ...this.userPreferences[index], 
      ...preferences, 
      updatedAt: new Date() 
    };
    return this.userPreferences[index];
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    return this.userPreferences.find(p => p.userId === userId) || null;
  }
}

export const storage = new MemStorage();