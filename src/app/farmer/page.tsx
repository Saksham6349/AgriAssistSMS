"use client";

import { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { UserManagement } from '@/components/UserManagement';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Sprout,
  Stethoscope,
  Sun,
  TrendingUp,
  User,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Volume2,
  VolumeX,
  Send,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  CloudRain,
  Wheat,
  MapPin,
  Calendar,
  AlertTriangle,
  Flame,
  Phone,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { sendSms } from '@/ai/flows/send-sms';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { getMandiPriceForecast } from '@/lib/ml/mandi-forecaster';

export default function FarmerPage() {
  const { t } = useTranslation();
  const { registeredFarmer, addSmsToHistory } = useAppContext();
  const { toast } = useToast();

  const [isSmsPending, startSmsTransition] = useTransition();
  const [isAudioPending, startAudioTransition] = useTransition();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  // Compute today's personalized Mandi Forecast for the farmer's crop
  const mandiBrief = useMemo(() => {
    const crop = registeredFarmer?.crop || "Wheat";
    const district = registeredFarmer?.district || "Indore";
    return getMandiPriceForecast(crop, district);
  }, [registeredFarmer]);

  // Construct a concise, practical 160-character daily briefing
  const dailyBriefingText = useMemo(() => {
    const farmerName = registeredFarmer?.name ? `${registeredFarmer.name} ji` : "Kisan bhai";
    const crop = registeredFarmer?.crop || "Wheat";
    const price = mandiBrief.currentModalPrice;
    const action = mandiBrief.sellingAdvisory.action;
    
    return `Namaste ${farmerName}: Today's weather clear (28°C). ${crop} @ Mandi: ₹${price}/qtl (${mandiBrief.trend}). Action: ${action} for peak profit. AgriAssist SMS`;
  }, [registeredFarmer, mandiBrief]);

  const handleSendDailySms = () => {
    if (!registeredFarmer) {
      toast({
        variant: "destructive",
        title: "No Farmer Registered",
        description: "Please fill in your details below to receive daily SMS updates.",
      });
      return;
    }

    startSmsTransition(async () => {
      try {
        const res = await sendSms({
          to: registeredFarmer.phone,
          message: dailyBriefingText.slice(0, 160),
        });

        addSmsToHistory({
          to: registeredFarmer.phone,
          message: dailyBriefingText.slice(0, 160),
          type: "Advisory",
        });

        toast({
          title: "Daily Briefing Sent to Your Phone!",
          description: `SMS dispatched to ${registeredFarmer.name} at ${registeredFarmer.phone}.`,
        });
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "SMS Error",
          description: err?.message || "Could not deliver SMS.",
        });
      }
    });
  };

  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      if (audioInstance) {
        audioInstance.pause();
        setAudioInstance(null);
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    startAudioTransition(async () => {
      try {
        // Attempt AI Voice TTS
        const res = await textToSpeech({ text: dailyBriefingText });

        if (res.audioDataUri) {
          const newAudio = new Audio(res.audioDataUri);
          setAudioInstance(newAudio);
          setIsPlayingAudio(true);
          newAudio.play();
          newAudio.addEventListener("ended", () => {
            setIsPlayingAudio(false);
            setAudioInstance(null);
          });
          return;
        }

        // Seamless fallback to device Web Speech API
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(dailyBriefingText);
          utterance.rate = 0.95;
          utterance.onend = () => setIsPlayingAudio(false);
          setIsPlayingAudio(true);
          window.speechSynthesis.speak(utterance);
          toast({
            title: "Voice Audio Playing",
            description: "Playing audio briefing through your device speakers.",
          });
        }
      } catch {
        // Fallback
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(dailyBriefingText);
          utterance.onend = () => setIsPlayingAudio(false);
          setIsPlayingAudio(true);
          window.speechSynthesis.speak(utterance);
        }
      }
    });
  };

  const primaryServices = [
    {
      title: 'Best Crop & Fertilizer',
      hindi: 'फसल और खाद की सही सलाह',
      desc: 'Discover which crop will yield maximum profit on your soil, plus exact 50kg bags of Urea and DAP needed.',
      href: '/farmer/crop-recommendation',
      icon: Sprout,
      badge: 'ML 99.55%',
      badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      actionText: 'Check Crop & Fertilizer',
    },
    {
      title: 'Plant Leaf Doctor',
      hindi: 'पौधे की बीमारी की जांच',
      desc: 'Take or upload a photo of an unhealthy leaf to detect 38 plant diseases with instant organic remedies.',
      href: '/farmer/diagnosis',
      icon: Stethoscope,
      badge: 'Photo AI Doctor',
      badgeColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30',
      actionText: 'Scan Sick Leaf',
    },
    {
      title: 'Today & 48-Hour Weather',
      hindi: 'मौसम और बारिश का अनुमान',
      desc: 'Real-time rain forecast, wind speeds, and spraying recommendations to protect your fields from rain.',
      href: '/farmer/weather',
      icon: Sun,
      badge: 'Live Weather',
      badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
      actionText: 'Check Rain & Temp',
    },
    {
      title: 'Mandi Rates & Sell Advice',
      hindi: 'मंडी भाव और बेचने का सही समय',
      desc: 'Live wholesale modal rates for 40 APMC mandis, 7-day price forecasts, and whether to SELL or HOLD.',
      href: '/farmer/market-prices',
      icon: TrendingUp,
      badge: 'Live Agmarknet',
      badgeColor: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
      actionText: 'View Mandi Rates',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 md:p-8 shadow-xl border border-emerald-600/40">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-100 border border-white/20">
              <User className="w-3.5 h-3.5 text-emerald-300" />
              <span>Kisan One-Stop Digital Hub (किसान संपूर्ण सेवा केंद्र)</span>
            </div>

            <Badge variant="outline" className="text-white/90 border-white/30 text-xs px-2.5 py-0.5">
              100% Free for Farmers
            </Badge>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            {registeredFarmer ? `Namaste, ${registeredFarmer.name} ji 🙏` : 'Welcome to AgriAssist Farmer Portal'}
          </h1>

          <p className="text-sm md:text-base text-emerald-100/95 max-w-2xl leading-relaxed">
            {registeredFarmer
              ? `Registered from ${registeredFarmer.district || registeredFarmer.village} for ${registeredFarmer.crop}. Your daily farm advisory, live mandi prices, and crop diagnosis are ready below.`
              : 'Everything you need in one place: Soil testing & crop selection, leaf doctor scan, weather rain forecasts, and live mandi prices delivered directly to your phone via SMS.'}
          </p>
        </div>

        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
      </div>

      {/* Today's Daily Farm Action Briefing Card (All-in-One Snapshot) */}
      <Card className="border-2 border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">
                  Today&apos;s Field Action Briefing (आज का किसान बुलेटिन)
                </CardTitle>
                <CardDescription className="text-xs">
                  Automated daily summary combining Weather, Mandi Prices, and Fertilizer schedules
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleToggleVoice}
                disabled={isAudioPending}
                variant="outline"
                size="sm"
                className="gap-2 font-semibold text-xs border-primary/30"
              >
                {isAudioPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-600" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-primary" />
                    <span>Listen Aloud (बोलकर सुनें)</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleSendDailySms}
                disabled={isSmsPending || !registeredFarmer}
                size="sm"
                className="gap-2 bg-primary text-primary-foreground font-semibold text-xs shadow-sm"
              >
                {isSmsPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Send to My Phone (SMS)</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Quick 3-Pillar Snapshot Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Weather Pill */}
            <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span className="flex items-center gap-1.5"><Sun className="w-4 h-4" /> Today&apos;s Weather</span>
                <span className="font-mono">28°C Clear</span>
              </div>
              <p className="text-xs text-foreground font-medium pt-1">
                Rain probability is low (10%). Safe day for pesticide spraying & field watering.
              </p>
            </div>

            {/* Mandi Pill */}
            <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> {mandiBrief.crop} Rate</span>
                <span className="font-mono font-bold">₹{mandiBrief.currentModalPrice}/qtl</span>
              </div>
              <p className="text-xs text-foreground font-medium pt-1">
                7-day forecast: <strong>₹{mandiBrief.forecast7Day}</strong> ({mandiBrief.trend}). 
                <span className="text-emerald-700 dark:text-emerald-300 font-bold ml-1">Advice: {mandiBrief.sellingAdvisory.action}</span>.
              </p>
            </div>

            {/* Fertilizer Pill */}
            <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span className="flex items-center gap-1.5"><Sprout className="w-4 h-4" /> Soil & Fertilizer</span>
                <span className="font-mono">Basal Dose</span>
              </div>
              <p className="text-xs text-foreground font-medium pt-1">
                Apply DAP 1.2 bags/acre during sowing. Split Urea into 2 top dressings with irrigation.
              </p>
            </div>
          </div>

          {/* Spoken / SMS Text Preview */}
          <div className="p-3 rounded-lg border bg-muted/40 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-bold text-muted-foreground uppercase text-[10px] shrink-0">Today&apos;s SMS:</span>
              <p className="font-mono text-foreground truncate">{dailyBriefingText}</p>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground shrink-0">{dailyBriefingText.length}/160 chars</span>
          </div>
        </CardContent>
      </Card>

      {/* The 4 Core Farmer Action Services (Big, Simple Cards) */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <span>What Would You Like to Do? (आप क्या करना चाहते हैं?)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {primaryServices.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="border bg-card hover:border-primary/50 hover:shadow-md transition-all group">
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className={`text-xs font-semibold ${service.badgeColor}`}>
                      {service.badge}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors flex items-baseline gap-2">
                      <span>{service.title}</span>
                    </h3>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {service.hindi}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      {service.desc}
                    </p>
                  </div>

                  <Button asChild className="w-full font-semibold gap-2" variant="outline" size="sm">
                    <Link href={service.href}>
                      <span>{service.actionText}</span>
                      <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Emergency Kisan Support & Toll-Free Helpline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border bg-card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-600">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">National Kisan Call Centre</p>
            <p className="text-base font-black font-mono text-foreground">1800-180-1551</p>
            <p className="text-[10px] text-emerald-600">24x7 Toll-Free Govt. Help</p>
          </div>
        </Card>

        <Card className="border bg-card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-blue-500/10 text-blue-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">PM-Kisan & Crop Insurance</p>
            <p className="text-sm font-bold text-foreground">Fasal Bima (PMFBY)</p>
            <p className="text-[10px] text-muted-foreground">Claim crop loss within 72 hrs</p>
          </div>
        </Card>

        <Card className="border bg-card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-600">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Krishi Vigyan Kendra (KVK)</p>
            <p className="text-sm font-bold text-foreground">District Agronomists</p>
            <p className="text-[10px] text-muted-foreground">Certified Seeds & Soil Tests</p>
          </div>
        </Card>
      </div>

      {/* Farmer Profile & Registration Form */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground uppercase tracking-wider text-muted-foreground">
            {registeredFarmer ? 'Your Registered Farmer Profile' : 'Register as a Farmer'}
          </h2>
          {registeredFarmer && (
            <Badge className="bg-emerald-600 text-white text-xs font-medium">
              Verified Farmer
            </Badge>
          )}
        </div>
        <UserManagement isAdmin={false} />
      </div>
    </div>
  );
}
