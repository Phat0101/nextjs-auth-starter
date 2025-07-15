import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const jobsPerPage = 5;
  const offset = (page - 1) * jobsPerPage;

  // Fetch paginated jobs
  const jobs = await prisma.job.findMany({
    skip: offset,
    take: jobsPerPage,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  const totalJobs = await prisma.job.count();
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  return NextResponse.json({ jobs, totalPages });
} 