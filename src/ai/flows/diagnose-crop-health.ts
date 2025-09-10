'use server';
/**
 * @fileOverview An AI agent for diagnosing crop health from an image.
 *
 * - diagnoseCropHealth - A function that handles the crop diagnosis process.
 * - DiagnoseCropHealthInput - The input type for the diagnoseCropHealth function.
 * - DiagnoseCropHealthOutput - The return type for the diagnoseCropHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCropHealthInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnoseCropHealthInput = z.infer<typeof DiagnoseCropHealthInputSchema>;

const DiagnoseCropHealthOutputSchema = z.object({
  identification: z.object({
    isPlant: z.boolean().describe('Whether or not the image appears to contain a plant.'),
    commonName: z.string().describe('The common name of the identified plant.'),
    latinName: z.string().describe('The Latin name of the identified plant.'),
  }),
  diagnosis: z.object({
    isHealthy: z.boolean().describe('A boolean indicating if the plant appears to be healthy.'),
    diagnosis: z.string().describe("A detailed diagnosis of the plant's health, including any identified diseases, pests, or deficiencies, along with recommended actions."),
  }),
});
export type DiagnoseCropHealthOutput = z.infer<typeof DiagnoseCropHealthOutputSchema>;

export async function diagnoseCropHealth(input: DiagnoseCropHealthInput): Promise<DiagnoseCropHealthOutput> {
  return diagnoseCropHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseCropHealthPrompt',
  input: {schema: DiagnoseCropHealthInputSchema},
  output: {schema: DiagnoseCropHealthOutputSchema},
  prompt: `You are an expert botanist and plant pathologist specializing in diagnosing plant illnesses from images.

Analyze the provided photo of a plant. First, identify the plant's common and Latin names. If the image does not appear to be a plant, indicate that.

Then, carefully examine the plant for any signs of disease, pests, or nutrient deficiencies. Provide a clear diagnosis. State whether the plant is healthy or not. If it is not healthy, describe the problem in detail and suggest potential treatment or mitigation strategies suitable for a farmer.

Your final output must be in the specified JSON format.

Photo: {{media url=photoDataUri}}`,
});

const diagnoseCropHealthFlow = ai.defineFlow(
  {
    name: 'diagnoseCropHealthFlow',
    inputSchema: DiagnoseCropHealthInputSchema,
    outputSchema: DiagnoseCropHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, { model: 'googleai/gemini-2.5-pro' });
    return output!;
  }
);
