
'use server';

import { weatherConfig } from '@/config';

export async function fetchWeatherData(location: string): Promise<any> {
    const { apiKey } = weatherConfig;

    if (!apiKey) {
        return { error: 'OpenWeather API key is not configured.' };
    }

    const GEO_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=${apiKey}&units=metric`;

    try {
        const geoResponse = await fetch(GEO_URL);
        const geoData = await geoResponse.json();

        if (!geoData || geoData.length === 0) {
            return { error: `Location "${location}" not found.` };
        }

        const { lat, lon } = geoData[0];
        const weatherResponse = await fetch(WEATHER_URL.replace('{lat}', lat).replace('{lon}', lon));
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== "200") {
            return { error: weatherData.message || 'Failed to fetch weather data.' };
        }

        // Process data to be simpler for the AI to summarize
        const processedForecast = weatherData.list.slice(0, 16).map((item: any) => ({
            dt_txt: item.dt_txt,
            temp: `${item.main.temp}°C`,
            feels_like: `${item.main.feels_like}°C`,
            humidity: `${item.main.humidity}%`,
            weather: item.weather[0].description,
            wind_speed: `${item.wind.speed} m/s`,
        }));

        return {
            city: weatherData.city.name,
            country: weatherData.city.country,
            forecast: processedForecast,
        };

    } catch (error: any) {
        console.error("Failed to fetch weather data from OpenWeather:", error);
        return { error: `An unexpected error occurred: ${error.message}` };
    }
}
