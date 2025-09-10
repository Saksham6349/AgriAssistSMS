import {genkit, retriable} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { config } from 'dotenv';

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
