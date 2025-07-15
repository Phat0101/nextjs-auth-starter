"use server";

import { randomBytes } from 'crypto'
import { cookies } from 'next/headers'

// Generate CSRF token
export const generateCSRFToken = async (): Promise<string> => {
  return randomBytes(32).toString('hex')
}

// Validate CSRF token
const validateCSRFToken = async (formToken: string): Promise<boolean> => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('csrf-token')?.value
  return sessionToken === formToken
}

export const createJob = async (formData: FormData) => {
  // CSRF Protection
  const csrfToken = formData.get('csrf-token') as string
  if (!(await validateCSRFToken(csrfToken))) {
    throw new Error('Invalid CSRF token')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const file = formData.get('file') as File

  if (!title || !description || !file) {
    throw new Error('Missing required fields')
  }

  // Validate file type
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are allowed')
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File size must be less than 10MB')
  }

  try {
    // Convert file to buffer for database storage
    const buffer = await file.arrayBuffer()
    const fileData = new Uint8Array(buffer)

    const job = {
      id: Date.now().toString(),
      title,
      description,
      fileName: file.name,
      fileSize: file.size,
      fileData: Array.from(fileData), // Convert to array for storage
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // In a real app, you'd save this to database
    console.log('Job created:', { ...job, fileData: '[BINARY DATA]' })

    return { success: true, jobId: job.id }
  } catch (error) {
    console.error('Error creating job:', error)
    throw new Error('Failed to create job')
  }
}

// Set CSRF token in cookie
export const setCSRFToken = async (): Promise<string> => {
  const token = await generateCSRFToken()
  const cookieStore = await cookies()
  cookieStore.set('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  })
  return token
} 