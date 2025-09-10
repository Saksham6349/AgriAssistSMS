'use server';
/**
 * @fileOverview A flow to convert text to speech using the ElevenLabs API.
 *
 * - textToSpeech - A function that converts text into an audio data URI.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { elevenLabsConfig } from '@/config';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI in MP3 format. Format: 'data:audio/mpeg;base64,<encoded_data>'."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text }) => {
    const { apiKey, voiceId } = elevenLabsConfig;

    if (!apiKey || !voiceId) {
      throw new Error('ElevenLabs API key or Voice ID is not configured. Please check your config.ts and .env file.');
    }

    const ELEVENLABS_API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    try {
      const response = await fetch(ELEVENLABS_API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`ElevenLabs API request failed with status ${response.status}: ${errorBody}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      
      return {
        audioDataUri: `data:audio/mpeg;base64,${base64Audio}`,
      };

    } catch (error: any) {
      console.error('Failed to generate audio from ElevenLabs:', error);
      throw new Error(`Failed to generate audio. ElevenLabs error: ${error.message}`);
    }
  }
);
