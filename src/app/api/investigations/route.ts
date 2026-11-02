import { investigateTransaction } from '@/src/features/investigations/investigation.service';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const investigationRequestSchema = z.object({
  description: z.string().trim().min(1).max(5000),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = investigationRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Description must be a string containing 1 to 5000 characters' },
      { status: 400 },
    );
  }

  const requestId = crypto.randomUUID();
  try {
    const analysis = await investigateTransaction(parsed.data.description);
    return NextResponse.json({ analysis });
  } catch (error) {
    // Never log the full provider error: it may include request data.
    console.error('Investigation failed', {
      requestId,
      category: error instanceof Error ? error.name : 'UnknownError',
    });
    return NextResponse.json(
      { error: 'Cannot process request at the moment. Try again', requestId },
      { status: 500 },
    );
  }
}
