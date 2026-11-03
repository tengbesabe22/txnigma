import { generateText, Output } from 'ai';
import provider from '@/src/lib/ai/provider';
import investigationPrompt from './investigation.prompt';
import { InvestigationOutput, investigationOutputSchema } from './investigation.schema';

export async function investigateTransaction(
  description: string,
): Promise<InvestigationOutput> {
  const startedAt = performance.now();
  const { output, usage } = await generateText({
    model: provider,
    system: investigationPrompt,
    output: Output.object({
      schema: investigationOutputSchema,
    }),
    prompt: description,
    maxOutputTokens: 800,
    timeout: 30_000,
    maxRetries: 0,
  });

  console.info('Investigation usage', {
    durationMs: Math.round(performance.now() - startedAt),
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
  });

  return output;
}
