
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquareWarning, Loader2, Send } from "lucide-react";
import { translateAdvisoryAlerts } from "@/ai/flows/translate-advisory-alerts";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { FarmerData } from "./UserManagement";
import { sendSms } from "@/ai/flows/send-sms";
import type { SmsMessage } from "./SmsHistory";

const sampleAlert =
  "Warning: Yellow Rust detected in wheat crops in Haryana region. Farmers are advised to inspect fields for yellowish stripes on leaves. If found, spray approved fungicides like Propiconazole or Tebuconazole immediately to prevent yield loss. Consult local agricultural office for details.";

type ServerActionResult = {
  translatedText: string | null;
  error: string | null;
};

interface AdvisoryAlertsProps {
  registeredFarmer: FarmerData | null;
  onSmsSent: (message: Omit<SmsMessage, 'timestamp'>) => void;
}

export function AdvisoryAlerts({ registeredFarmer, onSmsSent }: AdvisoryAlertsProps) {
  const [isTranslatePending, startTranslateTransition] = useTransition();
  const [isSmsPending, startSmsTransition] = useTransition();
  const [result, setResult] = useState<ServerActionResult | null>(null);
  const [alertText, setAlertText] = useState(sampleAlert);
  const [language, setLanguage] = useState("Spanish");
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTranslate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSmsStatus(null);
    startTranslateTransition(async () => {
      try {
        const res = await translateAdvisoryAlerts({
          text: alertText,
          language,
        });
        if (res.translatedText) {
          setResult({ translatedText: res.translatedText, error: null });
        } else {
          throw new Error("Translation failed.");
        }
      } catch (err) {
         setResult({
          translatedText: null,
          error: "Translation failed. Please try again.",
        });
        toast({
          variant: "destructive",
          title: "Translation Error",
          description: "Could not translate the advisory alert.",
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
    if (result?.translatedText) {
      startSmsTransition(async () => {
        try {
          const res = await sendSms({ to: registeredFarmer.phone, message: result.translatedText! });
          setSmsStatus(res.status);
          onSmsSent({
            to: registeredFarmer.phone,
            message: result.translatedText!,
            type: 'Advisory',
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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <MessageSquareWarning className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>Advisory & Pest Alerts</CardTitle>
            <CardDescription>
              Translate and send critical alerts to farmers.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <div className="flex flex-col flex-grow">
        <CardContent className="space-y-4 flex-grow">
          <form onSubmit={handleTranslate} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="alert-text" className="text-sm font-medium">Alert Message</label>
              <Textarea
                id="alert-text"
                placeholder="Enter advisory alert text..."
                value={alertText}
                onChange={(e) => setAlertText(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="language-select" className="text-sm font-medium">Target Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language-select" className="w-full">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Swahili">Swahili</SelectItem>
                  <SelectItem value="Mandarin">Mandarin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isTranslatePending} className="w-full">
              {isTranslatePending ? (
                <>
                  <Loader2 className="animate-spin" /> Translating...
                </>
              ) : (
                "Translate Alert"
              )}
            </Button>
          </form>

          {result?.translatedText && !isTranslatePending && (
            <div className="p-4 bg-muted rounded-md border mt-4">
              <h4 className="font-semibold mb-2">Translated Alert ({language}):</h4>
              <p className="text-sm text-muted-foreground">{result.translatedText}</p>
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
          <Button 
            onClick={handleSendSms} 
            disabled={!result?.translatedText || isTranslatePending || isSmsPending} 
            className="w-full"
            variant="secondary"
          >
             {isSmsPending ? <><Loader2 className="animate-spin" /> Sending...</> : <><Send /> Send as SMS</>}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
