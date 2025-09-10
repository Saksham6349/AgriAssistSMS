
"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquareWarning, Loader2, Send, Lightbulb } from "lucide-react";
import { translateAdvisoryAlerts } from "@/ai/flows/translate-advisory-alerts";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { sendSms } from "@/ai/flows/send-sms";
import { useAppContext } from "@/context/AppContext";
import { generateAdvisoryAlert } from "@/ai/flows/generate-advisory-alert";
import { useTranslation } from "@/hooks/useTranslation";

export function AdvisoryAlerts() {
  const { registeredFarmer, addSmsToHistory } = useAppContext();
  const { t } = useTranslation();
  const [isTranslatePending, startTranslateTransition] = useTransition();
  const [isSmsPending, startSmsTransition] = useTransition();
  const [isGeneratePending, startGenerateTransition] = useTransition();
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [alertText, setAlertText] = useState<string>("");
  const [language, setLanguage] = useState("English");
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (registeredFarmer) {
      setLanguage(registeredFarmer.language);
      handleGenerateAlert();
    } else {
      setAlertText("");
      setTranslatedText(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registeredFarmer]);

  const handleGenerateAlert = () => {
    if (!registeredFarmer) {
      toast({
        variant: "destructive",
        title: "No Farmer Registered",
        description: "Please register a farmer to generate an alert.",
      });
      return;
    }

    setAlertText("");
    setTranslatedText(null);
    setSmsStatus(null);
    
    startGenerateTransition(async () => {
      try {
        const res = await generateAdvisoryAlert({
          location: registeredFarmer.location,
          crop: registeredFarmer.crop,
        });
        if (res?.alert) {
          setAlertText(res.alert);
        } else {
          throw new Error("Failed to generate an alert.");
        }
      } catch (err: any) {
        console.error("Alert generation failed:", err);
        toast({
          variant: "destructive",
          title: "Generation Error",
          description: err.message || "Could not generate an advisory alert. Please try again.",
        });
      }
    });
  };

  const handleTranslate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!alertText) {
      toast({
        variant: "destructive",
        title: "No Alert",
        description: "Please generate an alert before translating.",
      });
      return;
    }

    setSmsStatus(null);
    setTranslatedText(null);
    startTranslateTransition(async () => {
      try {
        const res = await translateAdvisoryAlerts({
          text: alertText,
          language,
        });
        if (res?.translatedText) {
          setTranslatedText(res.translatedText);
        } else {
          throw new Error("The translation result was empty.");
        }
      } catch (err: any) {
        console.error("Translation failed:", err);
        toast({
          variant: "destructive",
          title: "Translation Error",
          description: err.message || "Could not translate the advisory alert. Please try again.",
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
    if (translatedText) {
      startSmsTransition(async () => {
        try {
          const res = await sendSms({ to: registeredFarmer.phone, message: translatedText });
          setSmsStatus(res.status);
          addSmsToHistory({
            to: registeredFarmer.phone,
            message: translatedText,
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
            <CardTitle>{t('advisory.title')}</CardTitle>
            <CardDescription>
              {t('advisory.description')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <div className="flex flex-col flex-grow">
        <CardContent className="space-y-4 flex-grow">
          <Button onClick={handleGenerateAlert} disabled={isGeneratePending || !registeredFarmer} className="w-full">
              {isGeneratePending ? (
                <>
                  <Loader2 className="animate-spin" /> {t('advisory.generating')}
                </>
              ) : (
                <>
                  <Lightbulb /> {t('advisory.generateAlert')} {registeredFarmer ? registeredFarmer.location : '...'}
                </>
              )}
          </Button>

          {(alertText && !isGeneratePending) && (
            <div className="p-4 bg-muted rounded-md border mt-4">
              <h4 className="font-semibold mb-2">{t('advisory.generatedAlert')}</h4>
              <p className="text-sm text-muted-foreground">{alertText}</p>
            </div>
          )}
          
          <form onSubmit={handleTranslate} className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <label htmlFor="language-select" className="text-sm font-medium">{t('advisory.targetLanguage')}</label>
              <Select value={language} onValueChange={setLanguage} disabled={!alertText}>
                <SelectTrigger id="language-select" className="w-full">
                  <SelectValue placeholder={t('advisory.selectLanguage')} />
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
            </div>
            <Button type="submit" disabled={isTranslatePending || !alertText} className="w-full">
              {isTranslatePending ? (
                <>
                  <Loader2 className="animate-spin" /> {t('advisory.translating')}
                </>
              ) : (
                t('advisory.translate')
              )}
            </Button>
          </form>

          {translatedText && !isTranslatePending && (
            <div className="p-4 bg-muted rounded-md border mt-4">
              <h4 className="font-semibold mb-2">{t('advisory.translatedAlert')} ({language}):</h4>
              <p className="text-sm text-muted-foreground">{translatedText}</p>
            </div>
          )}

          {smsStatus && !isSmsPending && (
            <Alert className="mt-4">
              <Send className="w-4 h-4" />
              <AlertTitle>{t('advisory.smsStatus')}</AlertTitle>
              <AlertDescription className="text-xs whitespace-pre-wrap break-words">
                 {smsStatus} for farmer {registeredFarmer?.name}.
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSendSms} 
            disabled={!translatedText || isTranslatePending || isSmsPending} 
            className="w-full"
            variant="secondary"
            size="sm"
          >
             {isSmsPending ? <><Loader2 className="animate-spin" /> {t('advisory.sending')}</> : <><Send /> {t('advisory.sendSms')}</>}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
