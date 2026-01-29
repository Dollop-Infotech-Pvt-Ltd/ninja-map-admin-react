import { Request, Response } from "express";

// Mock database for contact-us queries (replace with real database in production)
const contactUsDb = new Map<string, any>();

// Initialize with some mock data
contactUsDb.set("03270a8d-418b-4f83-925d-d96fe14d37b7", {
  id: "03270a8d-418b-4f83-925d-d96fe14d37b7",
  fullName: "John Doe",
  emailAddress: "john.doe@example.com",
  inquiryType: "General Inquiry",
  subject: "Question about your services",
  message: "I would like to know more about your services and pricing.",
  createdAt: "2024-01-10T10:30:00.000Z"
});

contactUsDb.set("b4e8f2c1-9a3d-4e7f-8c2b-1d5a6e9f3c8a", {
  id: "b4e8f2c1-9a3d-4e7f-8c2b-1d5a6e9f3c8a",
  fullName: "Jane Smith",
  emailAddress: "jane.smith@example.com",
  inquiryType: "Support",
  subject: "Technical issue",
  message: "I'm experiencing some technical difficulties with the platform.",
  createdAt: "2024-01-12T14:20:00.000Z"
});

/**
 * GET /api/contact-us/get-all
 * Get all contact-us queries with pagination
 */
export async function handleGetAllContactUs(req: Request, res: Response) {
  try {
    const { pageNumber = 0, pageSize = 10, search = "" } = req.query;
    
    const page = parseInt(pageNumber as string, 10);
    const size = parseInt(pageSize as string, 10);
    const searchTerm = (search as string).toLowerCase();

    // Get all queries
    let queries = Array.from(contactUsDb.values());

    // Filter by search term if provided
    if (searchTerm) {
      queries = queries.filter(q => 
        q.fullName?.toLowerCase().includes(searchTerm) ||
        q.emailAddress?.toLowerCase().includes(searchTerm) ||
        q.subject?.toLowerCase().includes(searchTerm) ||
        q.message?.toLowerCase().includes(searchTerm) ||
        q.inquiryType?.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by createdAt descending
    queries.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    // Pagination
    const totalElements = queries.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const end = start + size;
    const content = queries.slice(start, end);

    res.status(200).json({
      success: true,
      data: {
        content,
        pageNumber: page,
        pageSize: size,
        totalElements,
        totalPages,
        numberOfElements: content.length,
        firstPage: page === 0,
        lastPage: page >= totalPages - 1
      }
    });
  } catch (error: any) {
    console.error("Error fetching contact-us queries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch queries",
      error: error.message
    });
  }
}

/**
 * DELETE /api/contact-us/delete?id=xxx
 * Delete a contact-us query by ID
 */
export async function handleDeleteContactUs(req: Request, res: Response) {
  try {
    const { id } = req.query;

    // Validation
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "id query parameter is required"
      });
    }

    // Check if query exists
    const existingQuery = contactUsDb.get(id);
    if (!existingQuery) {
      return res.status(404).json({
        success: false,
        message: `Query with ID "${id}" not found`
      });
    }

    // Delete query
    contactUsDb.delete(id);

    res.status(200).json({
      success: true,
      message: "Query deleted successfully",
      data: {
        id: id
      }
    });
  } catch (error: any) {
    console.error("Error deleting contact-us query:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete query",
      error: error.message
    });
  }
}

/**
 * GET /api/contact-us/:id
 * Get a specific contact-us query by ID
 */
export async function handleGetContactUsById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id parameter is required"
      });
    }

    const query = contactUsDb.get(id);
    
    if (!query) {
      return res.status(404).json({
        success: false,
        message: `Query with ID "${id}" not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Query retrieved successfully",
      data: query
    });
  } catch (error: any) {
    console.error("Error fetching contact-us query:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch query",
      error: error.message
    });
  }
}
