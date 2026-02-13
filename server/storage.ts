import { db } from "./db";
import { releases, type Release, type InsertRelease, systemStatus, type SystemStatus, type InsertSystemStatus } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getLatestRelease(executorType?: string): Promise<Release | undefined>;
  getAllReleases(executorType?: string): Promise<Release[]>;
  createRelease(release: InsertRelease): Promise<Release>;
  updateRelease(id: number, release: Partial<InsertRelease>): Promise<Release | undefined>;
  incrementDownloadCount(id: number): Promise<Release | undefined>;
  deleteRelease(id: number): Promise<boolean>;
  getSystemStatus(): Promise<SystemStatus>;
  updateSystemStatus(status: InsertSystemStatus): Promise<SystemStatus>;
}

export class DatabaseStorage implements IStorage {
  async getLatestRelease(executorType: string = "velocity"): Promise<Release | undefined> {
    const [release] = await db
      .select()
      .from(releases)
      .where(
        and(
          eq(releases.isLatest, true),
          eq(releases.executorType, executorType)
        )
      )
      .limit(1);
    
    // If no release is marked as latest, fallback to the most recently created one for that type
    if (!release) {
      const [recent] = await db
        .select()
        .from(releases)
        .where(eq(releases.executorType, executorType))
        .orderBy(desc(releases.createdAt))
        .limit(1);
      return recent;
    }
    
    return release;
  }

  async getAllReleases(executorType?: string): Promise<Release[]> {
    if (executorType) {
      return await db
        .select()
        .from(releases)
        .where(eq(releases.executorType, executorType))
        .orderBy(desc(releases.createdAt));
    }
    return await db.select().from(releases).orderBy(desc(releases.createdAt));
  }

  async createRelease(insertRelease: InsertRelease): Promise<Release> {
    if (insertRelease.isLatest) {
      // Unset previous latest for the same executor type
      await db.update(releases)
        .set({ isLatest: false })
        .where(
          and(
            eq(releases.isLatest, true),
            eq(releases.executorType, insertRelease.executorType || "velocity")
          )
        );
    }
    
    const [release] = await db
      .insert(releases)
      .values({
        ...insertRelease,
        executorType: insertRelease.executorType || "velocity"
      })
      .returning();
    return release;
  }

  async updateRelease(id: number, update: Partial<InsertRelease>): Promise<Release | undefined> {
    const existing = await db.select().from(releases).where(eq(releases.id, id)).limit(1);
    if (existing.length === 0) return undefined;
    
    const executorType = update.executorType || existing[0].executorType;

    if (update.isLatest) {
      await db.update(releases)
        .set({ isLatest: false })
        .where(
          and(
            eq(releases.isLatest, true),
            eq(releases.executorType, executorType)
          )
        );
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

  async deleteRelease(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(releases)
      .where(eq(releases.id, id))
      .returning();
    return !!deleted;
  }

  async getSystemStatus(executorType: string = "velocity"): Promise<SystemStatus> {
    const [status] = await db.select().from(systemStatus).where(eq(systemStatus.executorType, executorType)).limit(1);
    if (!status) {
      const [newStatus] = await db.insert(systemStatus).values({ executorType, isUp: true }).returning();
      return newStatus;
    }
    return status;
  }

  async updateSystemStatus(status: InsertSystemStatus): Promise<SystemStatus> {
    const existing = await this.getSystemStatus(status.executorType || "velocity");
    const [updated] = await db
      .update(systemStatus)
      .set({ ...status, lastUpdated: new Date() })
      .where(eq(systemStatus.id, existing.id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
