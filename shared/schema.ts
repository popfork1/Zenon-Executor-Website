import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),
  version: text("version").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  downloadUrl: text("download_url").notNull(),
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  isLatest: boolean("is_latest").default(false),
});

export const systemStatus = pgTable("system_status", {
  id: serial("id").primaryKey(),
  isUp: boolean("is_up").default(true).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertReleaseSchema = createInsertSchema(releases).omit({ 
  id: true, 
  createdAt: true, 
  downloadCount: true 
});

export const insertSystemStatusSchema = createInsertSchema(systemStatus).omit({
  id: true,
  lastUpdated: true
});

export type Release = typeof releases.$inferSelect;
export type InsertRelease = z.infer<typeof insertReleaseSchema>;
export type UpdateReleaseRequest = Partial<InsertRelease>;

export type SystemStatus = typeof systemStatus.$inferSelect;
export type InsertSystemStatus = z.infer<typeof insertSystemStatusSchema>;
