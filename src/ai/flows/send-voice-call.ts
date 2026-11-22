'use server';

/**
 * @fileOverview Outbound Voice Call (IVR) dispatch engine via Twilio Programmable Voice.
 * Places an automated phone call to a farmer's mobile phone and speaks the alert
 * in their preferred language using TwiML.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import Twilio from 'twilio';
import { twilioConfig } from '@/config';

const SendVoiceCallInputSchema = z.object({
  to: z.string().describe('The farmer phone number in E.164 format (+91...)'),
  message: z.string().describe('The spoken advisory or weather text.'),
  languageCode: z.string().optional().default('hi-IN'),
});

export type SendVoiceCallInput = z.infer<typeof SendVoiceCallInputSchema>;

const SendVoiceCallOutputSchema = z.object({
  status: z.string(),
  callSid: z.string().optional(),
});

export type SendVoiceCallOutput = z.infer<typeof SendVoiceCallOutputSchema>;

export async function sendVoiceCall(input: SendVoiceCallInput): Promise<SendVoiceCallOutput> {
  let { to, message, languageCode } = input;
  const { accountSid, authToken, messagingServiceSid } = twilioConfig;

  to = to.trim();
  if (!to.startsWith('+')) {
    to = `+${to}`;
  }

  const isTwilioConfigured = Boolean(
    accountSid &&
    authToken &&
    !accountSid.includes('xxxx') &&
    !authToken.includes('your_')
  );

  // 1. Live Twilio Programmable Voice Dispatch
  if (isTwilioConfigured) {
    try {
      const client = Twilio(accountSid, authToken);
      // TwiML text-to-speech call
      const twiml = `
        <Response>
          <Pause length="1"/>
          <Say language="${languageCode || 'hi-IN'}" voice="Polly.Aditi">
            ${message}
          </Say>
          <Pause length="1"/>
          <Say language="en-IN">
            Thank you for using AgriAssist SMS.
          </Say>
        </Response>
      `;

      // Use Twilio phone number or Messaging Service
      const call = await client.calls.create({
        twiml,
        to,
        from: process.env.TWILIO_PHONE_NUMBER || '+15005550006', // Test number if not provided
      });

      console.log(`[Twilio Voice] Outbound call placed. SID: ${call.sid} to ${to}`);
      return {
        status: `Voice Call placed successfully to ${to}`,
        callSid: call.sid,
      };
    } catch (error: any) {
      console.error('Twilio Voice call failed:', error);
      throw new Error(`Failed to place voice call. Twilio error: ${error.message}`);
    }
  }

  // 2. Simulated Demo Voice Dispatch
  const mockCallSid = `CA_DEV_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  console.log(`\n========================================`);
  console.log(`[VOICE CALL SIMULATOR (Demo Mode)] To: ${to}`);
  console.log(`[SPOKEN SCRIPT (${languageCode})]: "${message}"`);
  console.log(`[CALL STATUS]: Ringing & Completed (Mock Call SID: ${mockCallSid})`);
  console.log(`========================================\n`);

  return {
    status: `Voice call simulated to ${to} (IVR Demo Mode)`,
    callSid: mockCallSid,
  };
}
