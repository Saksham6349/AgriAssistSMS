"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  History,
  Send,
  Phone,
  Search,
  CheckCircle2,
  Clock,
  Filter,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";

export type SmsMessage = {
  to: string;
  message: string;
  type: 'Weather' | 'Advisory';
  timestamp: Date;
};

export function SmsHistory() {
  const { smsHistory, registeredFarmer } = useAppContext();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"All" | "Weather" | "Advisory">("All");

  const filteredHistory = useMemo(() => {
    return smsHistory.filter((sms) => {
      const matchesSearch =
        sms.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sms.to.includes(searchTerm);
      const matchesType =
        selectedType === "All" || sms.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [smsHistory, searchTerm, selectedType]);

  return (
    <Card className="border shadow-xs">
      <CardHeader className="pb-3 border-b bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <History className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                {t('history.title', 'SMS Delivery Log & Telemetry')}
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time record of all 160-character GSM advisories dispatched to farmer mobile phones.
              </CardDescription>
            </div>
          </div>

          <Badge variant="outline" className="text-xs font-mono w-fit">
            Total Dispatched: {smsHistory.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by message content or recipient number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {(["All", "Advisory", "Weather"] as const).map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="text-xs h-9 px-3"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* History Messages List */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed rounded-xl bg-muted/20 space-y-2">
            <div className="p-3 rounded-full bg-muted w-fit mx-auto text-muted-foreground">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="font-semibold text-sm text-foreground">
              {smsHistory.length === 0
                ? "No SMS messages dispatched yet"
                : "No messages match your search filter"}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {smsHistory.length === 0
                ? "When you send a Crop Recommendation, Fertilizer Prescription, Weather Alert, or Mandi Update, the delivery audit record will appear here."
                : "Try clearing your search term to see all sent messages."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((sms, index) => {
              const charCount = sms.message.length;
              const dateStr = new Date(sms.timestamp).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={index}
                  className="p-4 rounded-xl border bg-card/60 hover:bg-card transition-all space-y-2.5 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={sms.type === "Weather" ? "default" : "secondary"}
                        className="text-[11px] font-semibold"
                      >
                        {sms.type}
                      </Badge>
                      <span className="flex items-center gap-1 text-muted-foreground font-mono">
                        <Phone className="w-3 h-3 text-primary" />
                        {sms.to}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {dateStr}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Dispatched
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-mono bg-muted/40 p-3 rounded-lg border text-foreground leading-relaxed break-words">
                    {sms.message}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-0.5">
                    <span>
                      Character budget:{" "}
                      <strong className={charCount > 150 ? "text-amber-600 font-bold" : "text-foreground"}>
                        {charCount}/160
                      </strong>
                    </span>
                    <span className="font-mono">Standard GSM-7 Encoding</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
