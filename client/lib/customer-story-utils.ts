import { CustomerStory, CustomerStoryAuthor, CustomerStoryStats } from "@shared/api"

/**
 * Creates a new customer story with default values
 */
export const createDefaultCustomerStory = (
  overrides: Partial<CustomerStory> = {}
): Partial<CustomerStory> => {
  const defaultAuthor: CustomerStoryAuthor = {
    name: "",
    email: "",
    designation: "",
    organisationName: "",
    profilePicture: "",
    bio: ""
  }

  const defaultStats: CustomerStoryStats = {
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0
  }

  return {
    id: "",
    title: "",
    description: "",
    category: "BUSINESS",
    rating: 0,
    location: "",
    author: defaultAuthor,
    stats: defaultStats,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    isActive: true,
    isApproved: false,
    status: 'PENDING',
    ...overrides
  }
}

/**
 * Normalizes customer story data to ensure consistency between isApproved and status
 */
export const normalizeCustomerStory = (story: CustomerStory): CustomerStory => {
  // Derive status from isApproved if status is not set
  let status = story.status
  if (!status) {
    if (story.isApproved === true) {
      status = 'APPROVED'
    } else {
      status = 'PENDING'
    }
  }

  // Ensure stats object has default values
  const stats: CustomerStoryStats = {
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    ...story.stats
  }

  return {
    ...story,
    status,
    stats
  }
}

/**
 * Updates a customer story's approval status
 */
export const updateStoryApprovalStatus = (
  story: CustomerStory, 
  isApproved: boolean
): CustomerStory => {
  return {
    ...story,
    isApproved,
    status: isApproved ? 'APPROVED' : 'PENDING',
    updatedDate: new Date().toISOString()
  }
}

/**
 * Filters customer stories based on search query
 */
export const filterStoriesBySearch = (
  stories: CustomerStory[], 
  searchQuery: string
): CustomerStory[] => {
  if (!searchQuery.trim()) return stories
  
  const searchLower = searchQuery.toLowerCase()
  
  return stories.filter(story => {
    return (
      (story.title || '').toLowerCase().includes(searchLower) ||
      (story.author?.name || '').toLowerCase().includes(searchLower) ||
      (story.author?.email || '').toLowerCase().includes(searchLower) ||
      (story.description || '').toLowerCase().includes(searchLower) ||
      (story.location || '').toLowerCase().includes(searchLower) ||
      (story.category || '').toLowerCase().includes(searchLower)
    )
  })
}

/**
 * Filters customer stories by category
 */
export const filterStoriesByCategory = (
  stories: CustomerStory[], 
  category: string
): CustomerStory[] => {
  if (category === "ALL") return stories
  return stories.filter(story => story.category === category)
}

/**
 * Filters customer stories by status
 */
export const filterStoriesByStatus = (
  stories: CustomerStory[], 
  status: string
): CustomerStory[] => {
  if (status === "ALL") return stories
  return stories.filter(story => story.status === status)
}