"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Sun, Loader2 } from "lucide-react";
import { summarizeWeatherData } from "@/ai/flows/summarize-weather-data";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

type ServerActionResult = {
  summary: string | null;
  error: string | null;
};

// Mock function to simulate fetching weather data. In a real app, this would call a weather API.
async function fetchWeatherData(location: string) {
  console.log(`Fetching weather for ${location}...`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return JSON.stringify(
    {
      location: location,
      forecast: [
        { day: "Monday", temp_c: 25, condition: "Sunny", precipitation_mm: 0 },
        { day: "Tuesday", temp_c: 23, condition: "Partly cloudy", precipitation_mm: 2 },
        { day: "Wednesday", temp_c: 22, condition: "Light rain", precipitation_mm: 5 },
        { day: "Thursday", temp_c: 24, condition: "Sunny intervals", precipitation_mm: 1 },
        { day: "Friday", temp_c: 26, condition: "Sunny", precipitation_mm: 0 },
      ],
    },
    null,
    2
  );
}

export function WeatherCard() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ServerActionResult | null>(null);
  const [location, setLocation] = useState("Nairobi");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!location) {
        toast({
            variant: "destructive",
            title: "Missing Location",
            description: "Please enter a location to get the weather forecast.",
        });
        return;
    }

    startTransition(async () => {
      try {
        const weatherData = await fetchWeatherData(location);
        const res = await summarizeWeatherData({ location, weatherData });
        if (res.summary) {
          setResult({ summary: res.summary, error: null });
        } else {
            throw new Error("Empty summary returned.");
        }
      } catch (error) {
        console.error(error);
        setResult({
          summary: null,
          error: "Failed to get weather summary.",
        });
        toast({
          variant: "destructive",
          title: "API Error",
          description: "Could not fetch the weather summary. Please try again later.",
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Sun className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>Weather Forecast</CardTitle>
            <CardDescription>
              Get AI-powered weather summaries for your location.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex w-full items-center space-x-2">
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter location..."
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isPending}>
              Get Forecast
            </Button>
          </div>
          <div className="mt-4 pt-4 border-t">
            {isPending && (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            )}
            {result?.summary && !isPending && (
              <div className="prose prose-sm max-w-none text-foreground">
                <p>{result.summary}</p>
              </div>
            )}
            {!result && !isPending && (
                <div className="text-center text-muted-foreground py-4">
                    <p>Enter a location to see the weather summary.</p>
                </div>
            )}
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
