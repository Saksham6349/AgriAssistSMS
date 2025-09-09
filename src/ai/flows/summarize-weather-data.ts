'use server';
/**
 * @fileOverview Summarizes weather data for farmers.
 *
 * - summarizeWeatherData - A function that summarizes weather data.
 * - SummarizeWeatherDataInput - The input type for the summarizeWeatherData function.
 * - SummarizeWeatherDataOutput - The return type for the summarizeWeatherData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeWeatherDataInputSchema = z.object({
  location: z.string().describe('The location for the weather forecast.'),
  weatherData: z.string().describe('The raw weather data from the API.'),
});
export type SummarizeWeatherDataInput = z.infer<typeof SummarizeWeatherDataInputSchema>;

const SummarizeWeatherDataOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the weather forecast.'),
});
export type SummarizeWeatherDataOutput = z.infer<typeof SummarizeWeatherDataOutputSchema>;

export async function summarizeWeatherData(input: SummarizeWeatherDataInput): Promise<SummarizeWeatherDataOutput> {
  return summarizeWeatherDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeWeatherDataPrompt',
  input: {schema: SummarizeWeatherDataInputSchema},
  output: {schema: SummarizeWeatherDataOutputSchema},
  prompt: `You are an expert weather summarizer for farmers.  Given the following weather data for {{{location}}}, create a concise summary that will help them make decisions about their crops:\n\n{{{weatherData}}}`,
});

const summarizeWeatherDataFlow = ai.defineFlow(
  {
    name: 'summarizeWeatherDataFlow',
    inputSchema: SummarizeWeatherDataInputSchema,
    outputSchema: SummarizeWeatherDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
