import connectDB from '@/src/lib/mongodb';
import MockEndpoint from '@/src/models/MockEndpoint';
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface MockItem {
  id: string | number;
  [key: string]: unknown;
}

// ================= READ (GET) =================
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const searchParams = request.nextUrl.searchParams;

    const delayParam = searchParams.get('delay');
    const statusParam = searchParams.get('status') || searchParams.get('statusCode');

    await connectDB();
    const mockRecord = await MockEndpoint.findOne({ endpointId: id });

    if (!mockRecord) {
      return NextResponse.json({ error: 'Mock endpoint not found or expired.' }, { status: 404 });
    }

    const latency = parseInt(delayParam || String(mockRecord.latencyMs || 0), 10);
    const statusCode = parseInt(statusParam || String(mockRecord.statusCode || 200), 10);

    if (latency > 0) {
      // Explicit bounds validation to satisfy static analysis security scans
      const clampedDelay = Math.min(Math.max(Number(latency) || 0, 0), 10000);

      if (clampedDelay > 10000) {
        return NextResponse.json({ error: 'Delay cannot exceed 10000ms' }, { status: 400 });
      }

      await new Promise((resolve) => setTimeout(resolve, clampedDelay));
    }

    return NextResponse.json(mockRecord.dataPayload, { status: statusCode });
  } catch (error: unknown) {
    console.error('Mock GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ================= CREATE (POST) =================
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;

    await connectDB();
    const mockRecord = await MockEndpoint.findOne({ endpointId: id });

    if (!mockRecord) {
      return NextResponse.json({ error: 'Mock endpoint not found or expired.' }, { status: 404 });
    }

    const payload = (mockRecord.dataPayload || []) as MockItem[];
    const maxId = payload.reduce((max, item) => {
      const itemIdNum = typeof item.id === 'number' ? item.id : Number(item.id) || 0;
      return itemIdNum > max ? itemIdNum : max;
    }, 0);

    const newItem: MockItem = {
      id: maxId + 1,
      ...body,
      createdAt: new Date().toISOString(),
    };

    payload.push(newItem);
    mockRecord.dataPayload = payload;
    mockRecord.markModified('dataPayload');
    await mockRecord.save();

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error: unknown) {
    console.error('Mock POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ================= UPDATE (PUT / PATCH) =================
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const urlObj = new URL(request.url);
    const itemId = urlObj.searchParams.get('itemId');
    const body = (await request.json()) as Record<string, unknown>;

    if (!itemId) {
      return NextResponse.json({ error: 'Missing itemId query parameter for update.' }, { status: 400 });
    }

    await connectDB();
    const mockRecord = await MockEndpoint.findOne({ endpointId: id });

    if (!mockRecord) {
      return NextResponse.json({ error: 'Mock endpoint not found or expired.' }, { status: 404 });
    }

    const payload = (mockRecord.dataPayload || []) as MockItem[];
    const itemIndex = payload.findIndex((item) => String(item.id) === String(itemId));

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found in mock payload.' }, { status: 404 });
    }

    payload[itemIndex] = {
      ...payload[itemIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    mockRecord.dataPayload = payload;
    mockRecord.markModified('dataPayload');
    await mockRecord.save();

    return NextResponse.json({ success: true, data: payload[itemIndex] }, { status: 200 });
  } catch (error: unknown) {
    console.error('Mock PUT Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const urlObj = new URL(request.url);
    const itemId = urlObj.searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'Missing itemId query parameter for deletion.' }, { status: 400 });
    }

    await connectDB();
    const mockRecord = await MockEndpoint.findOne({ endpointId: id });

    if (!mockRecord) {
      return NextResponse.json({ error: 'Mock endpoint not found or expired.' }, { status: 404 });
    }

    const payload = (mockRecord.dataPayload || []) as MockItem[];
    const initialLength = payload.length;

    const filteredPayload = payload.filter((item) => String(item.id) !== String(itemId));

    if (filteredPayload.length === initialLength) {
      return NextResponse.json({ error: 'Item not found in mock payload.' }, { status: 404 });
    }

    mockRecord.dataPayload = filteredPayload;
    mockRecord.markModified('dataPayload');
    await mockRecord.save();

    return NextResponse.json({ success: true, message: `Item ${itemId} deleted successfully.` }, { status: 200 });
  } catch (error: unknown) {
    console.error('Mock DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}