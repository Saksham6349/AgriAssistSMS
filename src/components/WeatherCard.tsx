
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
import { MapPin, Sun, Loader2, Send } from "lucide-react";
import { summarizeWeatherData } from "@/ai/flows/summarize-weather-data";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { translateAdvisoryAlerts } from "@/ai/flows/translate-advisory-alerts";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type ServerActionResult = {
  summary: string | null;
  error: string | null;
};

// Mock function to simulate fetching weather data. In a real app, this would call a weather API.
async function fetchWeatherData(location: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const today = new Date();
  const getDayOfWeek = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Generate a more realistic forecast
  const forecast = Array.from({ length: 5 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const day = getDayOfWeek(date);
    const baseTemp = 35; // Base temperature for a hot location like Delhi
    const temp_c = baseTemp - i + Math.floor(Math.random() * 4) - 2;
    const conditions = ["Clear skies", "Sunny with scattered clouds", "Hazy sunshine", "Hot and humid"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const precipitation_mm = Math.random() < 0.1 ? Math.floor(Math.random() * 5) : 0; // Low chance of rain

    return { day, temp_c, condition, precipitation_mm };
  });

  return JSON.stringify(
    {
      location: location,
      forecast,
    },
    null,
    2
  );
}

export function WeatherCard() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ServerActionResult | null>(null);
  const [location, setLocation] = useState("Delhi");
  const [language, setLanguage] = useState("English");
  const [smsPreview, setSmsPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetForecast = (e: React.FormEvent<HTMLFormElement>) => {
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
        setResult(null);
        setSmsPreview(null);
        const weatherData = await fetchWeatherData(location);
        const summaryRes = await summarizeWeatherData({ location, weatherData });
        
        if (!summaryRes.summary) {
            throw new Error("Empty summary returned.");
        }

        if (language === "English") {
            setResult({ summary: summaryRes.summary, error: null });
        } else {
            const translationRes = await translateAdvisoryAlerts({
                text: summaryRes.summary,
                language: language,
            });

            if (translationRes.translatedText) {
                setResult({ summary: translationRes.translatedText, error: null });
            } else {
                throw new Error("Translation failed.");
            }
        }

      } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error && error.message.includes("Translation")
          ? "Failed to translate weather summary."
          : "Failed to get weather summary.";
        
        setResult({
          summary: null,
          error: errorMessage,
        });
        toast({
          variant: "destructive",
          title: "API Error",
          description: `${errorMessage} Please try again later.`,
        });
      }
    });
  };

  const handleSendSms = () => {
    if (result?.summary) {
      setSmsPreview(result.summary);
    }
  }

  return (
    <Card className="flex flex-col">
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
      <div className="flex-grow flex flex-col">
        <CardContent className="flex-grow">
          <form onSubmit={handleGetForecast} className="space-y-4">
            <div className="flex w-full flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-grow w-full">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter location..."
                  className="pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="flex w-full sm:w-auto gap-2">
                  <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-full sm:w-[120px]">
                          <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Swahili">Swahili</SelectItem>
                          <SelectItem value="Mandarin">Mandarin</SelectItem>
                      </SelectContent>
                  </Select>
                  <Button type="submit" disabled={isPending} className="flex-grow">
                      {isPending ? <Loader2 className="animate-spin" /> : 'Get Forecast'}
                  </Button>
              </div>
            </div>
          </form>
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
                <h4 className="font-semibold mb-2 text-foreground">Weather Summary ({language}):</h4>
                <p>{result.summary}</p>
              </div>
            )}
            {smsPreview && (
                <Alert className="mt-4">
                    <Send className="w-4 h-4" />
                    <AlertTitle>SMS Sent!</AlertTitle>
                    <AlertDescription className="text-xs whitespace-pre-wrap break-words">
                        {smsPreview}
                    </AlertDescription>
                </Alert>
            )}
            {!result && !isPending && !smsPreview && (
                <div className="text-center text-muted-foreground py-4">
                    <p>Enter a location to see the weather summary.</p>
                </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSendSms} disabled={!result?.summary || isPending} className="w-full" variant="secondary">
                <Send /> Send as SMS
            </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
