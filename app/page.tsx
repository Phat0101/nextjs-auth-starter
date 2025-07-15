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
                     <p className="text-lg text-gray-600 mb-8">
             It looks like the database isn&apos;t set up yet. Please follow the setup instructions to get started.
           </p>
          <div className="bg-white rounded-lg shadow-md p-6 text-left">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Setup Steps:</h2>
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
                <span>Set up your database connection in <code className="bg-gray-100 px-2 py-1 rounded">.env</code></span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
                <span>Run <code className="bg-gray-100 px-2 py-1 rounded">npx prisma migrate dev --name init</code></span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
                <span>Run <code className="bg-gray-100 px-2 py-1 rounded">npx prisma db seed</code></span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">4</span>
                <span>Refresh this page</span>
              </li>
            </ol>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Check the README.md file for detailed setup instructions.
          </p>
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
