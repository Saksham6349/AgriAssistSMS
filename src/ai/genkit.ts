import {genkit} from 'genkit';
import {googleAI} from '@gen-ai/googleai';
import { config } from 'dotenv';
import { retriable } from 'genkit/util/retries';

config(); // Load environment variables from .env file

export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GEMINI_API_KEY,
    generate: {
      retry: retriable({
        // Retry on 503 Service Unavailable errors
        on: (err) => err.message.includes('503'),
      }),
    },
  })],
  model: 'googleai/gemini-2.5-flash',
});
