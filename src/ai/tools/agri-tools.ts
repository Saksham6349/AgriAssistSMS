
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

// Define the mock data directly in the tool for simplicity
const mockMarketData: Array<{ cropKey: string; price: number; }> = [
  { cropKey: "wheat", price: 2275 },
  { cropKey: "rice", price: 3100 },
  { cropKey: "corn", price: 2150 },
  { cropKey: "soybeans", price: 4800 },
  { cropKey: "cotton", price: 7200 },
  { cropKey: "sugarcane", price: 350 },
  { cropKey: "potatoes", price: 1800 },
  { cropKey: "onions", price: 2500 },
  { cropKey: "tomatoes", price: 2000 },
  { cropKey: "apples", price: 8500 },
  { cropKey: "bananas", price: 1500 },
  { cropKey: "barley", price: 1900 },
  { cropKey: "chickpeas", price: 5200 },
  { cropKey: "coffee", price: 10500 },
  { cropKey: "grapes", price: 6000 },
  { cropKey: "jute", price: 4500 },
  { cropKey: "lentils", price: 6800 },
  { cropKey: "mangoes", price: 7500 },
  { cropKey: "millet", price: 2800 },
  { cropKey: "tea", price: 12000 },
];

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
      description: 'Returns the current market price (per quintal) for one or more specified crops.',
      inputSchema: z.object({
        crops: z.array(z.string()).describe('An array of crop names to get the prices for.'),
      }),
      outputSchema: z.string(),
    },
    async (input) => {
      const results = input.crops.map(cropName => {
        const cropData = mockMarketData.find(c => c.cropKey.toLowerCase() === cropName.toLowerCase());
        if (cropData) {
          return `${cropName}: ₹${cropData.price} per quintal`;
        }
        return `${cropName}: No price data available`;
      });
      return results.join('; ');
    }
);
