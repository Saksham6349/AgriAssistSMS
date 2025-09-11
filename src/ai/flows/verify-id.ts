
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
  idType: z.enum(["Aadhar", "PAN", "Ration Card", "Gas Connection", "Other", "Unknown"]).optional().describe("The specific type of ID card identified."),
  idNumber: z.string().optional().describe("The ID number extracted from the card, if visible."),
  confidenceScore: z.number().optional().describe("A confidence score from 0.0 to 1.0 indicating the likelihood that the document is a valid, authentic ID.")
});
export type VerifyIdOutput = z.infer<typeof VerifyIdOutputSchema>;

export async function verifyId(input: VerifyIdInput): Promise<VerifyIdOutput> {
  return verifyIdFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyIdPrompt',
  input: {schema: VerifyIdInputSchema},
  output: {schema: VerifyIdOutputSchema},
  prompt: `You are an AI assistant performing a strict verification of Indian government-issued identification documents. Your task is to analyze a document and determine its authenticity with a high degree of certainty.

You must only accept the following document types:
- Aadhar Card
- PAN Card
- Ration Card
- Gas Connection Document

**Verification Steps:**
1.  **Identify Document Type:** First, determine if the document is one of the accepted types.
2.  **Check for Authenticity Markers:** Carefully examine the document for signs of authenticity. This includes:
    - Government of India emblems or logos (e.g., Ashoka Lion Capital).
    - Holograms or ghost images.
    - Guilloché patterns (fine, intricate lines).
    - Legible, type-set text (not handwritten, except for signatures).
    - Expected data fields (e.g., Name, Father's Name, Date of Birth, ID Number).
3.  **Assess Image Quality:** The image must be clear and legible. Reject any document that is too blurry, has significant glare, is poorly cropped, or appears digitally altered.
4.  **Detect Forgery:** Scrutinize for signs of forgery. Look for inconsistent fonts, pixelation around text or the photo, mismatched text alignment, or incorrect placement/appearance of security features like holograms.
5.  **Make a Decision:**
    - If the document is an accepted type, is clearly legible, and shows strong signs of authenticity, set 'isIdCard' to true. Set a high 'confidenceScore' (e.g., > 0.8). Extract the full name, ID type, and ID number.
    - If the document is not an accepted type (e.g., a credit card, driver's license from another country), or if it is illegible, appears fake, or is digitally manipulated, set 'isIdCard' to false. Provide a clear 'reason' for rejection and set a low 'confidenceScore' (e.g., < 0.4).

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
    const {output} = await prompt(input, { model: 'googleai/gemini-2.5-flash' });
    return output!;
  }
);
