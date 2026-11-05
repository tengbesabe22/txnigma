import { investigationResponse } from "@/src/features/investigations/investigation.response";
import { streamInvestigation } from "@/src/features/investigations/investigation.service";
import { NextResponse } from "next/server";
import { z } from "zod";

const investigationRequestSchema = z.object({
  description: z.string().trim().min(1).max(5000),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = investigationRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Description must be a string containing 1 to 5000 characters" },
      { status: 400 },
    );
  }

  const requestId = crypto.randomUUID();
  const cancellation = new AbortController();
  const signal = AbortSignal.any([request.signal, cancellation.signal]);
  try {
    const result = streamInvestigation(
      parsed.data.description,
      signal,
      requestId,
    );
    return investigationResponse(result, cancellation, requestId);
  } catch {
    return NextResponse.json(
      { error: "Cannot start investigation", requestId },
      { status: 500 },
    );
  }
}
