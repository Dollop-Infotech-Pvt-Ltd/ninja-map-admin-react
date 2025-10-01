import type { RequestHandler } from "express";

/**
 * DELETE /api/admins/delete?id=UUID
 * Simple handler to integrate with frontend delete calls.
 * In a real app, replace with DB deletion logic.
 */
export const handleDeleteAdmin: RequestHandler = (req, res) => {
  const id = (req.query.id as string | undefined) || (req.params as any)?.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, message: "Missing 'id' query parameter" });
  }

  // Simulate successful deletion. Real implementation would delete from DB.
  return res.json({ success: true, message: "Admin deleted successfully", data: { id } });
};
