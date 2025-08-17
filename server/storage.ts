import { 
  User, 
  InsertUser, 
  ToolUsage, 
  InsertToolUsage, 
  UserFile, 
  InsertUserFile, 
  PdfLog, 
  InsertPdfLog 
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
}

// In-memory storage implementation for development
class MemStorage implements IStorage {
  private users: User[] = [];
  private toolUsage: ToolUsage[] = [];
  private userFiles: UserFile[] = [];
  private pdfLogs: PdfLog[] = [];

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
}

export const storage = new MemStorage();