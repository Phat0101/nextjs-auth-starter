"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  status: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

// Disable static generation
export const dynamic = "force-dynamic";

function JobsList() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    async function fetchJobs() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/jobs?page=${page}`);
        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await res.json();
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, [page]);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2 min-h-[200px]">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
        <>
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No extraction jobs available.</p>
              <Link href="/jobs/new">
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
                  Create Your First Job
                </button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-6 w-full max-w-4xl mx-auto">
              {jobs.map((job) => (
                <li key={job.id} className="border p-6 rounded-lg shadow-md bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/jobs/${job.id}`} className="text-2xl font-semibold text-gray-900 hover:underline">
                        {job.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">by {job.user?.name || "Anonymous"}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(job.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-gray-700 mt-2">{job.description || "No description available."}</p>
                      <p className="text-sm text-gray-500 mt-2">File: {job.fileName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center space-x-4 mt-8">
            {page > 1 && (
              <Link href={`/jobs?page=${page - 1}`}>
                <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Previous</button>
              </Link>
            )}
            {page < totalPages && (
              <Link href={`/jobs?page=${page + 1}`}>
                <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Next</button>
              </Link>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Extraction Jobs</h1>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-3 text-gray-600">Loading page...</p>
          </div>
        }
      >
        <JobsList />
      </Suspense>
    </div>
  );
} 