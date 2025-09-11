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
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.",
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
    diagnosis: z.string().describe("A detailed diagnosis of the plant's health, including any identified diseases, pests, or deficiencies, along with recommended actions. If image quality is poor, state that first."),
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
  prompt: `You are an expert botanist and plant pathologist specializing in diagnosing plant illnesses from images. Your primary goal is accuracy.

1.  **Assess Image Quality:** First, evaluate the provided photo. If the image is blurry, dark, or too far away to make a confident assessment, state this in your diagnosis. For example: "Image quality is poor, which limits diagnostic accuracy."
2.  **Identify the Plant:** If the image is clear enough, identify the plant's common and Latin names. If the image does not appear to contain a plant, set 'isPlant' to false and explain why.
3.  **Perform Diagnosis:** Carefully examine the plant for any signs of disease, pests, or nutrient deficiencies.
    - If the plant is healthy, state this clearly.
    - If you identify an issue, provide a detailed diagnosis. Describe the problem and suggest potential treatment or mitigation strategies suitable for a farmer.
    - If you are not confident in a diagnosis due to image quality or ambiguity, do not guess. Instead, state what you can observe and suggest taking a clearer picture.

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
