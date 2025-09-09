
'use server';
/**
 * @fileOverview A flow to simulate sending an SMS.
 *
 * - sendSms - A function that simulates sending an SMS message.
 * - SendSmsInput - The input type for the sendSms function.
 * - SendSmsOutput - The return type for the sendSms function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SendSmsInputSchema = z.object({
  to: z.string().describe('The phone number to send the SMS to.'),
  message: z.string().describe('The content of the SMS message.'),
});
export type SendSmsInput = z.infer<typeof SendSmsInputSchema>;

const SendSmsOutputSchema = z.object({
  status: z.string().describe('The status of the SMS sending attempt.'),
});
export type SendSmsOutput = z.infer<typeof SendSmsOutputSchema>;

export async function sendSms(input: SendSmsInput): Promise<SendSmsOutput> {
  return sendSmsFlow(input);
}

const sendSmsFlow = ai.defineFlow(
  {
    name: 'sendSmsFlow',
    inputSchema: SendSmsInputSchema,
    outputSchema: SendSmsOutputSchema,
  },
  async (input) => {
    console.log(`Simulating sending SMS to: ${input.to}`);
    console.log(`Message: ${input.message}`);

    // In a real application, you would integrate with an SMS gateway like Twilio here.
    // For this simulation, we'll just return a success message.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    return {
      status: `SMS successfully simulated for ${input.to}`,
    };
  }
);
