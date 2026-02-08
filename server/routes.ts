import type { Express, Request } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import multer from "multer";
import path from "path";
import express from "express";
import fs from "fs";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const storage_config = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage_config });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve uploads directory
  app.use("/uploads", express.static("uploads"));

  app.get(api.releases.list.path, async (_req, res) => {
    const releases = await storage.getAllReleases();
    res.json(releases);
  });

  app.get("/api/status", async (_req, res) => {
    const status = await storage.getSystemStatus();
    res.json(status);
  });

  app.post("/api/admin/status", async (req, res) => {
    const status = await storage.updateSystemStatus(req.body);
    res.json(status);
  });

  app.post("/api/admin/upload", upload.single("file"), async (req: MulterRequest, res: express.Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  app.patch("/api/admin/releases/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const release = await storage.updateRelease(id, req.body);
    if (!release) return res.status(404).send("Release not found");
    res.json(release);
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
      downloadUrl: "/downloads/Zenon_Executor.zip",
      isLatest: true
    });
  }

  return httpServer;
}
