
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
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { useTranslation } from "@/hooks/useTranslation";

export function PestDiseaseIdentification() {
  const { registeredFarmer, addSmsToHistory } = useAppContext();
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
  const { t } = useTranslation();

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
        if (res.error || !res.audioDataUri) {
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(result.diagnosis.diagnosis);
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
            toast({
              title: "Voice Audio Playing",
              description: "Playing plant diagnosis via device voice engine.",
            });
            return;
          }
          throw new Error(res.error || "Audio generation returned no data.");
        }
        const newAudio = new Audio(res.audioDataUri);
        setAudio(newAudio);
        newAudio.play();
        newAudio.addEventListener('ended', () => setAudio(null));
      } catch (error: any) {
        console.error("Audio generation failed", error);
        toast({
          variant: "destructive",
          title: "Audio Error",
          description: error.message || "Could not generate audio. Please check your Gemini API key and try again.",
        });
      }
    });
  };

  const handleSampleLeafSelect = (dataUri: string) => {
    setImagePreview(dataUri);
    setImageData(dataUri);
    setResult(null);
    setError(null);
    setSmsStatus(null);
    if (audio) {
      audio.pause();
      setAudio(null);
    }
  };

  const SAMPLE_LEAF_IMAGES = [
    {
      name: "Tomato Early Blight",
      hindi: "टमाटर झुलसा रोग",
      icon: "🍅",
      dataUri: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23e8f5e9'/><path d='M100 20 C140 50 160 110 100 180 C40 110 60 50 100 20 Z' fill='%2366bb6a'/><circle cx='85' cy='75' r='18' fill='%234e342e'/><circle cx='85' cy='75' r='12' fill='%23795548'/><circle cx='120' cy='120' r='14' fill='%234e342e'/><circle cx='110' cy='60' r='10' fill='%23fbc02d'/></svg>",
    },
    {
      name: "Potato Late Blight",
      hindi: "आलू पिछेता झुलसा",
      icon: "🥔",
      dataUri: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f1f8e9'/><path d='M100 25 C150 60 150 130 100 175 C50 130 50 60 100 25 Z' fill='%234caf50'/><ellipse cx='80' cy='95' rx='25' ry='15' fill='%23212121'/><ellipse cx='125' cy='135' rx='18' ry='12' fill='%233e2723'/><circle cx='110' cy='80' r='8' fill='%23cddc39'/></svg>",
    },
    {
      name: "Healthy Maize Leaf",
      hindi: "स्वस्थ मक्का पत्ता",
      icon: "🌽",
      dataUri: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f9fbe7'/><path d='M100 15 C130 60 140 140 100 185 C60 140 70 60 100 15 Z' fill='%232e7d32'/><line x1='100' y1='15' x2='100' y2='185' stroke='%2381c784' stroke-width='4'/></svg>",
    },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Stethoscope className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>{t('diagnosis.title', 'Crop Health Diagnosis')}</CardTitle>
            <CardDescription>
              {t('diagnosis.description', 'Upload a photo of a plant to identify pests and diseases.')}
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
              <p className="font-semibold">{t('diagnosis.uploadPrompt', 'Click to upload an image')}</p>
              <p className="text-xs">{t('diagnosis.uploadHint', 'PNG, JPG, or WEBP up to 4MB')}</p>
            </div>
          )}
        </div>

        {/* 1-Click Sample Test Leaves */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <span>⚡ Test with Sample Leaves (1-क्लिक परीक्षण):</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_LEAF_IMAGES.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => handleSampleLeafSelect(sample.dataUri)}
                className="p-2 rounded-lg border bg-muted/40 hover:bg-muted text-left transition-all hover:border-primary/40 flex items-center gap-2 group"
              >
                <span className="text-xl">{sample.icon}</span>
                <div className="overflow-hidden">
                  <p className="font-semibold text-xs text-foreground group-hover:text-primary truncate">
                    {sample.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {sample.hindi}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={!imageData || isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="animate-spin" /> {t('diagnosis.diagnosing', 'Diagnosing...')}
            </>
          ) : (
            t('diagnosis.diagnose', 'Diagnose Plant Health')
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
                <h4 className="font-semibold text-foreground mb-2">{t('diagnosis.results', 'Diagnosis Results:')}</h4>
                <Button variant="ghost" size="icon" onClick={handlePlayAudio} disabled={isAudioPending}>
                    {isAudioPending ? <Loader2 className="animate-spin" /> : (audio ? <StopCircle /> : <PlayCircle />)}
                </Button>
            </div>
            <ul>
              <li><strong>{t('diagnosis.identification', 'Identification:')}</strong> {result.identification.commonName} (<em>{result.identification.latinName}</em>)</li>
              <li>
                <strong>{t('diagnosis.healthStatus', 'Health Status:')}</strong> 
                <span className={`font-semibold ml-1 ${result.diagnosis.isHealthy ? 'text-green-600' : 'text-destructive'}`}>
                  {result.diagnosis.isHealthy ? t('diagnosis.healthy', "Healthy") : t('diagnosis.needsAttention', "Needs Attention")}
                </span>
              </li>
              <li><strong>{t('diagnosis.analysis', 'Analysis:')}</strong> {result.diagnosis.diagnosis}</li>
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
            {isSmsPending ? <><Loader2 className="animate-spin" /> {t('diagnosis.sending', 'Sending...')}</> : <><Send /> {t('diagnosis.sendSms', 'Send as SMS')}</>}
        </Button>
      </CardFooter>
    </Card>
  );
}

    