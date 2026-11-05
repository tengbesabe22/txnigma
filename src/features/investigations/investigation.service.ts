import { streamText, Output } from "ai";
import provider from "@/src/lib/ai/provider";
import investigationPrompt from "./investigation.prompt";
import { investigationOutputSchema } from "./investigation.schema";

export function streamInvestigation(
  description: string,
  abortSignal: AbortSignal,
  requestId: string,
) {
  const startedAt = performance.now();
  return streamText({
    model: provider,
    system: investigationPrompt,
    output: Output.object({ schema: investigationOutputSchema }),
    prompt: description,
    maxOutputTokens: 800,
    timeout: 30_000,
    maxRetries: 0,
    abortSignal,
    onError: ({ error }) =>
      console.error("Investigation failed", {
        requestId,
        category: error instanceof Error ? error.name : "UnknownError",
      }),
    onFinish: ({ totalUsage }) =>
      console.info("Investigation usage", {
        requestId,
        durationMs: Math.round(performance.now() - startedAt),
        inputTokens: totalUsage.inputTokens,
        outputTokens: totalUsage.outputTokens,
      }),
  });
}
