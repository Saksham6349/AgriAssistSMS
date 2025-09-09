'use server';
/**
 * @fileOverview A simple chat AI agent for farmers.
 *
 * - chat - A function that handles the chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {MessageData} from 'genkit/model';
import {z} from 'zod';

const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.array(z.object({text: z.string()})),
    })
  ),
  prompt: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export type ChatOutput = string;

const systemPrompt = `You are a helpful and friendly AI assistant. Your goal is to have natural, human-like conversations and assist users with any question or task they have. You are fluent in all languages and should always respond in the language the user is using.`;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  const {history, prompt} = input;

  const response = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    history: [
      {role: 'system', content: [{text: systemPrompt}]},
      ...(history as MessageData[]),
    ],
    prompt: prompt,
  });

  return response.text;
}
