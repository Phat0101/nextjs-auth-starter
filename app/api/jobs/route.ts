import { createSecureResponse } from "../security-headers";

export async function GET() {
  try {
    // Return 3 fake jobs instead of reading from database
    const fakeJobs = [
      {
        id: "1",
        title: "Invoice eagle",
        description: "Processing invoice eagle",
        fileName: "test.pdf",
        fileSize: 2048576,
        status: "completed",
        createdAt: new Date("2025-07-15T10:30:00Z"),
        updatedAt: new Date("2025-07-15T10:35:00Z"),
      },
      {
        id: "2", 
        title: "test",
        description: "test",
        fileName: "test.pdf",
        fileSize: 1536000,
        status: "processing",
        createdAt: new Date("2025-07-15T14:20:00Z"),
        updatedAt: new Date("2025-07-15T14:25:00Z"),
      },
      {
        id: "3",
        title: "test",
        description: "test",
        fileName: "test.pdf", 
        fileSize: 3145728,
        status: "pending",
        createdAt: new Date("2025-07-15T09:15:00Z"),
        updatedAt: new Date("2025-07-15T09:15:00Z"),
      }
    ];

    return createSecureResponse({ 
      jobs: fakeJobs, 
      totalPages: 1 
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return createSecureResponse(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
} 