import { pgTable, text, timestamp, integer, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication and profile
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  firebaseUid: text("firebase_uid").notNull().unique(),
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

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ToolUsage = typeof toolUsage.$inferSelect;
export type InsertToolUsage = z.infer<typeof insertToolUsageSchema>;

export type UserFile = typeof userFiles.$inferSelect;
export type InsertUserFile = z.infer<typeof insertUserFileSchema>;

export type PdfLog = typeof pdfLogs.$inferSelect;
export type InsertPdfLog = z.infer<typeof insertPdfLogSchema>;

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
  
  // Additional useful tools
  { name: 'Extract Images', path: '/extract-images', category: TOOL_CATEGORIES.MANIPULATION, icon: 'fas fa-images' },
  { name: 'Remove Blank Pages', path: '/remove-blank-pages', category: TOOL_CATEGORIES.MANIPULATION, icon: 'fas fa-eraser' },
  { name: 'Add Header & Footer', path: '/add-header-footer', category: TOOL_CATEGORIES.MANIPULATION, icon: 'fas fa-align-center' },
  { name: 'PDF Optimizer', path: '/optimize-pdf', category: TOOL_CATEGORIES.OPTIMIZATION, icon: 'fas fa-magic' },
  { name: 'JPG to PDF', path: '/jpg-to-pdf', category: TOOL_CATEGORIES.CONVERSION_TO_PDF, icon: 'fas fa-file-pdf' },
] as const;