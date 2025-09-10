
'use server';
/**
 * @fileOverview A set of Genkit tools for agricultural data.
 *
 * - getWeatherSummary - A tool to get a weather summary for a location.
 * - getMarketPrices - A tool to get market prices for specified crops.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { summarizeWeatherData } from '@/ai/flows/summarize-weather-data';
import { openWeatherApiKey } from '@/config';

// More realistic mock data with min, modal, and max prices per location.
const mockMarketData = {
  wheat: {
    Patna: { min: 2000, modal: 2150, max: 2250 },
    Indore: { min: 2100, modal: 2200, max: 2300 },
    Mumbai: { min: 2200, modal: 2350, max: 2450 },
  },
  rice: {
    Lucknow: { min: 2800, modal: 2950, max: 3050 },
    Pune: { min: 3000, modal: 3100, max: 3200 },
    Kolkata: { min: 2900, modal: 3000, max: 3100 },
  },
  corn: {
    Patna: { min: 1500, modal: 1650, max: 1720 },
    Indore: { min: 1600, modal: 1700, max: 1800 },
    'Hyderabad': { min: 1650, modal: 1750, max: 1850 },
  },
  tomatoes: {
      'Bangalore': { min: 1800, modal: 2000, max: 2200 },
      'Delhi': { min: 1900, modal: 2100, max: 2300 },
      'Pune': { min: 1700, modal: 1900, max: 2100 },
  },
  onions: {
      'Nasik': { min: 2200, modal: 2500, max: 2800 },
      'Indore': { min: 2100, modal: 2400, max: 2700 },
      'Delhi': { min: 2300, modal: 2600, max: 2900 },
  }
};


async function fetchWeatherDataForTool(location: string): Promise<string> {
    if (!openWeatherApiKey) {
      return "OpenWeather API key is not configured. I cannot fetch live weather data.";
    }
    const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${openWeatherApiKey}`);
    if (!geoResponse.ok) {
      return `Failed to geocode location '${location}'. The API key might be invalid or inactive.`;
    }
    const geoData = await geoResponse.json();
    if (geoData.length === 0) {
      return `Could not find location: ${location}`;
    }
    const { lat, lon } = geoData[0];
  
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`);
    if (!forecastResponse.ok) {
       return "Failed to fetch weather data.";
    }
    const forecastData = await forecastResponse.json();
  
    const simplifiedForecast = forecastData.list.map((item: any) => ({
      date: item.dt_txt,
      temp_c: item.main.temp,
      condition: item.weather[0].description,
      wind_speed_mps: item.wind.speed,
      precipitation_chance: item.pop,
    }));
  
    return JSON.stringify({ location, forecast: simplifiedForecast }, null, 2);
}

export const getWeatherSummary = ai.defineTool(
    {
      name: 'getWeatherSummary',
      description: 'Provides a concise weather forecast summary for a specified location.',
      inputSchema: z.object({
        location: z.string().describe('The city or area for which to get the weather forecast.'),
      }),
      outputSchema: z.string(),
    },
    async (input) => {
      const weatherData = await fetchWeatherDataForTool(input.location);
      // Check if fetchWeatherDataForTool returned an error message
      if (weatherData.startsWith("Failed") || weatherData.startsWith("Could not find") || weatherData.startsWith("OpenWeather")) {
          return weatherData;
      }
      const summary = await summarizeWeatherData({ location: input.location, weatherData });
      return summary.summary;
    }
);

export const getMarketPrices = ai.defineTool(
  {
    name: 'getMarketPrices',
    description: 'Returns the current market price (per quintal) for a specified crop in a given location from Agmarknet.',
    inputSchema: z.object({
      crop: z.string().describe('The name of the crop to get the price for.'),
      location: z.string().describe('The market location (mandi) for the price check.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const cropName = input.crop.toLowerCase() as keyof typeof mockMarketData;
    const locationName = input.location;

    const cropData = mockMarketData[cropName];
    if (!cropData) {
      return `No price data available for ${input.crop}.`;
    }

    // Find the location with a case-insensitive match
    const locationKey = Object.keys(cropData).find(
      (loc) => loc.toLowerCase() === locationName.toLowerCase()
    ) as keyof typeof cropData | undefined;
    
    if (!locationKey) {
        return `No price data available for ${input.crop} in ${input.location}.`;
    }

    const priceInfo = cropData[locationKey];
    return `The price for ${input.crop} in ${locationKey} is: Min: ₹${priceInfo.min}, Modal: ₹${priceInfo.modal}, Max: ₹${priceInfo.max} per quintal.`;
  }
);
