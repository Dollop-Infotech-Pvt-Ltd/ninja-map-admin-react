# Permissions API Testing Guide

## Quick Start

The permissions APIs have been successfully integrated. Here's how to test them:

## Method 1: Via the UI Dashboard

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Permissions Management:**
   - Go to http://localhost:8080/dashboard/permissions (after login)
   - Or click "Manage Permissions" from the dashboard

3. **Test the APIs:**
   - **Create:** Click the "Create Permission" button
   - **Update:** Click the eye icon on any permission to edit it
   - **Delete:** Click the X icon on any permission to delete it

## Method 2: Using React DevTools Console

Open your browser console and test using the API client:

```javascript
// Import the API client
import api from "@/lib/http";

// Test 1: Get all permissions
const allPerms = await api.get("/api/permissions/get-all");
console.log("All permissions:", allPerms);

// Test 2: Get user permissions
const userPerms = await api.get("/api/permissions/me");
console.log("User permissions:", userPerms);

// Test 3: Create a new permission
const newPerm = await api.post("/api/permissions/create", {
  body: {
    resource: "BLOG_POST_MANAGEMENT",
    action: "SHARE_BLOGS",
    type: "WRITE"
  }
});
console.log("Created permission:", newPerm);
const permId = newPerm.data.permissionId;

// Test 4: Update the permission
const updated = await api.put(`/api/permissions/update?permissionId=${permId}`, {
  body: {
    resource: "ADMIN_MANAGEMENT",
    action: "EDIT_ADMINS",
    type: "WRITE"
  }
});
console.log("Updated permission:", updated);

// Test 5: Delete the permission
const deleted = await api.delete(`/api/permissions/delete?permissionId=${permId}`);
console.log("Deleted permission:", deleted);
```

## Method 3: Using cURL/Postman

### Prerequisites
- Base URL: `http://localhost:8080`
- Content-Type: `application/json`

### 1. Get All Permissions
```bash
GET /api/permissions/get-all
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "permissionId": "1",
      "resource": "ADMIN_MANAGEMENT",
      "action": "VIEW_ADMINS",
      "type": "READ"
    },
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
```bash
GET /api/permissions/me
```

### 3. Create Permission
```bash
POST /api/permissions/create
Content-Type: application/json

{
  "resource": "ADMIN_MANAGEMENT",
  "action": "EDIT_ADMINS",
  "type": "WRITE"
}
```

Response:
```json
{
  "success": true,
  "message": "Permission created successfully",
  "data": {
    "permissionId": "1698765432-xyz789",
    "resource": "ADMIN_MANAGEMENT",
    "action": "EDIT_ADMINS",
    "type": "WRITE"
  }
}
```

### 4. Update Permission ✅
```bash
PUT /api/permissions/update?permissionId=14757caf-0c7d-416f-93bf-acdb977b8681
Content-Type: application/json

{
  "resource": "ADMIN_MANAGEMENT",
  "action": "EDIT_ADMINS",
  "type": "WRITE"
}
```

Response:
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

### 5. Delete Permission ✅
```bash
DELETE /api/permissions/delete?permissionId=123
```

Response:
```json
{
  "success": true,
  "message": "Permission deleted successfully",
  "data": {
    "permissionId": "123"
  }
}
```

## Expected Mock Data

The backend includes mock permissions for testing:

| permissionId | Resource | Action | Type |
|---|---|---|---|
| 1 | ADMIN_MANAGEMENT | VIEW_ADMINS | READ |
| 2 | ADMIN_MANAGEMENT | EDIT_ADMINS | WRITE |
| 3 | ADMIN_MANAGEMENT | DELETE_ADMINS | DELETE |
| 4 | USER_MANAGEMENT | VIEW_USERS | READ |
| 5 | USER_MANAGEMENT | EDIT_USERS | WRITE |
| 6 | ROLE_MANAGEMENT | VIEW_ROLES | READ |
| 7 | ROLE_MANAGEMENT | CREATE_ROLES | WRITE |
| 8 | BLOG_POST_MANAGEMENT | VIEW_POSTS | READ |
| 9 | BLOG_POST_MANAGEMENT | CREATE_POSTS | WRITE |

## Testing Checklist

- [ ] Server starts with `npm run dev`
- [ ] GET `/api/permissions/get-all` returns all permissions
- [ ] GET `/api/permissions/me` returns user permissions
- [ ] POST `/api/permissions/create` creates a new permission
- [ ] PUT `/api/permissions/update?permissionId=X` updates a permission
- [ ] DELETE `/api/permissions/delete?permissionId=X` deletes a permission
- [ ] Permissions Management UI loads at `/dashboard/permissions`
- [ ] Can create permissions via UI
- [ ] Can update permissions via UI (eye icon)
- [ ] Can delete permissions via UI (X icon)

## Common Issues & Solutions

### Issue: 400 Bad Request on Update
**Cause:** Missing `permissionId` in query string or invalid body
**Solution:** Ensure URL includes `?permissionId=YOUR_ID` and body has all required fields

### Issue: 404 Not Found on Delete/Update
**Cause:** Permission ID doesn't exist
**Solution:** Use IDs from GET endpoint response or create a new permission first

### Issue: 500 Server Error
**Cause:** Unexpected server error
**Solution:** Check server logs and ensure all fields are properly formatted

## Notes

- All IDs are case-sensitive
- Permission types must be: READ, WRITE, DELETE, or ADMIN
- Resource names are typically in SCREAMING_SNAKE_CASE
- Action names are typically in SCREAMING_SNAKE_CASE
- All responses follow the standard ApiResponse format
