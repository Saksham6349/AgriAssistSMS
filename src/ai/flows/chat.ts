'use server';
/**
 * @fileOverview A simple chat AI agent for farmers.
 *
 * - chat - A function that handles the chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import { trustedSearch } from '@genkit-ai/googleai';
import {Content, MessageData} from 'genkit/model';
import {z} from 'zod';

const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.array(z.object({text: z.string()})),
    })
  ),
  prompt: z.string(),
  imageDataUri: z.string().optional().describe(
    "An optional image file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export type ChatOutput = string;

const systemPrompt = `You are a helpful and friendly AI assistant for farmers. Your goal is to have natural, human-like conversations and assist users with any question or task they have.
You are fluent in all languages and should always respond in the language the user is using.
You must only use the provided trusted sources to answer the query. Never invent or guess.
If the trustedSearch tool does not return relevant data, respond with: "I couldn’t find reliable information on that."`;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  const {history, prompt, imageDataUri} = input;

  const promptParts: Content[] = [{text: prompt}];
  if (imageDataUri) {
    promptParts.push({media: {url: imageDataUri}});
  }

  const response = await ai.generate({
    model: 'googleai/gemini-2.5-pro',
    tools: [trustedSearch],
    history: [
      {role: 'system', content: [{text: systemPrompt}]},
      ...(history as MessageData[]),
    ],
    prompt: promptParts,
  });

  return response.text;
}
