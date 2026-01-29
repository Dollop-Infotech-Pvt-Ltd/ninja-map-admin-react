import { Request, Response } from "express";

// Mock database for roles (replace with real database in production)
const rolesDb = new Map<string, any>();

// Initialize with some mock data
rolesDb.set("1", {
  roleId: "1",
  roleName: "Super Admin",
  description: "Full system access with all permissions",
  permissionIds: [],
  userCount: 2,
  isSystem: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
});

rolesDb.set("2", {
  roleId: "2",
  roleName: "Admin",
  description: "Administrative access with most permissions",
  permissionIds: [],
  userCount: 5,
  isSystem: false,
  createdAt: "2024-01-05T00:00:00.000Z",
  updatedAt: "2024-01-05T00:00:00.000Z"
});

/**
 * GET /api/roles/get-all
 * Get all roles
 */
export async function handleGetAllRoles(req: Request, res: Response) {
  try {
    const roles = Array.from(rolesDb.values());
    
    res.status(200).json({
      success: true,
      message: "Roles retrieved successfully",
      data: roles
    });
  } catch (error: any) {
    console.error("Error fetching roles:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
      error: error.message
    });
  }
}

/**
 * POST /api/roles/create
 * Create a new role
 * Body: { roleName: string, description: string, permissionIds: string[] }
 */
export async function handleCreateRole(req: Request, res: Response) {
  try {
    const { roleName, description, permissionIds } = req.body;

    // Validation
    if (!roleName || typeof roleName !== "string" || roleName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Role name is required and must be a non-empty string"
      });
    }

    if (!description || typeof description !== "string" || description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Description is required and must be a non-empty string"
      });
    }

    if (!Array.isArray(permissionIds)) {
      return res.status(400).json({
        success: false,
        message: "permissionIds must be an array"
      });
    }

    // Check if role name already exists
    const existingRole = Array.from(rolesDb.values()).find(
      role => role.roleName.toLowerCase() === roleName.trim().toLowerCase()
    );

    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: `Role with name "${roleName}" already exists`
      });
    }

    // Generate new role ID
    const roleId = `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create new role
    const newRole = {
      roleId,
      roleName: roleName.trim(),
      description: description.trim(),
      permissionIds: permissionIds,
      userCount: 0,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to database
    rolesDb.set(roleId, newRole);

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: newRole
    });
  } catch (error: any) {
    console.error("Error creating role:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create role",
      error: error.message
    });
  }
}

/**
 * PUT /api/roles/update?roleId=xxx
 * Update an existing role
 * Body: { roleName?: string, description?: string, permissionIds?: string[] }
 */
export async function handleUpdateRole(req: Request, res: Response) {
  try {
    const { roleId } = req.query;
    const { roleName, description, permissionIds } = req.body;

    // Validation
    if (!roleId || typeof roleId !== "string") {
      return res.status(400).json({
        success: false,
        message: "roleId query parameter is required"
      });
    }

    // Check if role exists
    const existingRole = rolesDb.get(roleId);
    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: `Role with ID "${roleId}" not found`
      });
    }

    // Check if it's a system role
    if (existingRole.isSystem) {
      return res.status(403).json({
        success: false,
        message: "System roles cannot be modified"
      });
    }

    // Update fields
    const updatedRole = {
      ...existingRole,
      roleName: roleName !== undefined ? roleName.trim() : existingRole.roleName,
      description: description !== undefined ? description.trim() : existingRole.description,
      permissionIds: permissionIds !== undefined ? permissionIds : existingRole.permissionIds,
      updatedAt: new Date().toISOString()
    };

    // Check for duplicate role name (excluding current role)
    if (roleName) {
      const duplicateRole = Array.from(rolesDb.values()).find(
        role => role.roleId !== roleId && 
                role.roleName.toLowerCase() === roleName.trim().toLowerCase()
      );

      if (duplicateRole) {
        return res.status(409).json({
          success: false,
          message: `Role with name "${roleName}" already exists`
        });
      }
    }

    // Save updated role
    rolesDb.set(roleId, updatedRole);

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: updatedRole
    });
  } catch (error: any) {
    console.error("Error updating role:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update role",
      error: error.message
    });
  }
}

/**
 * DELETE /api/roles/delete?roleId=xxx
 * Delete a role
 */
export async function handleDeleteRole(req: Request, res: Response) {
  try {
    const { roleId } = req.query;

    // Validation
    if (!roleId || typeof roleId !== "string") {
      return res.status(400).json({
        success: false,
        message: "roleId query parameter is required"
      });
    }

    // Check if role exists
    const existingRole = rolesDb.get(roleId);
    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: `Role with ID "${roleId}" not found`
      });
    }

    // Check if it's a system role
    if (existingRole.isSystem) {
      return res.status(403).json({
        success: false,
        message: "System roles cannot be deleted"
      });
    }

    // Check if role has assigned users
    if (existingRole.userCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete role that has assigned users"
      });
    }

    // Delete role
    rolesDb.delete(roleId);

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
      data: {
        roleId: roleId
      }
    });
  } catch (error: any) {
    console.error("Error deleting role:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete role",
      error: error.message
    });
  }
}

/**
 * GET /api/roles/:roleId
 * Get a specific role by ID
 */
export async function handleGetRoleById(req: Request, res: Response) {
  try {
    const { roleId } = req.params;

    if (!roleId) {
      return res.status(400).json({
        success: false,
        message: "roleId parameter is required"
      });
    }

    const role = rolesDb.get(roleId);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: `Role with ID "${roleId}" not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Role retrieved successfully",
      data: role
    });
  } catch (error: any) {
    console.error("Error fetching role:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch role",
      error: error.message
    });
  }
}
