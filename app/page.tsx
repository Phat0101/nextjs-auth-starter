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
  }> = [];
  let hasError = false;

  try {
    jobs = await prisma.job.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
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
    <div className="min-h-screen bg-gray-50 py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
            Data Extraction Platform
          </h1>
          <div className="mt-8">
            <Link
              href="/jobs/new"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Extraction
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Recent Jobs</h2>
            {jobs.length === 0 ? (
              <p className="text-gray-500">No jobs yet. Create your first extraction job!</p>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {job.title}
                      </Link>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {job.description || 'No description'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {job.fileName} • {job.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))}
                <Link
                  href="/jobs"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all jobs →
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-black">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Features</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Extract data from PDFs up to 10MB</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>AI-powered content analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Real-time processing status</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Secure file handling</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Export results in multiple formats</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Ready to extract data from your PDFs?
          </p>
          <Link
            href="/jobs/new"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Create New Job
          </Link>
        </div>
      </div>
    </div>
  );
}
