import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleDeleteAdmin } from "./routes/admins";
import {
  handleGetAllPermissions,
  handleDeletePermission,
  handleUpdatePermission,
  handleCreatePermission,
  handleGetCurrentUserPermissions,
} from "./routes/permissions";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Admin routes
  app.delete("/api/admins/delete", handleDeleteAdmin);

  // Permissions routes
  app.get("/api/permissions/get-all", handleGetAllPermissions);
  app.get("/api/permissions/me", handleGetCurrentUserPermissions);
  app.post("/api/permissions/create", handleCreatePermission);
  app.put("/api/permissions/update", handleUpdatePermission);
  app.delete("/api/permissions/delete", handleDeletePermission);

  return app;
}
