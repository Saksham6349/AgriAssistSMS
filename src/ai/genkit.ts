import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { config } from 'dotenv';
import { geminiApiKey } from '@/config';

config(); // Load environment variables from .env file

const apiKey = geminiApiKey || process.env.GEMINI_API_KEY || '';

if (!apiKey && process.env.NODE_ENV !== 'production') {
  console.warn('Warning: GEMINI_API_KEY environment variable is not set. AI features will require this key at runtime.');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey || 'dummy-key-placeholder',
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
