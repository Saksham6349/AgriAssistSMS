
'use server';
/**
 * @fileOverview A simple chat AI agent for farmers.
 *
 * - chat - A function that handles the chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import { getWeatherSummary, getMarketPrices, getAgricultureNews } from '@/ai/tools/agri-tools';
import { googleAI } from '@genkit-ai/googleai';
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

You have access to several tools to get real-time information:
- Use the 'getWeatherSummary' tool for any questions about weather conditions. This requires a location.
- Use the 'getMarketPrices' tool for questions about crop prices. This requires a crop and a location.
- Use the 'getAgricultureNews' tool for questions about recent farming news. This requires a country code.
- Use the 'trustedSearch' tool for all other general knowledge questions about agriculture, pests, diseases, and farming practices.

When providing advice or information, structure your response clearly for the farmer:
- **Issue:** Briefly state the problem (e.g., "Pest Detected: Fall Armyworm").
- **Recommended Action:** Provide a clear, actionable solution (e.g., "Spray Emamectin Benzoate 5% SG").
- **Source:** You MUST cite the source of your information (e.g., "Source: Weather API", "Source: Market Data", "Source: ICAR Advisory, Sept 2024").

If the tools do not return relevant data or you cannot find reliable information, you MUST respond with: "I couldn’t find reliable information on that." Never invent, guess, or provide information from an unverified source. Your primary goal is accuracy and farmer safety.`;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  const {history, prompt, imageDataUri} = input;

  const promptParts: Content[] = [{text: prompt}];
  if (imageDataUri) {
    promptParts.push({media: {url: imageDataUri}});
  }

  const response = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    tools: [googleAI.trustedSearch, getWeatherSummary, getMarketPrices, getAgricultureNews],
    history: [
      {role: 'system', content: [{text: systemPrompt}]},
      ...(history as MessageData[]),
    ],
    prompt: promptParts,
  });

  return response.text;
}
