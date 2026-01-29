# Customer Stories Data Management

This document explains how customer stories data is managed in the admin interface, focusing on the key fields `isApproved` and `stats`.

## Data Structure

### CustomerStory Interface

```typescript
interface CustomerStory {
  id: string;
  title: string;
  description: string;
  category: string;
  rating: number;
  location: string;
  author: CustomerStoryAuthor;
  stats: CustomerStoryStats;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
  isApproved: boolean;  // Key field for approval status
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}
```

### Key Fields Explained

#### `isApproved` Field
- **Type**: `boolean`
- **Purpose**: Primary field that determines if a story is approved for public display
- **Values**:
  - `true`: Story is approved and visible to public
  - `false`: Story is rejected and hidden from public
  - `undefined`: Story is pending review (new submissions)

#### `status` Field
- **Type**: `'PENDING' | 'APPROVED' | 'REJECTED'`
- **Purpose**: Human-readable status derived from `isApproved`
- **Relationship**:
  - `isApproved: true` → `status: 'APPROVED'`
  - `isApproved: false` → `status: 'REJECTED'`
  - `isApproved: undefined` → `status: 'PENDING'`

#### `stats` Object
```typescript
interface CustomerStoryStats {
  views?: number;    // Number of times story was viewed
  likes: number;     // Number of likes received
  comments?: number; // Number of comments
  shares?: number;   // Number of times shared
}
```

## Data Flow

### 1. Story Submission
When a new customer story is submitted:
```typescript
{
  // ... other fields
  isApproved: false,  // Default for new submissions
  status: 'PENDING',
  stats: {
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0
  }
}
```

### 2. Admin Approval/Rejection
Admin uses the API endpoint:
```
PATCH /api/customer-stories/admin/approve-reject?id={storyId}&isApproved={boolean}
```

**Approval Example:**
```typescript
// API Call
PATCH /api/customer-stories/admin/approve-reject?id=123&isApproved=true

// Updated Story Data
{
  // ... other fields
  isApproved: true,
  status: 'APPROVED',
  updatedDate: '2024-01-21T10:30:00Z'
}
```

**Rejection Example:**
```typescript
// API Call
PATCH /api/customer-stories/admin/approve-reject?id=123&isApproved=false

// Updated Story Data
{
  // ... other fields
  isApproved: false,
  status: 'REJECTED',
  updatedDate: '2024-01-21T10:30:00Z'
}
```

## Data Normalization

The system includes data normalization to ensure consistency:

```typescript
import { normalizeCustomerStory } from '@/lib/customer-story-utils'

// Normalizes data to ensure isApproved and status are consistent
const normalizedStory = normalizeCustomerStory(rawStory)
```

### Normalization Rules
1. If `status` is missing, derive it from `isApproved`
2. Ensure `stats` object has default values for all fields
3. Maintain consistency between `isApproved` and `status`

## Utility Functions

### Available Utilities
```typescript
import {
  createDefaultCustomerStory,
  normalizeCustomerStory,
  updateStoryApprovalStatus,
  filterStoriesBySearch,
  filterStoriesByCategory,
  filterStoriesByStatus
} from '@/lib/customer-story-utils'
```

### Usage Examples

#### Creating a New Story
```typescript
const newStory = createDefaultCustomerStory({
  title: "My Experience",
  description: "Great service!",
  category: "DELIVERY"
})
```

#### Updating Approval Status
```typescript
const approvedStory = updateStoryApprovalStatus(story, true)
// Results in: { ...story, isApproved: true, status: 'APPROVED' }
```

#### Filtering Stories
```typescript
// Filter by search term
const searchResults = filterStoriesBySearch(stories, "delivery")

// Filter by category
const deliveryStories = filterStoriesByCategory(stories, "DELIVERY")

// Filter by status
const pendingStories = filterStoriesByStatus(stories, "PENDING")
```

## Admin Interface Integration

### Table Display
The admin table shows:
- Author information with avatar
- Story title and description preview
- Category badge
- Status badge (color-coded)
- Creation date
- Action buttons for pending stories

### Status Badges
- **PENDING**: Secondary variant (gray)
- **APPROVED**: Default variant (green)
- **REJECTED**: Destructive variant (red)

### Approval Workflow
1. Admin views pending stories by default
2. Can filter by status (ALL, PENDING, APPROVED, REJECTED)
3. Clicks "View Details" to see full story with stats
4. Uses "Approve" or "Reject" buttons to change status
5. Confirmation dialogs prevent accidental actions
6. Real-time updates with toast notifications

## API Integration

### Endpoints Used
- `GET /api/customer-stories/admin/get-customer-stories` - Fetch stories with pagination
- `PATCH /api/customer-stories/admin/approve-reject` - Approve/reject stories

### Query Parameters
```typescript
{
  status?: 'PENDING' | 'APPROVED' | 'REJECTED',
  pageSize: number,
  pageNumber: number
}
```

### Response Format
```typescript
interface CustomerStoriesResponse extends PaginatedResponse<CustomerStory> {
  content: CustomerStory[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  firstPage: boolean;
  lastPage: boolean;
}
```

## Best Practices

1. **Always normalize data** when receiving from API
2. **Use utility functions** for consistent data manipulation
3. **Maintain isApproved/status consistency** in all operations
4. **Provide default values** for stats object
5. **Handle edge cases** gracefully (missing data, network errors)
6. **Use TypeScript types** from shared API definitions
7. **Update timestamps** when modifying stories

## Error Handling

The system includes comprehensive error handling:
- Network request failures
- Invalid data formats
- Missing required fields
- Unauthorized access
- Server errors

All errors are displayed to users via toast notifications with appropriate messaging.