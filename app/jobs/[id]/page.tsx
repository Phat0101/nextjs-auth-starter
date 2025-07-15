export const dynamic = "force-dynamic"; // This disables SSG and ISR

import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    notFound();
  }

  // Convert fileContent buffer to a data URL
  const pdfDataUrl = job.fileContent
    ? `data:application/pdf;base64,${Buffer.from(job.fileContent).toString(
        "base64"
      )}`
    : null;

  // Server action to delete the job
  async function deleteJob() {
    "use server";

    await prisma.job.delete({
      where: {
        id: id,
      },
    });

    redirect("/jobs");
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/jobs"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Jobs
          </Link>
          <form action={deleteJob}>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Job
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>
                    Created: {job.createdAt.toLocaleDateString()}
                  </span>
                  <span>
                    Updated: {job.updatedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                {job.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Job Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {job.description || "No description provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File Name
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {job.fileName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File Size
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {(job.fileSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Extraction Results
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {job.result ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Extracted Data:
                      </p>
                      <div className="bg-white p-3 rounded border">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                          {job.result}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-2">No results available</p>
                      <p className="text-sm text-gray-400">
                        {job.status === "PENDING" && "Job is waiting to be processed"}
                        {job.status === "PROCESSING" && "Job is currently being processed"}
                        {job.status === "FAILED" && "Job processing failed"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PDF Viewer Section */}
          {pdfDataUrl && (
            <div className="border-t bg-gray-50 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                PDF Preview
              </h2>
              <div className="bg-white rounded-lg shadow-inner">
                <iframe
                  src={pdfDataUrl}
                  width="100%"
                  height="600"
                  className="rounded-lg"
                  title="PDF Preview"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 