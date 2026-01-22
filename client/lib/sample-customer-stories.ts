import { CustomerStory } from "@shared/api"

/**
 * Sample customer stories data showing the proper structure
 * with isApproved field and comprehensive stats
 */
export const sampleCustomerStories: CustomerStory[] = [
  {
    id: "7c9aaeb4-180e-43fd-a1fa-ae01f5ab8c8c",
    title: "Excellent Business Partnership",
    description: "Our business partnership has been outstanding. The service delivery was prompt and professional. The team understood our requirements perfectly and delivered beyond expectations.",
    category: "BUSINESS",
    rating: 5,
    location: "New York, NY",
    author: {
      name: "John Smith",
      email: "john.smith@example.com",
      designation: "Operations Manager",
      organisationName: "Tech Solutions Inc.",
      profilePicture: "https://example.com/avatar1.jpg",
      bio: "Operations manager with 10+ years experience in business operations"
    },
    stats: {
      views: 245,
      likes: 18,
      comments: 5,
      shares: 3
    },
    createdDate: "2024-01-15T10:30:00Z",
    updatedDate: "2024-01-15T10:30:00Z",
    isActive: true,
    isApproved: true,
    status: "APPROVED"
  },
  {
    id: "8d1bbfc5-291f-54ge-b2gb-bf12g6bc9d9d",
    title: "Great Transport Experience",
    description: "The transport service was reliable and cost-effective. The vehicle was clean and the driver was courteous. Would definitely recommend to others for their transportation needs.",
    category: "TRANSPORT",
    rating: 4,
    location: "Los Angeles, CA",
    author: {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      designation: "Logistics Coordinator",
      organisationName: "Supply Chain Co.",
      profilePicture: "https://example.com/avatar2.jpg",
      bio: "Logistics professional specializing in transportation management"
    },
    stats: {
      views: 189,
      likes: 12,
      comments: 3,
      shares: 2
    },
    createdDate: "2024-01-14T14:20:00Z",
    updatedDate: "2024-01-14T14:20:00Z",
    isActive: true,
    isApproved: false,
    status: "PENDING"
  },
  {
    id: "9e2ccgd6-3a2g-65hf-c3hc-cg23h7cd0e0e",
    title: "Outstanding Healthcare Service",
    description: "The healthcare service provided was exceptional. The staff was professional, caring, and attentive to all my needs. The facility was clean and well-maintained.",
    category: "HEALTHCARE",
    rating: 5,
    location: "Chicago, IL",
    author: {
      name: "Mike Wilson",
      email: "mike.wilson@example.com",
      designation: "Healthcare Administrator",
      organisationName: "Medical Center Corp.",
      profilePicture: "https://example.com/avatar3.jpg",
      bio: "Healthcare administrator with focus on patient experience"
    },
    stats: {
      views: 156,
      likes: 22,
      comments: 8,
      shares: 4
    },
    createdDate: "2024-01-13T09:15:00Z",
    updatedDate: "2024-01-13T16:45:00Z",
    isActive: true,
    isApproved: false,
    status: "PENDING"
  },
  {
    id: "ae3ddhf7-4b3h-76ig-d4id-dh34i8de1f1f",
    title: "Personal Service Excellence",
    description: "The personal service I received was truly remarkable. The attention to detail and personalized approach made all the difference. Highly satisfied with the experience.",
    category: "PERSONAL",
    rating: 5,
    location: "Miami, FL",
    author: {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      designation: "Marketing Director",
      organisationName: "Creative Agency Ltd.",
      profilePicture: "https://example.com/avatar4.jpg",
      bio: "Marketing professional with focus on customer experience"
    },
    stats: {
      views: 98,
      likes: 15,
      comments: 6,
      shares: 2
    },
    createdDate: "2024-01-12T15:30:00Z",
    updatedDate: "2024-01-12T15:30:00Z",
    isActive: true,
    isApproved: true,
    status: "APPROVED"
  },
  {
    id: "bf4eehg8-5c4i-87jh-e5je-ei45j9ef2g2g",
    title: "Unique Service Experience",
    description: "This was a unique service that doesn't fit into typical categories, but the quality was exceptional. The team was innovative and provided solutions I didn't expect.",
    category: "OTHER",
    rating: 4,
    location: "Seattle, WA",
    author: {
      name: "David Brown",
      email: "david.brown@example.com",
      designation: "Innovation Manager",
      organisationName: "Tech Startup Inc.",
      profilePicture: "https://example.com/avatar5.jpg",
      bio: "Innovation manager exploring new service categories"
    },
    stats: {
      views: 67,
      likes: 8,
      comments: 2,
      shares: 1
    },
    createdDate: "2024-01-11T11:20:00Z",
    updatedDate: "2024-01-11T11:20:00Z",
    isActive: true,
    isApproved: false,
    status: "PENDING"
  }
]

/**
 * Example of creating a new customer story with proper defaults
 */
export const createNewStoryExample = (): Partial<CustomerStory> => ({
  title: "New Customer Story",
  description: "This is a new customer story submission",
  category: "BUSINESS",
  rating: 0,
  location: "City, State",
  author: {
    name: "Customer Name",
    email: "customer@example.com",
    designation: "Job Title",
    organisationName: "Company Name",
    bio: "Brief bio about the customer"
  },
  stats: {
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0
  },
  isActive: true,
  isApproved: false,
  status: "PENDING"
})