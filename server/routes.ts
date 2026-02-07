import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.releases.list.path, async (_req, res) => {
    const releases = await storage.getAllReleases();
    res.json(releases);
  });

  app.get(api.releases.getLatest.path, async (_req, res) => {
    const release = await storage.getLatestRelease();
    if (!release) {
      return res.status(404).json({ message: "No releases found" });
    }
    res.json(release);
  });

  app.post(api.releases.trackDownload.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({ message: "Invalid ID" });
    }
    
    const updated = await storage.incrementDownloadCount(id);
    if (!updated) {
      return res.status(404).json({ message: "Release not found" });
    }
    
    res.json({ success: true, newCount: updated.downloadCount });
  });

  // Seed data if empty
  const existing = await storage.getAllReleases();
  if (existing.length === 0) {
    console.log("Seeding initial release data...");
    await storage.createRelease({
      version: "v1.0.0",
      title: "Zenon Executor Initial Release",
      description: "First public release of Zenon Executor. Features include key system, script hub, and more.",
      downloadUrl: "https://example.com/zenon-v1.zip",
      isLatest: false
    });
    
    await storage.createRelease({
      version: "v1.1.0",
      title: "Performance Update",
      description: "Improved injection speed and stability. Added new themes.",
      downloadUrl: "https://example.com/zenon-v1.1.zip",
      isLatest: true
    });
  }

  return httpServer;
}
