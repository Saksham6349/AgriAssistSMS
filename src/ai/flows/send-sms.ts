
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
import { twilioConfig } from '@/config';

const SendSmsInputSchema = z.object({
  to: z.string().describe('The phone number to send the SMS to, in E.164 format (e.g., +15551234567).'),
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
    const { accountSid, authToken, messagingServiceSid } = twilioConfig;

    if (!accountSid || !authToken || !messagingServiceSid) {
        throw new Error('Twilio credentials are not configured correctly. Please check your config.ts and .env file.');
    }

    // Validate E.164 format
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(to)) {
      throw new Error(`Invalid phone number format: ${to}. Number must be in E.164 format (e.g., +15551234567).`);
    }

    // Initialize Twilio client inside the flow to ensure credentials are loaded
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
