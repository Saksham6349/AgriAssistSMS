
'use server';
/**
 * @fileOverview An AI agent for verifying a government ID from an image.
 *
 * - verifyId - A function that handles the ID verification process.
 * - VerifyIdInput - The input type for the verifyId function.
 * - VerifyIdOutput - The return type for the verifyId function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyIdInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo or PDF of a government-issued ID, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyIdInput = z.infer<typeof VerifyIdInputSchema>;

const VerifyIdOutputSchema = z.object({
  isIdCard: z.boolean().describe('A boolean indicating if the image appears to be a valid government-issued ID card.'),
  reason: z.string().describe('A brief reason for the verification decision. E.g., "Verified as a valid ID card." or "The image does not appear to be a government ID."'),
  extractedName: z.string().optional().describe('The name of the person extracted from the ID card, if visible.'),
});
export type VerifyIdOutput = z.infer<typeof VerifyIdOutputSchema>;

export async function verifyId(input: VerifyIdInput): Promise<VerifyIdOutput> {
  return verifyIdFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyIdPrompt',
  input: {schema: VerifyIdInputSchema},
  output: {schema: VerifyIdOutputSchema},
  prompt: `You are an AI assistant designed to verify specific government-issued identification documents from India.

Analyze the provided document, which could be an image or a PDF. Determine if it is a legitimate Aadhar card, PAN card, ration card, or gas connection document.

- If it is one of the accepted valid ID types and is legible, set 'isIdCard' to true and provide a positive reason (e.g., "Verified as a valid Aadhar card."). Attempt to extract the person's full name from the document.
- If it is not one of the accepted ID types, or if it is illegible, set 'isIdCard' to false and explain why (e.g., "The document is not an Aadhar, PAN, Ration, or gas connection card," "Appears to be a credit card," "Document is too blurry to read.").

Your final output must be in the specified JSON format.

Document: {{media url=photoDataUri}}`,
});

const verifyIdFlow = ai.defineFlow(
  {
    name: 'verifyIdFlow',
    inputSchema: VerifyIdInputSchema,
    outputSchema: VerifyIdOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    
