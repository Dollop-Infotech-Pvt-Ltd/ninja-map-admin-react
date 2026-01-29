/**
 * Simple test data for customer stories to verify the component works
 */
import { CustomerStory } from "@shared/api"

export const testCustomerStories: CustomerStory[] = [
  {
    id: "test-1",
    title: "Test Business Story",
    description: "This is a test business story for verification",
    category: "BUSINESS",
    rating: 5,
    location: "Test City",
    author: {
      name: "Test User",
      email: "test@example.com",
      bio: "Test user bio"
    },
    stats: {
      views: 10,
      likes: 5,
      comments: 2,
      shares: 1
    },
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    isActive: true,
    isApproved: false,
    status: "PENDING"
  },
  {
    id: "test-2",
    title: "Test Healthcare Story",
    description: "This is a test healthcare story",
    category: "HEALTHCARE",
    rating: 4,
    location: "Another City",
    author: {
      name: "Another User",
      email: "another@example.com",
      bio: "Another test user"
    },
    stats: {
      views: 20,
      likes: 8,
      comments: 3,
      shares: 2
    },
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    isActive: true,
    isApproved: true,
    status: "APPROVED"
  }
]