import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import MockEndpoint from '@/src/models/MockEndpoint';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const urlObj = new URL(request.url);
    const searchParams = urlObj.searchParams;

    // Optional simulation parameters
    const delayParam = searchParams.get('delay');
    const statusParam = searchParams.get('status');

    // Simulate custom latency if requested (max 10 seconds to prevent abuse)
    if (delayParam) {
      const delayMs = Math.min(Number(delayParam) || 0, 10000);
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    await connectDB();

    // Find the mock endpoint in MongoDB
    const mockRecord = await MockEndpoint.findOne({ endpointId: id });

    if (!mockRecord) {
      return NextResponse.json(
        { error: 'Mock endpoint not found or has expired.' },
        { status: 404 }
      );
    }

    // Handle custom forced status code testing if requested
    if (statusParam) {
      const forcedStatus = Number(statusParam);
      if (forcedStatus >= 100 && forcedStatus < 600) {
        return NextResponse.json(
          { 
            error: `Simulated error response with status ${forcedStatus}`,
            endpointId: id 
          },
          { status: forcedStatus }
        );
      }
    }

    // Return the stored mock JSON schema payload successfully
    return NextResponse.json(mockRecord.schemaData, { status: 200 });

  } catch (error: unknown) {
    console.error('Mock Serving Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while serving mock endpoint.' },
      { status: 500 }
    );
  }
}