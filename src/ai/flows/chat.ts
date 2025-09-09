'use server';
/**
 * @fileOverview A simple chat AI agent for farmers.
 *
 * - chat - A function that handles the chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {generate} from 'genkit/ai';
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

const systemPrompt = `You are AgriAssist, an AI assistant for farmers. Your goal is to provide helpful, concise, and actionable advice on farming topics. Be friendly and supportive.`;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  const {history, prompt} = input;

  const response = await generate({
    model: 'googleai/gemini-2.5-flash',
    history: [
      {role: 'system', content: [{text: systemPrompt}]},
      ...(history as MessageData[]),
    ],
    prompt: prompt,
  });

  return response.text();
}
