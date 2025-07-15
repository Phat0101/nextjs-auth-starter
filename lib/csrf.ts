"use server";

import { randomBytes } from 'crypto'
import { cookies } from 'next/headers'

// Generate CSRF token
export const generateCSRFToken = async (): Promise<string> => {
  return randomBytes(32).toString('hex')
}

// Validate CSRF token
export const validateCSRFToken = async (formToken: string): Promise<boolean> => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('csrf-token')?.value
  return sessionToken === formToken
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

// Get CSRF token from cookie
export const getCSRFToken = async (): Promise<string | null> => {
  const cookieStore = await cookies()
  return cookieStore.get('csrf-token')?.value || null
} 