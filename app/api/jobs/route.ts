import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

  return NextResponse.json({ jobs, totalPages });
} 