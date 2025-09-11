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
  summary: z.string().describe('A concise summary of the weather forecast, focused on actionable advice for a farmer.'),
});
export type SummarizeWeatherDataOutput = z.infer<typeof SummarizeWeatherDataOutputSchema>;

export async function summarizeWeatherData(input: SummarizeWeatherDataInput): Promise<SummarizeWeatherDataOutput> {
  return summarizeWeatherDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeWeatherDataPrompt',
  input: {schema: SummarizeWeatherDataInputSchema},
  output: {schema: SummarizeWeatherDataOutputSchema},
  prompt: `You are an expert farm advisor summarizing weather data for a farmer in {{{location}}}. Your goal is to provide actionable insights, not just a list of numbers.

Analyze the following raw weather data and create a concise, easy-to-understand summary.

**Instructions:**
1.  **Start with the most critical information.** What is the most important thing a farmer needs to know for the next 2-3 days? (e.g., "Heavy rain expected tomorrow," or "A heatwave is approaching.")
2.  **Focus on actionable advice.** Mention precipitation chance (especially if > 50%), significant temperature changes, and high wind speeds.
3.  **Keep it brief.** The entire summary should be a few sentences long.
4.  Do not repeat the raw data. Synthesize it into a coherent advisory.

Weather Data:
\`\`\`json
{{{weatherData}}}
\`\`\``,
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
