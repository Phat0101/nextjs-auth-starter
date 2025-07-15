"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { writeFile } from "fs/promises";
import { join } from "path";

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

  // Create uploads directory if it doesn't exist
  const uploadsDir = join(process.cwd(), "public", "uploads");
  
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(uploadsDir, filename);

    // Save file to disk
    await writeFile(filepath, buffer);

    // Create job record in database
    await prisma.job.create({
      data: {
        title,
        description: description || null,
        fileName: file.name,
        filePath: `/uploads/${filename}`,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    redirect("/jobs");
  } catch (error) {
    console.error("Error creating job:", error);
    throw new Error("Failed to create job. Please try again.");
  }
} 