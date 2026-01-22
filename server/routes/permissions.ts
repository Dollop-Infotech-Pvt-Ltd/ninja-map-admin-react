import type { RequestHandler } from "express";

/**
 * Permission data structure for API responses
 */
interface Permission {
  permissionId: string;
  resource: string;
  action: string;
  type: string; // Allow any string type for flexibility
}

/**
 * Mock permissions database - replace with real DB in production
 */
const permissionsDb: Map<string, Permission> = new Map([
  ["1", { permissionId: "1", resource: "ADMIN_MANAGEMENT", action: "VIEW_ADMINS", type: "READ" }],
  ["2", { permissionId: "2", resource: "ADMIN_MANAGEMENT", action: "EDIT_ADMINS", type: "WRITE" }],
  ["3", { permissionId: "3", resource: "ADMIN_MANAGEMENT", action: "DELETE_ADMINS", type: "DELETE" }],
  ["4", { permissionId: "4", resource: "USER_MANAGEMENT", action: "VIEW_USERS", type: "READ" }],
  ["5", { permissionId: "5", resource: "USER_MANAGEMENT", action: "EDIT_USERS", type: "WRITE" }],
  ["6", { permissionId: "6", resource: "ROLE_MANAGEMENT", action: "VIEW_ROLES", type: "READ" }],
  ["7", { permissionId: "7", resource: "ROLE_MANAGEMENT", action: "CREATE_ROLES", type: "WRITE" }],
  ["8", { permissionId: "8", resource: "BLOG_POST_MANAGEMENT", action: "VIEW_POSTS", type: "READ" }],
  ["9", { permissionId: "9", resource: "BLOG_POST_MANAGEMENT", action: "CREATE_POSTS", type: "WRITE" }],
  // COMMENT_MANAGEMENT permissions
  ["76d0bb9f-4c9b-421e-a933-170d91c4c926", { permissionId: "76d0bb9f-4c9b-421e-a933-170d91c4c926", resource: "COMMENT_MANAGEMENT", action: "CREATE_COMMENT", type: "WRITE" }],
  ["2d592928-44ee-4714-973a-af2356264768", { permissionId: "2d592928-44ee-4714-973a-af2356264768", resource: "COMMENT_MANAGEMENT", action: "VIEW_COMMENT", type: "READ" }],
  ["bc2aa9eb-98e4-4a9f-bf3a-472a1a01bf6d", { permissionId: "bc2aa9eb-98e4-4a9f-bf3a-472a1a01bf6d", resource: "COMMENT_MANAGEMENT", action: "LIKE_COMMENT", type: "WRITE" }],
  ["45eca806-99aa-4d51-8518-feea1234630b", { permissionId: "45eca806-99aa-4d51-8518-feea1234630b", resource: "COMMENT_MANAGEMENT", action: "DELETE_COMMENT", type: "DELETE" }],
]);

/**
 * GET /api/permissions/get-all
 * Fetch all permissions, optionally filtered by resource
 */
export const handleGetAllPermissions: RequestHandler = (req, res) => {
  try {
    const { resource } = req.query;
    let permissions = Array.from(permissionsDb.values());

    if (resource && resource !== "all") {
      permissions = permissions.filter((p) => p.resource === resource);
    }

    return res.json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch permissions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * DELETE /api/permissions/delete?permissionId=UUID
 * Delete a permission by ID
 */
export const handleDeletePermission: RequestHandler = (req, res) => {
  try {
    const permissionId = (req.query.permissionId as string | undefined) || (req.params as any)?.permissionId;

    if (!permissionId || typeof permissionId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid 'permissionId' query parameter",
      });
    }

    const exists = permissionsDb.has(permissionId);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    permissionsDb.delete(permissionId);

    return res.json({
      success: true,
      message: "Permission deleted successfully",
      data: { permissionId },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete permission",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * PUT /api/permissions/update?permissionId=UUID
 * Update a permission
 * Body: { resource: string, action: string, type: "READ" | "WRITE" | "DELETE" | "ADMIN" }
 */
export const handleUpdatePermission: RequestHandler = (req, res) => {
  try {
    const permissionId = (req.query.permissionId as string | undefined) || (req.params as any)?.permissionId;
    const { resource, action, type } = req.body;

    // Validation
    if (!permissionId || typeof permissionId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid 'permissionId' query parameter",
      });
    }

    if (!resource || typeof resource !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid 'resource' in request body",
      });
    }

    if (!action || typeof action !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid 'action' in request body",
      });
    }

    if (!type || typeof type !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid 'type' in request body. Must be a non-empty string (e.g., READ, WRITE, DELETE, CREATE, TEST, etc.)",
      });
    }

    const exists = permissionsDb.has(permissionId);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    const updatedPermission: Permission = {
      permissionId,
      resource,
      action,
      type,
    };

    permissionsDb.set(permissionId, updatedPermission);

    return res.json({
      success: true,
      message: "Permission updated successfully",
      data: updatedPermission,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update permission",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * POST /api/permissions/create
 * Create a new permission
 * Body: { resource: string, action: string, type: "READ" | "WRITE" | "DELETE" | "ADMIN" }
 */
export const handleCreatePermission: RequestHandler = (req, res) => {
  try {
    const { resource, action, type } = req.body;

    // Validation
    if (!resource || typeof resource !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid 'resource' in request body",
      });
    }

    if (!action || typeof action !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid 'action' in request body",
      });
    }

    if (!type || typeof type !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid 'type' in request body. Must be a non-empty string (e.g., READ, WRITE, DELETE, CREATE, TEST, etc.)",
      });
    }

    // Generate a simple UUID-like ID
    const permissionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newPermission: Permission = {
      permissionId,
      resource,
      action,
      type,
    };

    permissionsDb.set(permissionId, newPermission);

    return res.status(201).json({
      success: true,
      message: "Permission created successfully",
      data: newPermission,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create permission",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * GET /api/permissions/me
 * Fetch current user's permissions
 * (Used by PermissionsProvider for hydrating user permissions)
 */
export const handleGetCurrentUserPermissions: RequestHandler = (req, res) => {
  try {
    // In a real app, you'd fetch this from the auth token/session
    // For now, return a default set of permissions
    const userPermissions = Array.from(permissionsDb.values()).slice(0, 5);

    return res.json({
      success: true,
      data: userPermissions,
      permissions: userPermissions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user permissions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
