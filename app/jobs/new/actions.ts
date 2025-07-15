"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function createJob(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("You must be logged in to create a job");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("Please select a PDF file");
  }

  // Validate file type
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error("File size must be less than 10MB");
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create job record in database with file content
    await prisma.job.create({
      data: {
        title,
        description: description || null,
        fileName: file.name,
        fileContent: buffer,
        fileSize: file.size,
        mimeType: file.type,
        userId: session.user.id,
        status: "PENDING",
      },
    });
  } catch (error) {
    console.error("Error creating job:", error);
    throw new Error("Failed to create job. Please try again.");
  }

  // Redirect after successful creation (outside try-catch)
  redirect("/jobs");
} 