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
    include: {
      user: true,
    },
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <article className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* Job Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900">{job.title}</h1>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
              job.status
            )}`}
          >
            {job.status}
          </span>
        </div>

        {/* PDF Viewer Section */}
        {pdfDataUrl ? (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Document Viewer
            </h2>
            <div className="w-full h-[600px] border rounded-lg overflow-hidden">
              <iframe
                src={pdfDataUrl}
                title={job.fileName}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        ) : (
          <div className="mb-6 text-center text-gray-500">
            No PDF document available for this job.
          </div>
        )}

        {/* Job Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500 mb-1">Created by</p>
            <p className="text-lg font-medium text-gray-800">
              {job.user?.name || "Anonymous"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Created on</p>
            <p className="text-lg font-medium text-gray-800">
              {new Date(job.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">File Name</p>
            <p className="text-lg font-medium text-gray-800">{job.fileName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Last Updated</p>
            <p className="text-lg font-medium text-gray-800">
              {new Date(job.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Description
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {job.description || "No description provided for this job."}
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Extraction Results
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {job.result ? (
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.result}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                {job.status === "PENDING" && "Job is pending processing..."}
                {job.status === "PROCESSING" &&
                  "Job is currently being processed..."}
                {job.status === "FAILED" &&
                  "Job failed to process. No results available."}
                {job.status === "COMPLETED" &&
                  "No results available for this completed job."}
              </p>
            )}
          </div>
        </div>
      </article>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        <Link
          href="/jobs"
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Jobs
        </Link>
        <form action={deleteJob} className="inline">
          <button
            type="submit"
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete Job
          </button>
        </form>
      </div>
    </div>
  );
} 