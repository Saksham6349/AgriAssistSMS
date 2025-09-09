'use server';
/**
 * @fileOverview Generates a crop advisory alert for a specific location and crop.
 *
 * - generateAdvisoryAlert - A function that generates an advisory alert.
 * - GenerateAdvisoryAlertInput - The input type for the generateAdvisoryAlert function.
 * - GenerateAdvisoryAlertOutput - The return type for the generateAdvisoryAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdvisoryAlertInputSchema = z.object({
  location: z.string().describe('The location for the advisory alert.'),
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
  input: {schema: GenerateAdvisoryAlertInputSchema},
  output: {schema: GenerateAdvisoryAlertOutputSchema},
  prompt: `You are an agricultural expert providing timely advice to farmers.

Generate a concise, actionable advisory alert for a farmer based on the following information. The alert should be based on a plausible, common, and timely issue (e.g., pest infestation, disease outbreak, weather event) relevant to the specified location and crop.

Do not include a greeting or any preamble. Provide only the alert text itself.

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
