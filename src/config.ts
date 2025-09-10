
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Export the configuration variables
export const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
};

export const geminiApiKey = process.env.GEMINI_API_KEY;
