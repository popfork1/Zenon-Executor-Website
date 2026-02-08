import { db } from "./db";
import { releases, type Release, type InsertRelease, systemStatus, type SystemStatus, type InsertSystemStatus } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getLatestRelease(): Promise<Release | undefined>;
  getAllReleases(): Promise<Release[]>;
  createRelease(release: InsertRelease): Promise<Release>;
  updateRelease(id: number, release: Partial<InsertRelease>): Promise<Release | undefined>;
  incrementDownloadCount(id: number): Promise<Release | undefined>;
  getSystemStatus(): Promise<SystemStatus>;
  updateSystemStatus(status: InsertSystemStatus): Promise<SystemStatus>;
}

export class DatabaseStorage implements IStorage {
  async getLatestRelease(): Promise<Release | undefined> {
    const [release] = await db
      .select()
      .from(releases)
      .where(eq(releases.isLatest, true))
      .limit(1);
    
    // If no release is marked as latest, fallback to the most recently created one
    if (!release) {
      const [recent] = await db
        .select()
        .from(releases)
        .orderBy(desc(releases.createdAt))
        .limit(1);
      return recent;
    }
    
    return release;
  }

  async getAllReleases(): Promise<Release[]> {
    return await db.select().from(releases).orderBy(desc(releases.createdAt));
  }

  async createRelease(insertRelease: InsertRelease): Promise<Release> {
    if (insertRelease.isLatest) {
      // Unset previous latest
      await db.update(releases)
        .set({ isLatest: false })
        .where(eq(releases.isLatest, true));
    }
    
    const [release] = await db
      .insert(releases)
      .values(insertRelease)
      .returning();
    return release;
  }

  async updateRelease(id: number, update: Partial<InsertRelease>): Promise<Release | undefined> {
    if (update.isLatest) {
      await db.update(releases)
        .set({ isLatest: false })
        .where(eq(releases.isLatest, true));
    }

    const [updated] = await db
      .update(releases)
      .set(update)
      .where(eq(releases.id, id))
      .returning();
    return updated;
  }

  async incrementDownloadCount(id: number): Promise<Release | undefined> {
    const [release] = await db
      .select()
      .from(releases)
      .where(eq(releases.id, id));
      
    if (!release) return undefined;

    const [updated] = await db
      .update(releases)
      .set({ downloadCount: (release.downloadCount || 0) + 1 })
      .where(eq(releases.id, id))
      .returning();
      
    return updated;
  }

  async getSystemStatus(): Promise<SystemStatus> {
    const [status] = await db.select().from(systemStatus).limit(1);
    if (!status) {
      const [newStatus] = await db.insert(systemStatus).values({ isUp: true }).returning();
      return newStatus;
    }
    return status;
  }

  async updateSystemStatus(status: InsertSystemStatus): Promise<SystemStatus> {
    const existing = await this.getSystemStatus();
    const [updated] = await db
      .update(systemStatus)
      .set({ ...status, lastUpdated: new Date() })
      .where(eq(systemStatus.id, existing.id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
