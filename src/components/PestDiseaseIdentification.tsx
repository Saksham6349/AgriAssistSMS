
"use client";

import { useState, useRef, useTransition, ChangeEvent } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Stethoscope, Upload, X, Loader2, AlertCircle, Send, PlayCircle, StopCircle } from "lucide-react";
import { diagnoseCropHealth, DiagnoseCropHealthOutput } from "@/ai/flows/diagnose-crop-health";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { sendSms } from "@/ai/flows/send-sms";
import { useTranslation } from "@/hooks/useTranslation";
import { textToSpeech } from "@/ai/flows/text-to-speech";

export function PestDiseaseIdentification() {
  const { registeredFarmer, addSmsToHistory } = useAppContext();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [isSmsPending, startSmsTransition] = useTransition();
  const [isAudioPending, startAudioTransition] = useTransition();
  const [result, setResult] = useState<DiagnoseCropHealthOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: "Image too large",
          description: "Please upload an image smaller than 4MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(URL.createObjectURL(file));
        setImageData(dataUri);
        setResult(null);
        setError(null);
        setSmsStatus(null);
        if (audio) {
            audio.pause();
            setAudio(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageData(null);
    setResult(null);
    setError(null);
    setSmsStatus(null);
    if (audio) {
        audio.pause();
        setAudio(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageData) {
      toast({
        variant: "destructive",
        title: "No Image Selected",
        description: "Please upload an image of a plant to diagnose.",
      });
      return;
    }

    setResult(null);
    setError(null);
    setSmsStatus(null);
    if (audio) {
        audio.pause();
        setAudio(null);
    }
    startTransition(async () => {
      try {
        const diagnosisResult = await diagnoseCropHealth({ photoDataUri: imageData });
        setResult(diagnosisResult);
      } catch (err) {
        console.error("Diagnosis failed:", err);
        setError("Failed to get a diagnosis. The model may be unable to analyze this image. Please try another one.");
        toast({
          variant: "destructive",
          title: "Analysis Error",
          description: "Could not get a diagnosis for the provided image.",
        });
      }
    });
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
    if (result) {
      startSmsTransition(async () => {
        try {
          const healthStatus = result.diagnosis.isHealthy ? 'Healthy' : 'Needs Attention';
          const message = `Diagnosis for ${result.identification.commonName}: ${healthStatus}. ${result.diagnosis.diagnosis}`.substring(0, 115);
          const res = await sendSms({ to: registeredFarmer.phone, message });
          setSmsStatus(res.status);
          addSmsToHistory({
            to: registeredFarmer.phone,
            message: message,
            type: 'Advisory',
          });
          toast({
              title: "SMS Sent!",
              description: `Diagnosis sent to ${registeredFarmer.name} at ${registeredFarmer.phone}`,
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
    if (!result?.diagnosis.diagnosis) return;

    startAudioTransition(async () => {
      try {
        const res = await textToSpeech({ text: result.diagnosis.diagnosis });
        const newAudio = new Audio(res.audioDataUri);
        setAudio(newAudio);
        newAudio.play();
        newAudio.addEventListener('ended', () => setAudio(null));
      } catch (error) {
        console.error("Audio generation failed", error);
        toast({
          variant: "destructive",
          title: "Audio Error",
          description: "Could not generate audio. Please check your ElevenLabs API key and try again.",
        });
      }
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Stethoscope className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>{t('diagnosis.title')}</CardTitle>
            <CardDescription>
              {t('diagnosis.description')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div
          className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center cursor-pointer hover:bg-accent hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />
          {imagePreview ? (
            <div className="relative group">
              <Image
                src={imagePreview}
                alt="Plant preview"
                width={400}
                height={300}
                className="rounded-md mx-auto max-h-64 w-auto object-contain"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="w-8 h-8" />
              <p className="font-semibold">{t('diagnosis.uploadPrompt')}</p>
              <p className="text-xs">{t('diagnosis.uploadHint')}</p>
            </div>
          )}
        </div>

        <Button onClick={handleSubmit} disabled={!imageData || isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="animate-spin" /> {t('diagnosis.diagnosing')}
            </>
          ) : (
            t('diagnosis.diagnose')
          )}
        </Button>
        
        {isPending && (
          <div className="space-y-4 pt-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}

        {error && !isPending && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result && !isPending && (
          <div className="prose prose-sm max-w-none text-foreground pt-4">
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-foreground mb-2">{t('diagnosis.results')}</h4>
                <Button variant="ghost" size="icon" onClick={handlePlayAudio} disabled={isAudioPending}>
                    {isAudioPending ? <Loader2 className="animate-spin" /> : (audio ? <StopCircle /> : <PlayCircle />)}
                </Button>
            </div>
            <ul>
              <li><strong>{t('diagnosis.identification')}</strong> {result.identification.commonName} (<em>{result.identification.latinName}</em>)</li>
              <li>
                <strong>{t('diagnosis.healthStatus')}</strong> 
                <span className={`font-semibold ml-1 ${result.diagnosis.isHealthy ? 'text-green-600' : 'text-destructive'}`}>
                  {result.diagnosis.isHealthy ? t('diagnosis.healthy') : t('diagnosis.needsAttention')}
                </span>
              </li>
              <li><strong>{t('diagnosis.analysis')}</strong> {result.diagnosis.diagnosis}</li>
            </ul>
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

      </CardContent>
      <CardFooter>
        <Button onClick={handleSendSms} disabled={!result || isPending || isSmsPending} className="w-full" variant="secondary" size="sm">
            {isSmsPending ? <><Loader2 className="animate-spin" /> {t('diagnosis.sending')}</> : <><Send /> {t('diagnosis.sendSms')}</>}
        </Button>
      </CardFooter>
    </Card>
  );
}
