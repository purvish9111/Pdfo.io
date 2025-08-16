import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pdfProcessingLogs = pgTable("pdf_processing_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tool: text("tool").notNull(),
  filename: text("filename").notNull(),
  status: text("status").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const insertPdfLogSchema = createInsertSchema(pdfProcessingLogs).pick({
  tool: true,
  filename: true,
  status: true,
});

export type InsertPdfLog = z.infer<typeof insertPdfLogSchema>;
export type PdfLog = typeof pdfProcessingLogs.$inferSelect;
