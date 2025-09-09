import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-weather-data.ts';
import '@/ai/flows/translate-advisory-alerts.ts';
import '@/ai/flows/diagnose-crop-health.ts';
