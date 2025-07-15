import prisma from "@/lib/prisma";
import { createSecureResponse } from "../security-headers";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const jobsPerPage = 5;
    const offset = (page - 1) * jobsPerPage;

    // Fetch paginated jobs
    const jobs = await prisma.job.findMany({
      skip: offset,
      take: jobsPerPage,
      orderBy: { createdAt: "desc" },
    });

    const totalJobs = await prisma.job.count();
    const totalPages = Math.ceil(totalJobs / jobsPerPage);

    return createSecureResponse({ jobs, totalPages });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return createSecureResponse(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
} 