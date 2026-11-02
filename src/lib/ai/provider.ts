import { anthropic } from '@ai-sdk/anthropic';

const configuredModel = process.env.LLM_MODEL;
if (configuredModel !== undefined && !configuredModel.trim()) {
  throw new Error('LLM_MODEL must not be empty');
}

export default anthropic(configuredModel?.trim() ?? 'claude-haiku-5-5');
