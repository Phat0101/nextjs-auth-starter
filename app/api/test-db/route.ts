import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("=== Database Connection Test ===");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("DATABASE_URL starts with:", process.env.DATABASE_URL?.substring(0, 20) + "...");
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("Database query result:", result);
    
    // Test user table
    const userCount = await prisma.user.count();
    console.log("User count:", userCount);
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("=== Database Connection Error ===");
    console.error("Error details:", error);
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 