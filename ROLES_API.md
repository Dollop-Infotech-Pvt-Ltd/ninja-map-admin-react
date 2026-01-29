# Roles API Documentation

## Overview
The Roles API provides endpoints for managing user roles and their associated permissions. Roles are used to group permissions and assign them to users.

## Endpoints

### 1. Get All Roles
**GET** `/api/roles/get-all`

Retrieves all roles in the system.

**Response:**
```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": [
    {
      "roleId": "1",
      "roleName": "Super Admin",
      "description": "Full system access with all permissions",
      "permissionIds": [],
      "userCount": 2,
      "isSystem": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Get Role by ID
**GET** `/api/roles/:roleId`

Retrieves a specific role by its ID.

**Parameters:**
- `roleId` (path parameter) - The unique identifier of the role

**Response:**
```json
{
  "success": true,
  "message": "Role retrieved successfully",
  "data": {
    "roleId": "1",
    "roleName": "Super Admin",
    "description": "Full system access with all permissions",
    "permissionIds": [],
    "userCount": 2,
    "isSystem": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Role ✅
**POST** `/api/roles/create`

Creates a new role with specified permissions.

**Request Body:**
```json
{
  "roleName": "USER",
  "description": "Manages all user-related operations",
  "permissionIds": [
    "b6136890-815d-4d2c-a626-c5cbcce25d00",
    "48d322e0-0792-40f3-8dbf-926b20e8b167"
  ]
}
```

**Validation:**
- `roleName` - Required, non-empty string
- `description` - Required, non-empty string
- `permissionIds` - Required, must be an array (can be empty)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "roleId": "role_1234567890_abc123",
    "roleName": "USER",
    "description": "Manages all user-related operations",
    "permissionIds": [
      "b6136890-815d-4d2c-a626-c5cbcce25d00",
      "48d322e0-0792-40f3-8dbf-926b20e8b167"
    ],
    "userCount": 0,
    "isSystem": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing or invalid fields
- `409` - Role name already exists
- `500` - Server error

### 4. Update Role
**PUT** `/api/roles/update?roleId=xxx`

Updates an existing role.

**Query Parameters:**
- `roleId` - Required, the ID of the role to update

**Request Body:**
```json
{
  "roleName": "Updated Role Name",
  "description": "Updated description",
  "permissionIds": ["perm1", "perm2"]
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "roleId": "role_1234567890_abc123",
    "roleName": "Updated Role Name",
    "description": "Updated description",
    "permissionIds": ["perm1", "perm2"],
    "userCount": 0,
    "isSystem": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing roleId parameter
- `403` - Cannot modify system roles
- `404` - Role not found
- `409` - Duplicate role name
- `500` - Server error

### 5. Delete Role
**DELETE** `/api/roles/delete?roleId=xxx`

Deletes a role from the system.

**Query Parameters:**
- `roleId` - Required, the ID of the role to delete

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role deleted successfully",
  "data": {
    "roleId": "role_1234567890_abc123"
  }
}
```

**Error Responses:**
- `400` - Missing roleId parameter
- `403` - Cannot delete system roles
- `404` - Role not found
- `409` - Cannot delete role with assigned users
- `500` - Server error

## Frontend Integration

### Using the API in React

```typescript
import api from "@/lib/http";

// Create a new role
const createRole = async () => {
  try {
    const response = await api.post('/api/roles/create', {
      body: {
        roleName: "USER",
        description: "Manages all user-related operations",
        permissionIds: [
          "b6136890-815d-4d2c-a626-c5cbcce25d00",
          "48d322e0-0792-40f3-8dbf-926b20e8b167"
        ]
      }
    });
    
    console.log('Role created:', response);
  } catch (error) {
    console.error('Failed to create role:', error);
  }
};

// Get all roles
const getRoles = async () => {
  try {
    const response = await api.get('/api/roles/get-all');
    const roles = response.data;
    console.log('Roles:', roles);
  } catch (error) {
    console.error('Failed to fetch roles:', error);
  }
};

// Update a role
const updateRole = async (roleId: string) => {
  try {
    const response = await api.put(`/api/roles/update?roleId=${roleId}`, {
      body: {
        roleName: "Updated Name",
        description: "Updated description"
      }
    });
    
    console.log('Role updated:', response);
  } catch (error) {
    console.error('Failed to update role:', error);
  }
};

// Delete a role
const deleteRole = async (roleId: string) => {
  try {
    const response = await api.delete(`/api/roles/delete?roleId=${roleId}`);
    console.log('Role deleted:', response);
  } catch (error) {
    console.error('Failed to delete role:', error);
  }
};
```

## Type Definitions

```typescript
export interface Role {
  roleId: string;
  roleName: string;
  description: string;
  permissionIds: string[];
  userCount?: number;
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RolesResponse extends ApiResponse<Role[]> {}
export interface RoleResponse extends ApiResponse<Role> {}
```

## Business Rules

1. **System Roles**: Roles with `isSystem: true` cannot be modified or deleted
2. **Role Names**: Must be unique (case-insensitive)
3. **User Assignment**: Roles with assigned users (`userCount > 0`) cannot be deleted
4. **Permission IDs**: Must be valid permission IDs from the permissions system

## Testing

### Quick Test in Browser Console

```javascript
// Test create role
fetch('/api/roles/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    roleName: "TEST_ROLE",
    description: "Test role for testing",
    permissionIds: []
  })
})
.then(r => r.json())
.then(console.log);
```

### Using cURL

```bash
# Create role
curl -X POST http://localhost:5000/api/roles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "roleName": "USER",
    "description": "Manages all user-related operations",
    "permissionIds": ["b6136890-815d-4d2c-a626-c5cbcce25d00"]
  }'

# Get all roles
curl http://localhost:5000/api/roles/get-all \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update role
curl -X PUT "http://localhost:5000/api/roles/update?roleId=role_123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "roleName": "Updated Role"
  }'

# Delete role
curl -X DELETE "http://localhost:5000/api/roles/delete?roleId=role_123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Implementation Status

✅ **Completed:**
- GET all roles endpoint
- GET role by ID endpoint
- POST create role endpoint (with exact format requested)
- PUT update role endpoint
- DELETE role endpoint
- Type definitions in shared/api.ts
- Frontend integration in RoleManagement page
- Validation and error handling
- Mock database for testing

## Next Steps for Production

1. **Replace Mock Database**: Replace the in-memory `rolesDb` Map with real database calls
2. **Add Authentication**: Ensure proper authentication middleware is applied
3. **Add Authorization**: Check user permissions before allowing role operations
4. **Add Audit Logging**: Log all role changes for compliance
5. **Validate Permission IDs**: Verify that permission IDs exist before creating/updating roles
6. **Add Pagination**: For large role lists, implement pagination
7. **Add Search/Filter**: Allow filtering roles by name, permissions, etc.
