import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import MockEndpoint from '@/src/models/MockEndpoint';
import { generateRequestSchema } from '@/src/utils/sanitize';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();

    // Parse and validate input securely using Zod
    const validationResult = generateRequestSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues.map((e) => e.message).join(', ');
      return NextResponse.json(
        { success: false, endpointId: '', url: '', expiresAt: '', error: errorMessage },
        { status: 400 }
      );
    }

    const { prompt: cleanPrompt, lifespanHours } = validationResult.data;

    await connectDB();

    const endpointId = crypto.randomBytes(4).toString('hex');
    const expiresAt = new Date(Date.now() + lifespanHours * 60 * 60 * 1000);

    // Initial mock payload structure
    const mockPayload = {
      service: "Stanza Mock Engine",
      description: cleanPrompt,
      data: [
        { id: 1, label: "Alpha Mock Object", status: "active" },
        { id: 2, label: "Beta Mock Object", status: "pending" }
      ]
    };

    const newEndpoint = await MockEndpoint.create({
      endpointId,
      name: cleanPrompt.slice(0, 30),
      schemaData: mockPayload,
      expiresAt,
    });

    return NextResponse.json({
      success: true,
      endpointId: newEndpoint.endpointId,
      url: `/api/mock/${newEndpoint.endpointId}`,
      expiresAt: newEndpoint.expiresAt.toISOString(),
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Generation Error:', error);
    return NextResponse.json(
      { success: false, endpointId: '', url: '', expiresAt: '', error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}