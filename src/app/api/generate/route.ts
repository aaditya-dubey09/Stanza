import connectDB from '@/src/lib/mongodb';
import MockEndpoint from '@/src/models/MockEndpoint';
import { generateRequestSchema } from '@/src/utils/sanitize';
import { faker } from '@faker-js/faker';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const ASSET_POOL = {
  avatars: [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  ],
  general: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"
  ]
};

const CANDIDATE_MODELS = [
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-20b"
];

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validationResult = generateRequestSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues.map((e) => e.message).join(', ');
      return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }

    const { prompt: cleanPrompt, lifespanHours, isList = true } = rawBody;
    await connectDB();

    const systemInstruction = `You are an expert backend API architect and data modeler. Analyze the user prompt carefully.
    Your task is to translate the user's requested data structure into a flexible JSON schema template.
    - Support arbitrary fields, nested child objects, and arrays as requested by the prompt.
    - For leaf values, specify a primitive type or token: "id", "name", "email", "number", "boolean", "date", "image", "avatar", or "catchall".
    - Extract or infer the requested record count (integer). If unspecified, default to 10.

    You must output ONLY a valid JSON object matching this exact structure:
    {
      "count": number,
      "template": {
        "fieldKey": "id | name | email | number | boolean | date | image | avatar | catchall or nested object or array"
      }
    }
    Do not include any formatting blocks outside the JSON object.`;

    let contentText = "";

    for (const modelId of CANDIDATE_MODELS) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: modelId,
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: cleanPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
            max_tokens: 1500
          })
        });

        if (response.ok) {
          const resData = await response.json();
          contentText = resData.choices?.[0]?.message?.content || "";
          if (contentText) break;
        }
      } catch {
        // Continue to next model or fallback
      }
    }

    let blueprint;
    if (contentText) {
      try {
        blueprint = JSON.parse(contentText.trim());
      } catch {
        blueprint = null;
      }
    }

    if (!blueprint || !blueprint.template) {
      const countMatch = cleanPrompt.match(/(\d+)/);
      blueprint = {
        count: countMatch ? parseInt(countMatch[1], 10) : 10,
        template: {
          id: "id",
          title: "catchall",
          createdAt: "date"
        }
      };
    }

    const recordCount = isList ? (typeof blueprint.count === 'number' ? blueprint.count : 10) : 1;
    const template = blueprint.template;

    const dynamicGenerators: Record<string, (index: number, key: string) => unknown> = {
      id: (index) => index + 1,
      name: () => faker.person.fullName(),
      email: () => faker.internet.email(),
      number: () => faker.number.int({ min: 2, max: 10 }),
      boolean: () => faker.datatype.boolean(),
      date: () => faker.date.recent().toISOString().split('T')[0],
      avatar: () => ASSET_POOL.avatars[Math.floor(Math.random() * ASSET_POOL.avatars.length)],
      image: () => ASSET_POOL.general[Math.floor(Math.random() * ASSET_POOL.general.length)],
      catchall: (index, key) => faker.helpers.fake(`{{commerce.productName}} (${key})`)
    };

    const generateValue = (valDef: unknown, index: number, keyName: string): unknown => {
      if (typeof valDef === 'object' && valDef !== null && !Array.isArray(valDef)) {
        const nestedObj: Record<string, unknown> = {};
        Object.keys(valDef as Record<string, unknown>).forEach((subKey) => {
          nestedObj[subKey] = generateValue((valDef as Record<string, unknown>)[subKey], index, subKey);
        });
        return nestedObj;
      }

      if (Array.isArray(valDef)) {
        return valDef.map((item) => generateValue(item, index, keyName));
      }

      const typeKey = String(valDef).toLowerCase().trim();
      const executeGenerator = dynamicGenerators[typeKey] || dynamicGenerators.catchall;
      return executeGenerator(index, keyName);
    };

    const generatedData = [];
    for (let i = 0; i < recordCount; i++) {
      const item: Record<string, unknown> = {};

      Object.keys(template).forEach((fieldKey) => {
        item[fieldKey] = generateValue(template[fieldKey], i, fieldKey);
      });

      generatedData.push(item);
    }

    const finalPayload = isList ? generatedData : generatedData[0];
    const endpointId = crypto.randomBytes(4).toString('hex');
    const endpointUrl = `/api/mock/${endpointId}`;
    const expiresAt = new Date(Date.now() + lifespanHours * 60 * 60 * 1000);

    const newEndpoint = await MockEndpoint.create({
      endpointId,
      userId: 'default_dev',
      endpointUrl,
      schemaBlueprint: blueprint,
      dataPayload: isList ? generatedData : [generatedData[0]],
      expiresAt,
    });

    return NextResponse.json({
      success: true,
      endpointId: newEndpoint.endpointId,
      url: newEndpoint.endpointUrl,
      expiresAt: newEndpoint.expiresAt.toISOString(),
      dataPayload: finalPayload
    }, { status: 201 });

  } catch (error: unknown) {
    console.error("Generation Error:", error);
    const readableError = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: readableError }, { status: 500 });
  }
}