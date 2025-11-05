# Permissions API Integration

This document describes the integrated permissions API endpoints.

## Overview

Two new permission management APIs have been integrated:
- **DELETE** `/api/permissions/delete?permissionId=123` - Delete a specific permission
- **PUT** `/api/permissions/update?permissionId=UUID` - Update a specific permission

## API Endpoints

### 1. Get All Permissions
**GET** `/api/permissions/get-all?resource=all`

Get all permissions, optionally filtered by resource.

**Query Parameters:**
- `resource` (optional): Filter by resource name (e.g., "ADMIN_MANAGEMENT"). Use "all" for all resources.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "permissionId": "2",
      "resource": "ADMIN_MANAGEMENT",
      "action": "EDIT_ADMINS",
      "type": "WRITE"
    }
  ]
}
```

### 2. Get Current User Permissions
**GET** `/api/permissions/me`

Fetch the current user's permissions.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "permissionId": "1",
      "resource": "ADMIN_MANAGEMENT",
      "action": "VIEW_ADMINS",
      "type": "READ"
    }
  ]
}
```

### 3. Create Permission
**POST** `/api/permissions/create`

Create a new permission.

**Request Body:**
```json
{
  "resource": "ADMIN_MANAGEMENT",
  "action": "EDIT_ADMINS",
  "type": "WRITE"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permission created successfully",
  "data": {
    "permissionId": "1234567890-abc123",
    "resource": "ADMIN_MANAGEMENT",
    "action": "EDIT_ADMINS",
    "type": "WRITE"
  }
}
```

### 4. Delete Permission ✅
**DELETE** `/api/permissions/delete?permissionId=123`

Delete a specific permission.

**Query Parameters:**
- `permissionId` (required): The ID of the permission to delete

**Response:**
```json
{
  "success": true,
  "message": "Permission deleted successfully",
  "data": {
    "permissionId": "123"
  }
}
```

### 5. Update Permission ✅
**PUT** `/api/permissions/update?permissionId=14757caf-0c7d-416f-93bf-acdb977b8681`

Update an existing permission.

**Query Parameters:**
- `permissionId` (required): The ID of the permission to update

**Request Body:**
```json
{
  "resource": "ADMIN_MANAGEMENT",
  "action": "EDIT_ADMINS",
  "type": "WRITE"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permission updated successfully",
  "data": {
    "permissionId": "14757caf-0c7d-416f-93bf-acdb977b8681",
    "resource": "ADMIN_MANAGEMENT",
    "action": "EDIT_ADMINS",
    "type": "WRITE"
  }
}
```

## Type Definitions

```typescript
type PermissionType = "READ" | "WRITE" | "DELETE" | "ADMIN";

interface Permission {
  permissionId: string;
  resource: string;
  action: string;
  type: PermissionType;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
```

## Usage in React

### Using the API Client

```typescript
import api from "@/lib/http";

// Get all permissions
const permissions = await api.get("/api/permissions/get-all?resource=all");

// Update a permission
await api.put("/api/permissions/update?permissionId=123", {
  body: {
    resource: "ADMIN_MANAGEMENT",
    action: "EDIT_ADMINS",
    type: "WRITE"
  }
});

// Delete a permission
await api.delete("/api/permissions/delete?permissionId=123");

// Create a permission
await api.post("/api/permissions/create", {
  body: {
    resource: "ADMIN_MANAGEMENT",
    action: "EDIT_ADMINS",
    type: "WRITE"
  }
});
```

## UI Integration

The Permissions Management page (`/dashboard/permissions`) provides a full UI for:
- ✅ Viewing all permissions organized by resource
- ✅ Creating new permissions
- ✅ Updating existing permissions
- ✅ Deleting permissions
- ✅ Filtering by resource and permission level
- ✅ Searching permissions

### Accessing the Permissions Management UI

1. Navigate to `/dashboard/permissions` (or click "Manage Permissions" from the dashboard)
2. Use the Create Permission button to add new permissions
3. Use the eye icon to edit permission metadata
4. Use the delete (X) icon to remove permissions

## Implementation Details

### Server Routes (`server/routes/permissions.ts`)
- `handleGetAllPermissions` - GET /api/permissions/get-all
- `handleGetCurrentUserPermissions` - GET /api/permissions/me
- `handleCreatePermission` - POST /api/permissions/create
- `handleUpdatePermission` - PUT /api/permissions/update
- `handleDeletePermission` - DELETE /api/permissions/delete

### Shared Types (`shared/api.ts`)
- `Permission` - Permission data structure
- `PermissionType` - Union type for permission access levels
- `ApiResponse<T>` - Generic API response wrapper
- `PermissionsResponse` - Response for multiple permissions
- `PermissionResponse` - Response for single permission

### Frontend Integration
- Uses `api` client from `@/lib/http`
- Uses `usePermissions` hook for permission context
- Uses `useToast` for user feedback
- Integrated with existing PermissionsManagement page

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (missing/invalid parameters)
- `404` - Not Found (permission doesn't exist)
- `500` - Server Error

## Testing

To test the APIs:

1. Start the development server: `npm run dev`
2. Navigate to `/dashboard/permissions`
3. Create a new permission
4. Edit the permission using the eye icon
5. Delete the permission using the X icon

Or use curl/Postman:

```bash
# Get all permissions
curl http://localhost:8080/api/permissions/get-all

# Create permission
curl -X POST http://localhost:8080/api/permissions/create \
  -H "Content-Type: application/json" \
  -d '{"resource":"ADMIN_MANAGEMENT","action":"EDIT_ADMINS","type":"WRITE"}'

# Update permission
curl -X PUT "http://localhost:8080/api/permissions/update?permissionId=123" \
  -H "Content-Type: application/json" \
  -d '{"resource":"ADMIN_MANAGEMENT","action":"EDIT_ADMINS","type":"WRITE"}'

# Delete permission
curl -X DELETE "http://localhost:8080/api/permissions/delete?permissionId=123"
```

## Files Modified

1. **server/routes/permissions.ts** (new) - Permission API handlers
2. **server/index.ts** - Added permission route registrations
3. **shared/api.ts** - Added permission type definitions
4. **client/pages/PermissionsManagement.tsx** - Already has UI integration

All changes are backward compatible and don't affect existing functionality.
