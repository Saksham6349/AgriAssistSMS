'use server';
/**
 * @fileOverview Generates a crop advisory alert for a specific location and crop.
 *
 * - generateAdvisoryAlert - A function that generates an advisory alert.
 * - GenerateAdvisoryAlertInput - The input type for the generateAdvisoryAlert function.
 * - GenerateAdvisoryAlertOutput - The return type for the generateAdvisoryAlert function.
 */

import {ai} from '@/ai/genkit';
import { getAgricultureNews } from '@/ai/tools/agri-tools';
import {z} from 'genkit';

const GenerateAdvisoryAlertInputSchema = z.object({
  location: z.string().describe('The location for the advisory alert. This should include enough detail to infer the country.'),
  crop: z.string().describe('The primary crop for the advisory alert.'),
});
export type GenerateAdvisoryAlertInput = z.infer<typeof GenerateAdvisoryAlertInputSchema>;

const GenerateAdvisoryAlertOutputSchema = z.object({
  alert: z.string().describe('A concise and actionable advisory alert for a farmer.'),
});
export type GenerateAdvisoryAlertOutput = z.infer<typeof GenerateAdvisoryAlertOutputSchema>;

export async function generateAdvisoryAlert(input: GenerateAdvisoryAlertInput): Promise<GenerateAdvisoryAlertOutput> {
  return generateAdvisoryAlertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdvisoryAlertPrompt',
  tools: [getAgricultureNews],
  input: {schema: GenerateAdvisoryAlertInputSchema},
  output: {schema: GenerateAdvisoryAlertOutputSchema},
  prompt: `You are an agricultural expert providing timely advice to farmers. Your primary goal is to create a highly relevant and actionable alert.

1.  **Use News Tool:** First, use the 'getAgricultureNews' tool to check for recent news relevant to the specified location. Assume the country is India ('in') if not otherwise specified. The news will provide context for current events.
2.  **Generate Alert:** Based on the news (if available) or general agricultural knowledge, generate a concise, specific, and actionable advisory alert. The alert MUST be based on a single, plausible, common, and timely issue (e.g., a specific pest like 'Fall Armyworm', a disease like 'Powdery Mildew', or a weather event like 'impending heatwave').

- **BE SPECIFIC:** Do not give generic advice like "monitor for pests". Name the specific pest or disease.
- **BE ACTIONABLE:** Provide a clear, immediate action the farmer can take.
- **BE RELEVANT:** The issue must be relevant to the specified location and crop.

Do not include a greeting, preamble, or any text other than the alert itself. If no relevant news is found, generate the best possible alert based on the crop and location.

Location: {{{location}}}
Primary Crop: {{{crop}}}`,
});

const generateAdvisoryAlertFlow = ai.defineFlow(
  {
    name: 'generateAdvisoryAlertFlow',
    inputSchema: GenerateAdvisoryAlertInputSchema,
    outputSchema: GenerateAdvisoryAlertOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
