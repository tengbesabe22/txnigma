import { generateText } from 'ai';
import provider from '@/src/lib/ai/provider';
import investigationPrompt from './investigation.prompt';

export async function investigateTransaction(
  description: string,
): Promise<string> {
  const startedAt = performance.now();
  const { text, usage } = await generateText({
    model: provider,
    system: investigationPrompt,
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

  return text;
}
