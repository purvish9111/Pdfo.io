import { 
  User, 
  InsertUser, 
  ToolUsage, 
  InsertToolUsage, 
  UserFile, 
  InsertUserFile, 
  PdfLog, 
  InsertPdfLog,
  AdminActivityLog,
  InsertAdminActivityLog,
  SystemFeedback,
  InsertSystemFeedback,
  BlogCategory,
  InsertBlogCategory,
  BlogTag,
  InsertBlogTag,
  BlogPost,
  InsertBlogPost,
  BlogComment,
  InsertBlogComment,
  BlogSubscription,
  InsertBlogSubscription,
  AdminAccessLog,
  InsertAdminAccessLog,
  FailedLoginAttempt,
  InsertFailedLoginAttempt
} from "@shared/schema";

export interface IStorage {
  // User management
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | null>;
  updateUser(id: string, user: Partial<User>): Promise<User | null>;
  getAllUsers(page?: number, limit?: number): Promise<{ users: User[]; total: number }>;
  promoteUserToAdmin(userId: string, role: 'admin' | 'moderator' | 'super_admin'): Promise<User | null>;

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
  getGlobalToolUsageStats(): Promise<{
    totalUsers: number;
    totalProcessedFiles: number;
    popularTools: Array<{ toolName: string; count: number; category: string }>;
    dailyActivity: Array<{ date: string; count: number }>;
    categoryDistribution: Record<string, number>;
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

  // Admin Activity Logs
  createAdminActivityLog(log: InsertAdminActivityLog): Promise<AdminActivityLog>;
  getAdminActivityLogs(page?: number, limit?: number): Promise<{ logs: AdminActivityLog[]; total: number }>;
  getAdminActivityLogsByUser(userId: string): Promise<AdminActivityLog[]>;

  // System Feedback
  createSystemFeedback(feedback: InsertSystemFeedback): Promise<SystemFeedback>;
  getAllSystemFeedback(status?: string, category?: string, page?: number, limit?: number): Promise<{ feedback: SystemFeedback[]; total: number }>;
  updateSystemFeedback(id: string, updates: Partial<SystemFeedback>): Promise<SystemFeedback | null>;
  getSystemFeedbackById(id: string): Promise<SystemFeedback | null>;

  // Blog Categories
  createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory>;
  getAllBlogCategories(): Promise<BlogCategory[]>;
  getBlogCategoryById(id: string): Promise<BlogCategory | null>;
  getBlogCategoryBySlug(slug: string): Promise<BlogCategory | null>;
  updateBlogCategory(id: string, updates: Partial<BlogCategory>): Promise<BlogCategory | null>;
  deleteBlogCategory(id: string): Promise<boolean>;

  // Blog Tags
  createBlogTag(tag: InsertBlogTag): Promise<BlogTag>;
  getAllBlogTags(): Promise<BlogTag[]>;
  getBlogTagById(id: string): Promise<BlogTag | null>;
  getBlogTagBySlug(slug: string): Promise<BlogTag | null>;
  updateBlogTag(id: string, updates: Partial<BlogTag>): Promise<BlogTag | null>;
  deleteBlogTag(id: string): Promise<boolean>;

  // Blog Posts
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getAllBlogPosts(status?: string, page?: number, limit?: number): Promise<{ posts: BlogPost[]; total: number }>;
  getPublishedBlogPosts(page?: number, limit?: number): Promise<{ posts: BlogPost[]; total: number }>;
  getBlogPostById(id: string): Promise<BlogPost | null>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | null>;
  getBlogPostsByCategory(categoryId: string, page?: number, limit?: number): Promise<{ posts: BlogPost[]; total: number }>;
  getBlogPostsByTag(tagId: string, page?: number, limit?: number): Promise<{ posts: BlogPost[]; total: number }>;
  updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null>;
  deleteBlogPost(id: string): Promise<boolean>;
  incrementBlogPostViews(id: string): Promise<void>;

  // Blog Comments
  createBlogComment(comment: InsertBlogComment): Promise<BlogComment>;
  getBlogCommentsByPost(postId: string): Promise<BlogComment[]>;
  getBlogCommentById(id: string): Promise<BlogComment | null>;
  updateBlogComment(id: string, updates: Partial<BlogComment>): Promise<BlogComment | null>;
  deleteBlogComment(id: string): Promise<boolean>;
  approveBlogComment(id: string): Promise<BlogComment | null>;

  // Blog Subscriptions
  createBlogSubscription(subscription: InsertBlogSubscription): Promise<BlogSubscription>;
  getBlogSubscriptionByEmail(email: string): Promise<BlogSubscription | null>;
  updateBlogSubscription(id: string, updates: Partial<BlogSubscription>): Promise<BlogSubscription | null>;
  unsubscribeBlog(token: string): Promise<boolean>;
  getAllBlogSubscriptions(): Promise<BlogSubscription[]>;

  // Admin Access Logs
  createAdminAccessLog(log: InsertAdminAccessLog): Promise<AdminAccessLog>;
  getAdminAccessLogs(page?: number, limit?: number): Promise<{ logs: AdminAccessLog[]; total: number }>;

  // Failed Login Attempts
  createFailedLoginAttempt(attempt: InsertFailedLoginAttempt): Promise<FailedLoginAttempt>;
  getFailedLoginAttempts(ipAddress?: string): Promise<FailedLoginAttempt[]>;
  clearFailedLoginAttempts(ipAddress: string): Promise<boolean>;
}

// In-memory storage implementation for development
class MemStorage implements IStorage {
  private users: User[] = [];
  private toolUsage: ToolUsage[] = [];
  private userFiles: UserFile[] = [];
  private pdfLogs: PdfLog[] = [];
  private adminActivityLogs: AdminActivityLog[] = [];
  private systemFeedback: SystemFeedback[] = [];
  private blogCategories: BlogCategory[] = [];
  private blogTags: BlogTag[] = [];
  private blogPosts: BlogPost[] = [];
  private blogComments: BlogComment[] = [];
  private blogSubscriptions: BlogSubscription[] = [];
  private adminAccessLogs: AdminAccessLog[] = [];
  private failedLoginAttempts: FailedLoginAttempt[] = [];

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

  async getAllUsers(page = 1, limit = 20): Promise<{ users: User[]; total: number }> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return {
      users: this.users.slice(startIndex, endIndex),
      total: this.users.length
    };
  }

  async promoteUserToAdmin(userId: string, role: 'admin' | 'moderator' | 'super_admin'): Promise<User | null> {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;
    
    user.isAdmin = true;
    user.adminRole = role;
    user.updatedAt = new Date();
    return user;
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

  async getGlobalToolUsageStats(): Promise<{
    totalUsers: number;
    totalProcessedFiles: number;
    popularTools: Array<{ toolName: string; count: number; category: string }>;
    dailyActivity: Array<{ date: string; count: number }>;
    categoryDistribution: Record<string, number>;
  }> {
    const totalUsers = this.users.length;
    const totalProcessedFiles = this.toolUsage.reduce((sum, u) => sum + (u.filesProcessed || 1), 0);
    
    // Popular tools
    const toolCounts = new Map<string, { count: number; category: string }>();
    this.toolUsage.forEach(usage => {
      const current = toolCounts.get(usage.toolName) || { count: 0, category: usage.toolType };
      toolCounts.set(usage.toolName, { 
        ...current, 
        count: current.count + (usage.filesProcessed || 1) 
      });
    });

    const popularTools = Array.from(toolCounts.entries())
      .map(([toolName, data]) => ({ toolName, count: data.count, category: data.category }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Daily activity for last 7 days
    const dailyActivity: Array<{ date: string; count: number }> = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayUsage = this.toolUsage.filter(u => 
        u.timestamp >= dayStart && u.timestamp <= dayEnd
      );
      
      dailyActivity.push({
        date: date.toISOString().split('T')[0],
        count: dayUsage.reduce((sum, u) => sum + (u.filesProcessed || 1), 0)
      });
    }

    // Category distribution
    const categoryDistribution: Record<string, number> = {};
    this.toolUsage.forEach(usage => {
      categoryDistribution[usage.toolType] = (categoryDistribution[usage.toolType] || 0) + (usage.filesProcessed || 1);
    });

    return {
      totalUsers,
      totalProcessedFiles,
      popularTools,
      dailyActivity,
      categoryDistribution
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

  // Admin Activity Logs
  async createAdminActivityLog(log: InsertAdminActivityLog): Promise<AdminActivityLog> {
    const newLog: AdminActivityLog = {
      id: crypto.randomUUID(),
      ...log,
      targetId: log.targetId || null,
      targetType: log.targetType || null,
      ipAddress: log.ipAddress || null,
      userAgent: log.userAgent || null,
      metadata: log.metadata || null,
      timestamp: new Date(),
    };
    this.adminActivityLogs.push(newLog);
    return newLog;
  }

  async getAdminActivityLogs(page = 1, limit = 20): Promise<{ logs: AdminActivityLog[]; total: number }> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const sortedLogs = this.adminActivityLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return {
      logs: sortedLogs.slice(startIndex, endIndex),
      total: this.adminActivityLogs.length
    };
  }

  async getAdminActivityLogsByUser(userId: string): Promise<AdminActivityLog[]> {
    return this.adminActivityLogs
      .filter(l => l.adminUserId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // System Feedback
  async createSystemFeedback(feedback: InsertSystemFeedback): Promise<SystemFeedback> {
    const newFeedback: SystemFeedback = {
      id: crypto.randomUUID(),
      ...feedback,
      userId: feedback.userId || null,
      email: feedback.email || null,
      name: feedback.name || null,
      adminResponse: feedback.adminResponse || null,
      responseDate: feedback.responseDate || null,
      assignedTo: feedback.assignedTo || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.systemFeedback.push(newFeedback);
    return newFeedback;
  }

  async getAllSystemFeedback(status?: string, category?: string, page = 1, limit = 20): Promise<{ feedback: SystemFeedback[]; total: number }> {
    let filtered = this.systemFeedback;
    
    if (status) {
      filtered = filtered.filter(f => f.status === status);
    }
    if (category) {
      filtered = filtered.filter(f => f.category === category);
    }
    
    const sorted = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      feedback: sorted.slice(startIndex, endIndex),
      total: filtered.length
    };
  }

  async updateSystemFeedback(id: string, updates: Partial<SystemFeedback>): Promise<SystemFeedback | null> {
    const index = this.systemFeedback.findIndex(f => f.id === id);
    if (index === -1) return null;
    
    this.systemFeedback[index] = {
      ...this.systemFeedback[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.systemFeedback[index];
  }

  async getSystemFeedbackById(id: string): Promise<SystemFeedback | null> {
    return this.systemFeedback.find(f => f.id === id) || null;
  }

  // Blog Categories
  async createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory> {
    const newCategory: BlogCategory = {
      id: crypto.randomUUID(),
      ...category,
      description: category.description || null,
      parentId: category.parentId || null,
      createdAt: new Date(),
    };
    this.blogCategories.push(newCategory);
    return newCategory;
  }

  async getAllBlogCategories(): Promise<BlogCategory[]> {
    return this.blogCategories
      .filter(c => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getBlogCategoryById(id: string): Promise<BlogCategory | null> {
    return this.blogCategories.find(c => c.id === id) || null;
  }

  async getBlogCategoryBySlug(slug: string): Promise<BlogCategory | null> {
    return this.blogCategories.find(c => c.slug === slug) || null;
  }

  async updateBlogCategory(id: string, updates: Partial<BlogCategory>): Promise<BlogCategory | null> {
    const index = this.blogCategories.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.blogCategories[index] = {
      ...this.blogCategories[index],
      ...updates
    };
    return this.blogCategories[index];
  }

  async deleteBlogCategory(id: string): Promise<boolean> {
    const index = this.blogCategories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.blogCategories.splice(index, 1);
    return true;
  }

  // Blog Tags
  async createBlogTag(tag: InsertBlogTag): Promise<BlogTag> {
    const newTag: BlogTag = {
      id: crypto.randomUUID(),
      ...tag,
      description: tag.description || null,
      createdAt: new Date(),
    };
    this.blogTags.push(newTag);
    return newTag;
  }

  async getAllBlogTags(): Promise<BlogTag[]> {
    return this.blogTags
      .filter(t => t.isActive)
      .sort((a, b) => b.usageCount - a.usageCount);
  }

  async getBlogTagById(id: string): Promise<BlogTag | null> {
    return this.blogTags.find(t => t.id === id) || null;
  }

  async getBlogTagBySlug(slug: string): Promise<BlogTag | null> {
    return this.blogTags.find(t => t.slug === slug) || null;
  }

  async updateBlogTag(id: string, updates: Partial<BlogTag>): Promise<BlogTag | null> {
    const index = this.blogTags.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    this.blogTags[index] = {
      ...this.blogTags[index],
      ...updates
    };
    return this.blogTags[index];
  }

  async deleteBlogTag(id: string): Promise<boolean> {
    const index = this.blogTags.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.blogTags.splice(index, 1);
    return true;
  }

  // Blog Posts
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const newPost: BlogPost = {
      id: crypto.randomUUID(),
      ...post,
      excerpt: post.excerpt || null,
      featuredImage: post.featuredImage || null,
      categoryId: post.categoryId || null,
      publishDate: post.publishDate || null,
      seoTitle: post.seoTitle || null,
      seoDescription: post.seoDescription || null,
      seoKeywords: post.seoKeywords || null,
      readingTime: post.readingTime || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.push(newPost);
    return newPost;
  }

  async getAllBlogPosts(status?: string, page = 1, limit = 10): Promise<{ posts: BlogPost[]; total: number }> {
    let filtered = this.blogPosts;
    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }
    
    const sorted = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      posts: sorted.slice(startIndex, endIndex),
      total: filtered.length
    };
  }

  async getPublishedBlogPosts(page = 1, limit = 10): Promise<{ posts: BlogPost[]; total: number }> {
    const publishedPosts = this.blogPosts
      .filter(p => p.status === 'published' && (!p.publishDate || p.publishDate <= new Date()))
      .sort((a, b) => {
        if (a.isSticky && !b.isSticky) return -1;
        if (!a.isSticky && b.isSticky) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      posts: publishedPosts.slice(startIndex, endIndex),
      total: publishedPosts.length
    };
  }

  async getBlogPostById(id: string): Promise<BlogPost | null> {
    return this.blogPosts.find(p => p.id === id) || null;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    return this.blogPosts.find(p => p.slug === slug) || null;
  }

  async getBlogPostsByCategory(categoryId: string, page = 1, limit = 10): Promise<{ posts: BlogPost[]; total: number }> {
    const filtered = this.blogPosts
      .filter(p => p.categoryId === categoryId && p.status === 'published')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      posts: filtered.slice(startIndex, endIndex),
      total: filtered.length
    };
  }

  async getBlogPostsByTag(tagId: string, page = 1, limit = 10): Promise<{ posts: BlogPost[]; total: number }> {
    // For now, return empty since we don't have tag relationships in memory
    return { posts: [], total: 0 };
  }

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    const index = this.blogPosts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.blogPosts[index] = {
      ...this.blogPosts[index],
      ...updates,
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

  async incrementBlogPostViews(id: string): Promise<void> {
    const post = this.blogPosts.find(p => p.id === id);
    if (post) {
      post.viewCount += 1;
    }
  }

  // Blog Comments
  async createBlogComment(comment: InsertBlogComment): Promise<BlogComment> {
    const newComment: BlogComment = {
      id: crypto.randomUUID(),
      ...comment,
      userId: comment.userId || null,
      parentId: comment.parentId || null,
      authorName: comment.authorName || null,
      authorEmail: comment.authorEmail || null,
      ipAddress: comment.ipAddress || null,
      userAgent: comment.userAgent || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogComments.push(newComment);
    return newComment;
  }

  async getBlogCommentsByPost(postId: string): Promise<BlogComment[]> {
    return this.blogComments
      .filter(c => c.postId === postId && c.status === 'approved')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getBlogCommentById(id: string): Promise<BlogComment | null> {
    return this.blogComments.find(c => c.id === id) || null;
  }

  async updateBlogComment(id: string, updates: Partial<BlogComment>): Promise<BlogComment | null> {
    const index = this.blogComments.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.blogComments[index] = {
      ...this.blogComments[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.blogComments[index];
  }

  async deleteBlogComment(id: string): Promise<boolean> {
    const index = this.blogComments.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.blogComments.splice(index, 1);
    return true;
  }

  async approveBlogComment(id: string): Promise<BlogComment | null> {
    const comment = this.blogComments.find(c => c.id === id);
    if (!comment) return null;
    
    comment.status = 'approved';
    comment.updatedAt = new Date();
    return comment;
  }

  // Blog Subscriptions
  async createBlogSubscription(subscription: InsertBlogSubscription): Promise<BlogSubscription> {
    const newSubscription: BlogSubscription = {
      id: crypto.randomUUID(),
      ...subscription,
      name: subscription.name || null,
      categories: subscription.categories || null,
      confirmationToken: subscription.confirmationToken || null,
      confirmedAt: subscription.confirmedAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogSubscriptions.push(newSubscription);
    return newSubscription;
  }

  async getBlogSubscriptionByEmail(email: string): Promise<BlogSubscription | null> {
    return this.blogSubscriptions.find(s => s.email === email) || null;
  }

  async updateBlogSubscription(id: string, updates: Partial<BlogSubscription>): Promise<BlogSubscription | null> {
    const index = this.blogSubscriptions.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    this.blogSubscriptions[index] = {
      ...this.blogSubscriptions[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.blogSubscriptions[index];
  }

  async unsubscribeBlog(token: string): Promise<boolean> {
    const subscription = this.blogSubscriptions.find(s => s.unsubscribeToken === token);
    if (!subscription) return false;
    
    subscription.isActive = false;
    subscription.updatedAt = new Date();
    return true;
  }

  async getAllBlogSubscriptions(): Promise<BlogSubscription[]> {
    return this.blogSubscriptions.filter(s => s.isActive);
  }

  // Admin Access Logs
  async createAdminAccessLog(log: InsertAdminAccessLog): Promise<AdminAccessLog> {
    const newLog: AdminAccessLog = {
      id: crypto.randomUUID(),
      ...log,
      userId: log.userId || null,
      email: log.email || null,
      ipAddress: log.ipAddress || null,
      userAgent: log.userAgent || null,
      sessionId: log.sessionId || null,
      metadata: log.metadata || null,
      timestamp: new Date(),
    };
    this.adminAccessLogs.push(newLog);
    return newLog;
  }

  async getAdminAccessLogs(page = 1, limit = 20): Promise<{ logs: AdminAccessLog[]; total: number }> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const sortedLogs = this.adminAccessLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return {
      logs: sortedLogs.slice(startIndex, endIndex),
      total: this.adminAccessLogs.length
    };
  }

  // Failed Login Attempts
  async createFailedLoginAttempt(attempt: InsertFailedLoginAttempt): Promise<FailedLoginAttempt> {
    const newAttempt: FailedLoginAttempt = {
      id: crypto.randomUUID(),
      ...attempt,
      email: attempt.email || null,
      userAgent: attempt.userAgent || null,
      blockedUntil: attempt.blockedUntil || null,
      createdAt: new Date(),
    };
    this.failedLoginAttempts.push(newAttempt);
    return newAttempt;
  }

  async getFailedLoginAttempts(ipAddress?: string): Promise<FailedLoginAttempt[]> {
    let filtered = this.failedLoginAttempts;
    if (ipAddress) {
      filtered = filtered.filter(a => a.ipAddress === ipAddress);
    }
    return filtered.sort((a, b) => b.lastAttempt.getTime() - a.lastAttempt.getTime());
  }

  async clearFailedLoginAttempts(ipAddress: string): Promise<boolean> {
    const initialLength = this.failedLoginAttempts.length;
    this.failedLoginAttempts = this.failedLoginAttempts.filter(a => a.ipAddress !== ipAddress);
    return this.failedLoginAttempts.length < initialLength;
  }
}

export const storage = new MemStorage();