
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-weather-data.ts';
import '@/ai/flows/translate-advisory-alerts.ts';
import '@/ai/flows/diagnose-crop-health.ts';
import '@/ai/flows/send-sms.ts';
import '@/ai/flows/chat.ts';
import '@/ai/flows/generate-advisory-alert.ts';
import '@/ai/flows/verify-id.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/tools/agri-tools.ts';
import '@/ai/flows/suggest-crops.ts';

