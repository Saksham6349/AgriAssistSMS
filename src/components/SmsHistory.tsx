
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";

export type SmsMessage = {
  to: string;
  message: string;
  type: 'Weather' | 'Advisory';
  timestamp: Date;
};

export function SmsHistory() {
  const { smsHistory } = useAppContext();
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <History className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>{t('history.title', 'SMS History')}</CardTitle>
            <CardDescription>
              {t('history.description', 'A log of all sent weather and advisory alerts.')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full">
          {smsHistory.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">{t('history.noMessages', 'No messages sent yet.')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {smsHistory.map((sms, index) => (
                <div key={index} className="flex items-start gap-4">
                   <div className="flex-shrink-0">
                     <Badge variant={sms.type === 'Weather' ? 'default' : 'secondary'}>
                       {sms.type}
                     </Badge>
                   </div>
                   <div className="flex-grow">
                     <p className="text-sm text-foreground break-words">
                       {sms.message}
                     </p>
                     <p className="text-xs text-muted-foreground mt-1">
                       Sent to {sms.to} on {sms.timestamp.toLocaleString()}
                     </p>
                   </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

    