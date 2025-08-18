import { pgTable, text, timestamp, integer, jsonb, uuid, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema for authentication and profile
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  firebaseUid: text("firebase_uid").notNull().unique(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  adminRole: text("admin_role"), // 'super_admin', 'admin', 'moderator'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tool usage tracking schema
export const toolUsage = pgTable("tool_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  toolName: text("tool_name").notNull(),
  toolType: text("tool_type").notNull(), // 'manipulation', 'conversion', 'security', etc.
  filesProcessed: integer("files_processed").default(1),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: jsonb("metadata"), // Additional data like file sizes, processing time, etc.
});

// User files temporary storage schema
export const userFiles = pgTable("user_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(), // Auto-delete after 1 hour
  toolUsed: text("tool_used"),
});

// PDF processing logs schema
export const pdfLogs = pgTable("pdf_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  operation: text("operation").notNull(),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  processingTime: integer("processing_time"), // in milliseconds
  status: text("status").notNull(), // 'success', 'error', 'pending'
  errorMessage: text("error_message"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Admin Activity Logs
export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminUserId: uuid("admin_user_id").notNull().references(() => users.id),
  action: text("action").notNull(), // 'user_management', 'blog_edit', 'system_config', etc.
  description: text("description").notNull(),
  targetId: text("target_id"), // ID of affected resource
  targetType: text("target_type"), // 'user', 'blog_post', 'comment', etc.
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// System Feedback
export const systemFeedback = pgTable("system_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  email: text("email"),
  name: text("name"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  category: text("category").notNull(), // 'bug', 'feature_request', 'general', 'complaint'
  status: text("status").default('pending').notNull(), // 'pending', 'in_progress', 'resolved', 'closed'
  priority: text("priority").default('medium').notNull(), // 'low', 'medium', 'high', 'urgent'
  adminResponse: text("admin_response"),
  responseDate: timestamp("response_date"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Blog Categories
export const blogCategories = pgTable("blog_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: uuid("parent_id").references(() => blogCategories.id),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog Tags
export const blogTags = pgTable("blog_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  authorId: uuid("author_id").notNull().references(() => users.id),
  categoryId: uuid("category_id").references(() => blogCategories.id),
  status: text("status").default('draft').notNull(), // 'draft', 'published', 'archived'
  publishDate: timestamp("publish_date"),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords").array(),
  readingTime: integer("reading_time"), // in minutes
  isSticky: boolean("is_sticky").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Blog Post Tags (Many-to-Many Junction Table)
export const blogPostTags = pgTable("blog_post_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
  tagId: uuid("tag_id").notNull().references(() => blogTags.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog Comments
export const blogComments = pgTable("blog_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
  userId: uuid("user_id").references(() => users.id),
  parentId: uuid("parent_id").references(() => blogComments.id), // For threaded comments
  authorName: text("author_name"),
  authorEmail: text("author_email"),
  content: text("content").notNull(),
  status: text("status").default('pending').notNull(), // 'pending', 'approved', 'rejected', 'spam'
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  likeCount: integer("like_count").default(0),
  isSticky: boolean("is_sticky").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Blog Subscriptions
export const blogSubscriptions = pgTable("blog_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  isActive: boolean("is_active").default(true).notNull(),
  subscriptionType: text("subscription_type").default('all').notNull(), // 'all', 'weekly', 'monthly'
  categories: text("categories").array(), // Array of category IDs to subscribe to
  confirmationToken: text("confirmation_token"),
  confirmedAt: timestamp("confirmed_at"),
  unsubscribeToken: text("unsubscribe_token").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Admin Access Logs
export const adminAccessLogs = pgTable("admin_access_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  email: text("email"),
  action: text("action").notNull(), // 'login_success', 'login_failed', 'logout', 'access_denied'
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  sessionId: text("session_id"),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Failed Login Attempts
export const failedLoginAttempts = pgTable("failed_login_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email"),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  attemptCount: integer("attempt_count").default(1),
  lastAttempt: timestamp("last_attempt").defaultNow().notNull(),
  isBlocked: boolean("is_blocked").default(false),
  blockedUntil: timestamp("blocked_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Database Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  toolUsage: many(toolUsage),
  userFiles: many(userFiles),
  pdfLogs: many(pdfLogs),
  adminActivityLogs: many(adminActivityLogs),
  blogPosts: many(blogPosts),
  blogComments: many(blogComments),
  feedbackAssigned: many(systemFeedback, { relationName: "assignedFeedback" }),
  feedbackSubmitted: many(systemFeedback, { relationName: "submittedFeedback" }),
}));

export const blogCategoriesRelations = relations(blogCategories, ({ many, one }) => ({
  posts: many(blogPosts),
  parent: one(blogCategories, { fields: [blogCategories.parentId], references: [blogCategories.id] }),
  children: many(blogCategories),
}));

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(users, { fields: [blogPosts.authorId], references: [users.id] }),
  category: one(blogCategories, { fields: [blogPosts.categoryId], references: [blogCategories.id] }),
  comments: many(blogComments),
  tags: many(blogPostTags),
}));

export const blogTagsRelations = relations(blogTags, ({ many }) => ({
  posts: many(blogPostTags),
}));

export const blogPostTagsRelations = relations(blogPostTags, ({ one }) => ({
  post: one(blogPosts, { fields: [blogPostTags.postId], references: [blogPosts.id] }),
  tag: one(blogTags, { fields: [blogPostTags.tagId], references: [blogTags.id] }),
}));

export const blogCommentsRelations = relations(blogComments, ({ one, many }) => ({
  post: one(blogPosts, { fields: [blogComments.postId], references: [blogPosts.id] }),
  user: one(users, { fields: [blogComments.userId], references: [users.id] }),
  parent: one(blogComments, { fields: [blogComments.parentId], references: [blogComments.id] }),
  replies: many(blogComments),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertToolUsageSchema = createInsertSchema(toolUsage).omit({
  id: true,
  timestamp: true,
});

export const insertUserFileSchema = createInsertSchema(userFiles).omit({
  id: true,
  uploadedAt: true,
});

export const insertPdfLogSchema = createInsertSchema(pdfLogs).omit({
  id: true,
  timestamp: true,
});

export const insertAdminActivityLogSchema = createInsertSchema(adminActivityLogs).omit({
  id: true,
  timestamp: true,
});

export const insertSystemFeedbackSchema = createInsertSchema(systemFeedback).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogCategorySchema = createInsertSchema(blogCategories).omit({
  id: true,
  createdAt: true,
});

export const insertBlogTagSchema = createInsertSchema(blogTags).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogCommentSchema = createInsertSchema(blogComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogSubscriptionSchema = createInsertSchema(blogSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminAccessLogSchema = createInsertSchema(adminAccessLogs).omit({
  id: true,
  timestamp: true,
});

export const insertFailedLoginAttemptSchema = createInsertSchema(failedLoginAttempts).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ToolUsage = typeof toolUsage.$inferSelect;
export type InsertToolUsage = z.infer<typeof insertToolUsageSchema>;

export type UserFile = typeof userFiles.$inferSelect;
export type InsertUserFile = z.infer<typeof insertUserFileSchema>;

export type PdfLog = typeof pdfLogs.$inferSelect;
export type InsertPdfLog = z.infer<typeof insertPdfLogSchema>;

export type AdminActivityLog = typeof adminActivityLogs.$inferSelect;
export type InsertAdminActivityLog = z.infer<typeof insertAdminActivityLogSchema>;

export type SystemFeedback = typeof systemFeedback.$inferSelect;
export type InsertSystemFeedback = z.infer<typeof insertSystemFeedbackSchema>;

export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;

export type BlogTag = typeof blogTags.$inferSelect;
export type InsertBlogTag = z.infer<typeof insertBlogTagSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = z.infer<typeof insertBlogCommentSchema>;

export type BlogSubscription = typeof blogSubscriptions.$inferSelect;
export type InsertBlogSubscription = z.infer<typeof insertBlogSubscriptionSchema>;

export type AdminAccessLog = typeof adminAccessLogs.$inferSelect;
export type InsertAdminAccessLog = z.infer<typeof insertAdminAccessLogSchema>;

export type FailedLoginAttempt = typeof failedLoginAttempts.$inferSelect;
export type InsertFailedLoginAttempt = z.infer<typeof insertFailedLoginAttemptSchema>;

// Tool categories for organization
export const TOOL_CATEGORIES = {
  MANIPULATION: 'manipulation',
  CONVERSION_FROM_PDF: 'conversion_from_pdf',
  CONVERSION_TO_PDF: 'conversion_to_pdf',
  SECURITY: 'security',
  OPTIMIZATION: 'optimization',
} as const;

// All available tools
export const PDF_TOOLS = [
  // Manipulation tools
  { name: 'Merge PDF', path: '/merge', category: TOOL_CATEGORIES.MANIPULATION, icon: 'fas fa-layer-group' },
  { name: 'Split PDF', path: '/split', category: TOOL_CATEGORIES.MANIPULATION, icon: 'fas fa-cut' },
  { name: 'Reorder Pages', path: '/reorder', category: TOOL_CATEGORIES.MANIPULATION, icon: 'fas fa-arrows-alt' },
  { name: 'Delete Pages', path: '/delete', category: TOOL_CATEGORIES.MANIPULATION, icon: 'fas fa-trash-alt' },
  { name: 'Rotate PDF', path: '/rotate', category: TOOL_CATEGORIES.MANIPULATION, icon: 'fas fa-redo' },
  { name: 'Page Numbers', path: '/page-numbers', category: TOOL_CATEGORIES.MANIPULATION, icon: 'fas fa-hashtag' },
  
  // Security tools
  { name: 'Lock PDF', path: '/lock', category: TOOL_CATEGORIES.SECURITY, icon: 'fas fa-lock' },
  { name: 'Unlock PDF', path: '/unlock', category: TOOL_CATEGORIES.SECURITY, icon: 'fas fa-unlock' },
  { name: 'Watermark', path: '/watermark', category: TOOL_CATEGORIES.SECURITY, icon: 'fas fa-stamp' },
  
  // Optimization tools
  { name: 'Compress PDF', path: '/compress', category: TOOL_CATEGORIES.OPTIMIZATION, icon: 'fas fa-compress-arrows-alt' },
  { name: 'Edit Metadata', path: '/metadata', category: TOOL_CATEGORIES.OPTIMIZATION, icon: 'fas fa-tags' },
  
  // Conversion from PDF
  { name: 'PDF to JPG', path: '/pdf-to-jpg', category: TOOL_CATEGORIES.CONVERSION_FROM_PDF, icon: 'fas fa-image' },
  { name: 'PDF to PNG', path: '/pdf-to-png', category: TOOL_CATEGORIES.CONVERSION_FROM_PDF, icon: 'fas fa-file-image' },
  { name: 'PDF to TIFF', path: '/pdf-to-tiff', category: TOOL_CATEGORIES.CONVERSION_FROM_PDF, icon: 'fas fa-file-image' },
  { name: 'PDF to Word', path: '/pdf-to-word', category: TOOL_CATEGORIES.CONVERSION_FROM_PDF, icon: 'fas fa-file-word' },
  { name: 'PDF to Excel', path: '/pdf-to-excel', category: TOOL_CATEGORIES.CONVERSION_FROM_PDF, icon: 'fas fa-file-excel' },
  { name: 'PDF to PowerPoint', path: '/pdf-to-ppt', category: TOOL_CATEGORIES.CONVERSION_FROM_PDF, icon: 'fas fa-file-powerpoint' },
  { name: 'PDF to TXT', path: '/pdf-to-txt', category: TOOL_CATEGORIES.CONVERSION_FROM_PDF, icon: 'fas fa-file-alt' },
  { name: 'PDF to JSON', path: '/pdf-to-json', category: TOOL_CATEGORIES.CONVERSION_FROM_PDF, icon: 'fas fa-code' },
  
  // Conversion to PDF
  { name: 'PNG to PDF', path: '/png-to-pdf', category: TOOL_CATEGORIES.CONVERSION_TO_PDF, icon: 'fas fa-file-pdf' },
  { name: 'Word to PDF', path: '/word-to-pdf', category: TOOL_CATEGORIES.CONVERSION_TO_PDF, icon: 'fas fa-file-pdf' },
  { name: 'Excel to PDF', path: '/excel-to-pdf', category: TOOL_CATEGORIES.CONVERSION_TO_PDF, icon: 'fas fa-file-pdf' },
] as const;