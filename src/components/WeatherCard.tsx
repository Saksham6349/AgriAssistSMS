
"use client";

import { useState, useTransition, useEffect, FormEvent } from "react";
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
import { MapPin, Sun, Loader2, Send, PlayCircle, StopCircle, AlertCircle } from "lucide-react";
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
import { sendSms } from "@/ai/flows/send-sms";
import { useAppContext } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { openWeatherApiKey } from "@/config";

type ServerActionResult = {
  summary: string | null;
  error: string | null;
};

async function fetchWeatherData(location: string): Promise<string> {
  if (!openWeatherApiKey) {
    throw new Error("OpenWeather API key is not configured. Please add OPENWEATHER_API_KEY to your .env file.");
  }
  
  // 1. Geocode location to get coordinates
  const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${openWeatherApiKey}`);
  if (!geoResponse.ok) {
    throw new Error("Failed to geocode location.");
  }
  const geoData = await geoResponse.json();
  if (geoData.length === 0) {
    throw new Error(`Could not find location: ${location}`);
  }
  const { lat, lon } = geoData[0];

  // 2. Fetch 5-day forecast data
  const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`);
  if (!forecastResponse.ok) {
    throw new Error("Failed to fetch weather data.");
  }
  const forecastData = await forecastResponse.json();

  // 3. Simplify the data to pass to the AI
  const simplifiedForecast = forecastData.list.map((item: any) => ({
    date: item.dt_txt,
    temp_c: item.main.temp,
    condition: item.weather[0].description,
    wind_speed_mps: item.wind.speed,
    precipitation_chance: item.pop,
  }));

  return JSON.stringify({ location, forecast: simplifiedForecast }, null, 2);
}


export function WeatherCard() {
  const { registeredFarmer, addSmsToHistory } = useAppContext();
  const { t } = useTranslation();
  const [isForecastPending, startForecastTransition] = useTransition();
  const [isSmsPending, startSmsTransition] = useTransition();
  const [isAudioPending, startAudioTransition] = useTransition();
  const [result, setResult] = useState<ServerActionResult | null>(null);
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("English");
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const getForecastForLocation = (loc: string, lang: string) => {
    if (!loc) {
        toast({
            variant: "destructive",
            title: "Missing Location",
            description: "Please enter a location to get the weather forecast.",
        });
        return;
    }

    if (!openWeatherApiKey) {
        setResult({ summary: null, error: "OpenWeather API key is not configured. Please add OPENWEATHER_API_KEY to your .env file to enable this feature."});
        return;
    }

    startForecastTransition(async () => {
      try {
        setResult(null);
        setSmsStatus(null);
        if (audio) {
            audio.pause();
            setAudio(null);
        }
        const weatherData = await fetchWeatherData(loc);
        const summaryRes = await summarizeWeatherData({ location: loc, weatherData });
        
        if (!summaryRes.summary) throw new Error("Empty summary returned.");

        if (lang === "English") {
            setResult({ summary: summaryRes.summary, error: null });
        } else {
            const translationRes = await translateAdvisoryAlerts({
                text: summaryRes.summary,
                language: lang,
            });

            if (translationRes.translatedText) {
                setResult({ summary: translationRes.translatedText, error: null });
            } else {
                throw new Error("Translation failed.");
            }
        }

      } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Failed to get weather summary.";
        
        setResult({ summary: null, error: errorMessage });
        toast({
          variant: "destructive",
          title: "API Error",
          description: `${errorMessage}`,
        });
      }
    });
  };
  
  useEffect(() => {
    if (registeredFarmer) {
      setLocation(registeredFarmer.location);
      setLanguage(registeredFarmer.language);
      if (registeredFarmer.location) {
        getForecastForLocation(registeredFarmer.location, registeredFarmer.language);
      }
    } else {
      setLocation("");
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registeredFarmer]);
  
  const handleGetForecast = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getForecastForLocation(location, language);
  };

  const handleSendSms = () => {
    if (!registeredFarmer) {
      toast({
        variant: "destructive",
        title: "No Farmer Registered",
        description: "Please register a farmer before sending an SMS.",
      });
      return;
    }
    if (result?.summary) {
        startSmsTransition(async () => {
            try {
                const message = `Weather for ${location}: ${result.summary!}`.substring(0, 115);
                const res = await sendSms({ to: registeredFarmer.phone, message: message });
                setSmsStatus(res.status);
                addSmsToHistory({
                  to: registeredFarmer.phone,
                  message: message,
                  type: 'Weather',
                });
                 toast({
                    title: "SMS Sent!",
                    description: `Message sent to ${registeredFarmer.name} at ${registeredFarmer.phone}`,
                });
            } catch (error) {
                console.error("SMS sending failed", error);
                setSmsStatus("Failed to send SMS.");
                toast({
                    variant: "destructive",
                    title: "SMS Error",
                    description: "Could not send the SMS. Please try again.",
                });
            }
        });
    }
  };

  const handlePlayAudio = () => {
    if (audio) {
        audio.pause();
        setAudio(null);
        return;
    }
    if (!result?.summary) return;

    startAudioTransition(async () => {
      try {
        const res = await textToSpeech({ text: result.summary! });
        const newAudio = new Audio(res.audioDataUri);
        setAudio(newAudio);
        newAudio.play();
        newAudio.addEventListener('ended', () => setAudio(null));
      } catch (error) {
        console.error("Audio generation failed", error);
        toast({
          variant: "destructive",
          title: "Audio Error",
          description: "Could not generate audio. Please check your Gemini API key and try again.",
        });
      }
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Sun className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>{t('weather.title')}</CardTitle>
            <CardDescription>
              {t('weather.description')}
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
                  placeholder={t('weather.locationPlaceholder')}
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
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Bengali">Bengali</SelectItem>
                          <SelectItem value="Telugu">Telugu</SelectItem>
                          <SelectItem value="Marathi">Marathi</SelectItem>
                          <SelectItem value="Tamil">Tamil</SelectItem>
                          <SelectItem value="Urdu">Urdu</SelectItem>
                          <SelectItem value="Gujarati">Gujarati</SelectItem>
                          <SelectItem value="Kannada">Kannada</SelectItem>
                          <SelectItem value="Punjabi">Punjabi</SelectItem>
                      </SelectContent>
                  </Select>
                  <Button type="submit" disabled={isForecastPending} className="flex-grow">
                      {isForecastPending ? <Loader2 className="animate-spin" /> : t('weather.getForecast')}
                  </Button>
              </div>
            </div>
          </form>
          <div className="mt-4 pt-4 border-t">
            {isForecastPending && (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            )}
             {result?.error && !isForecastPending && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuration Error</AlertTitle>
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            )}
            {result?.summary && !isForecastPending && (
              <div className="prose prose-sm max-w-none text-foreground">
                <div className="flex justify-between items-start">
                    <h4 className="font-semibold mb-2 text-foreground">{t('weather.summary')} ({language}):</h4>
                    <Button variant="ghost" size="icon" onClick={handlePlayAudio} disabled={isAudioPending}>
                        {isAudioPending ? <Loader2 className="animate-spin" /> : (audio ? <StopCircle /> : <PlayCircle />)}
                    </Button>
                </div>
                <p>{result.summary}</p>
              </div>
            )}
            {smsStatus && !isSmsPending && (
                <Alert className="mt-4">
                    <Send className="w-4 h-4" />
                    <AlertTitle>SMS Status</AlertTitle>
                    <AlertDescription className="text-xs whitespace-pre-wrap break-words">
                        {smsStatus} for farmer {registeredFarmer?.name}.
                    </AlertDescription>
                </Alert>
            )}
            {!result && !isForecastPending && !smsStatus && (
                <div className="text-center text-muted-foreground py-4">
                    <p>{t('weather.enterLocationPrompt')}</p>
                </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSendSms} disabled={!result?.summary || isForecastPending || isSmsPending} className="w-full" variant="secondary" size="sm">
                {isSmsPending ? <><Loader2 className="animate-spin" /> Sending...</> : <><Send /> {t('weather.sendSms')}</>}
            </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
