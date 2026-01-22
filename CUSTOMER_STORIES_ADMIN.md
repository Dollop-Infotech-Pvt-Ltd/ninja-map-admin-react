# Customer Stories Admin

This feature provides an admin interface to manage customer story submissions with PENDING, APPROVED, and REJECTED status workflow.

## Features

### 1. View Customer Stories
- **Endpoint**: `GET /api/customer-stories/admin/get-customer-stories`
- **Query Parameters**:
  - `status`: Filter by status (PENDING, APPROVED, REJECTED)
  - `pageSize`: Number of items per page
  - `pageNumber`: Page number for pagination

### 2. Approve Stories
- **Endpoint**: `PATCH /api/customer-stories/admin/approve-reject?id={id}&isApproved={boolean}`
- **Parameters**:
  - `id`: Story ID
  - `isApproved`: `true` for approve
- Changes story status from PENDING to APPROVED

## Admin Interface

### Navigation
- Access via: `/dashboard/customer-stories`
- Added to the main navigation menu with a star icon

### Key Features
1. **Filter by Status**: View all, pending, or approved stories
2. **Filter by Category**: Filter by business, transport, healthcare, personal, or other categories
3. **Search**: Search across story titles, author names, emails, content, and locations
4. **Pagination**: Navigate through large sets of stories
5. **Detailed View**: Click to view complete story details including stats
6. **Approval Workflow**: Approve pending stories
7. **Responsive Design**: Works on desktop and mobile devices

### Story Information Displayed
- Author name, email, bio, and profile picture
- Story title and description preview
- Category and location
- Creation date
- Current status (PENDING/APPROVED with color-coded badges)
- Approve button for pending stories only

### Approval Workflow
1. Admin sees pending stories by default (stories awaiting review)
2. Can filter to see all stories or approved ones
3. Clicks "View Details" to read the full story with engagement stats
4. Can approve pending stories from either the table or detail view
5. Confirmation dialog prevents accidental actions
6. Real-time status updates with toast notifications
7. Approved stories become publicly visible

## Data Structure

```typescript
interface CustomerStoryAuthor {
  name: string
  email: string
  designation?: string
  organisationName?: string
  profilePicture?: string
  bio?: string
}

interface CustomerStoryStats {
  views?: number
  likes: number
  comments?: number
  shares?: number
}

interface CustomerStory {
  id: string
  title: string
  description: string
  category: string
  rating: number
  location: string
  author: CustomerStoryAuthor
  stats: CustomerStoryStats
  createdDate: string
  updatedDate: string
  isActive: boolean
  status?: 'PENDING' | 'APPROVED'
}
```

## Usage

1. Navigate to `/dashboard/customer-stories`
2. By default, view pending stories that need review
3. Use the status filter to view all, pending, or approved stories
4. Use the category filter to view stories by category
5. Search for specific stories using the search bar
6. Click on any story to view full details including engagement stats
7. Use "Approve" action for pending stories
8. Use pagination controls to navigate through multiple pages

## Status Workflow

- **PENDING**: New story submissions waiting for admin review
- **APPROVED**: Stories approved by admin, visible to public (`isApproved=true`)

## API Integration

The interface uses a single endpoint for both approve and reject actions:

```
PATCH /api/customer-stories/admin/approve-reject?id={storyId}&isApproved={boolean}
```

**Examples:**
- Approve: `/api/customer-stories/admin/approve-reject?id=7c9aaeb4-180e-43fd-a1fa-ae01f5ab8c8c&isApproved=true`

## Technical Implementation

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn/ui components
- **State Management**: React hooks
- **API Integration**: Axios with custom HTTP client
- **Animations**: Framer Motion for smooth transitions
- **Responsive**: Tailwind CSS for mobile-first design

The admin interface provides a comprehensive approval/rejection workflow for customer story submissions, allowing admins to review and moderate content before it becomes publicly visible.