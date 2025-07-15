import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log CSP violation
    console.error('CSP Violation Report:', {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      url: request.url,
      violation: body
    })
    
    // In production, you might want to send this to a monitoring service
    // Example: await sendToMonitoringService(body)
    
    return NextResponse.json({ status: 'received' }, { status: 200 })
  } catch (error) {
    console.error('Error processing CSP report:', error)
    return NextResponse.json({ error: 'Invalid report' }, { status: 400 })
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 