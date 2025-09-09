
'use server';
/**
 * @fileOverview A flow to send an SMS using Twilio.
 *
 * - sendSms - A function that sends an SMS message.
 * - SendSmsInput - The input type for the sendSms function.
 * - SendSmsOutput - The return type for the sendSms function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import Twilio from 'twilio';
import { config } from 'dotenv';

config(); // Load environment variables

const SendSmsInputSchema = z.object({
  to: z.string().describe('The phone number to send the SMS to.'),
  message: z.string().describe('The content of the SMS message.'),
});
export type SendSmsInput = z.infer<typeof SendSmsInputSchema>;

const SendSmsOutputSchema = z.object({
  status: z.string().describe('The status of the SMS sending attempt.'),
  messageSid: z.string().optional().describe('The SID of the message from Twilio.'),
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
    const { to, message } = input;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

    if (!accountSid || !authToken || !messagingServiceSid) {
        throw new Error('Twilio credentials are not configured correctly in the environment. Please check your .env file.');
    }

    const client = Twilio(accountSid, authToken);

    try {
        const twilioMessage = await client.messages.create({
            body: message,
            messagingServiceSid: messagingServiceSid,
            to: to,
        });

        console.log(`SMS sent successfully. SID: ${twilioMessage.sid}`);
        return {
            status: `SMS sent successfully to ${to}`,
            messageSid: twilioMessage.sid,
        };
    } catch (error: any) {
        console.error('Failed to send SMS via Twilio:', error);
        throw new Error(`Failed to send SMS. Twilio error: ${error.message}`);
    }
  }
);
