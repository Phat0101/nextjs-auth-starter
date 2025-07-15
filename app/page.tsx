export const dynamic = "force-dynamic"; // This disables SSG and ISR

import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  let jobs: Array<{
    id: string;
    title: string;
    description?: string | null;
    fileName: string;
    status: string;
    createdAt: Date;
    user?: {
      name: string | null;
    } | null;
  }> = [];
  let hasError = false;

  try {
    jobs = await prisma.job.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Database connection error:", error);
    hasError = true;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Show setup message if database isn't available
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-24 px-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold mb-6 text-gray-900">Welcome to PDF Extractor</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-24 px-8">
      <h1 className="text-5xl font-extrabold mb-12 text-[#333333]">Recent Extraction Jobs</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mb-8">
        {jobs.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`} className="group">
            <div className="border rounded-lg shadow-md bg-white p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900 group-hover:underline">{job.title}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">by {job.user ? job.user.name : "Anonymous"}</p>
              <p className="text-xs text-gray-400 mb-4">
                {new Date(job.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="relative">
                <p className="text-gray-700 leading-relaxed line-clamp-2">
                  {job.description || "No description available."}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  File: {job.fileName}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {jobs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No extraction jobs found.</p>
          <Link href="/jobs/new">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
              Create Your First Job
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
