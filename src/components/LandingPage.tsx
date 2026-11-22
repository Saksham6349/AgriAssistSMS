"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MessageSquareWarning,
  Sun,
  Stethoscope,
  TrendingUp,
  Bot,
  Languages,
  Speaker,
  Smartphone,
  Sprout,
  Cpu,
  User,
  Shield,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function LandingPage() {
  const features = [
    {
      icon: <Sprout className="w-6 h-6 text-emerald-400" />,
      title: "Crop Recommendation (ML)",
      badge: "ML 95%",
      description: "Machine Learning model trained on 2,200 Indian soil records (N, P, K, pH, rainfall) predicting the highest-yield crops.",
      color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    },
    {
      icon: <Stethoscope className="w-6 h-6 text-sky-400" />,
      title: "Plant Disease Diagnosis",
      badge: "CV Model",
      description: "Instant computer vision leaf diagnosis across 38 Kaggle plant disease classes with organic and chemical action plans.",
      color: "bg-sky-500/10 border-sky-500/20 text-sky-400",
    },
    {
      icon: <Sun className="w-6 h-6 text-amber-400" />,
      title: "Weather Forecast",
      badge: "Hyperlocal",
      description: "Actionable 48-hour forecasts, rain probability alerts, and soil moisture tips for optimal irrigation schedules.",
      color: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-400" />,
      title: "Mandi Market Prices",
      badge: "Live Rates",
      description: "Daily wholesale mandi commodity prices across regional markets to help farmers time sales for maximum profit.",
      color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    },
    {
      icon: <Bot className="w-6 h-6 text-purple-400" />,
      title: "AI Chat Assistant",
      badge: "Gemini 2.0",
      description: "Interactive agricultural chatbot equipped with specialized tools to answer farming, pest, and climate queries.",
      color: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    },
    {
      icon: <Languages className="w-6 h-6 text-teal-400" />,
      title: "10 Indian Languages",
      badge: "Multilingual",
      description: "Translate advisories into Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, and Punjabi.",
      color: "bg-teal-500/10 border-teal-500/20 text-teal-400",
    },
    {
      icon: <Speaker className="w-6 h-6 text-pink-400" />,
      title: "Voice Text-to-Speech",
      badge: "Audio TTS",
      description: "Generates natural regional speech so farmers can listen to advisories without having to read long texts.",
      color: "bg-pink-500/10 border-pink-500/20 text-pink-400",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-emerald-400" />,
      title: "160-Char SMS Delivery",
      badge: "Zero Internet",
      description: "Delivers all critical insights via Twilio SMS directly to any feature phone, requiring zero internet access for farmers.",
      color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    },
  ];

  const steps = [
    {
      step: "01",
      icon: <User className="w-6 h-6 text-emerald-400" />,
      title: "Farmer Registration",
      desc: "Capture location, preferred regional language, and primary crop with optional AI Government ID verification.",
    },
    {
      step: "02",
      icon: <Cpu className="w-6 h-6 text-sky-400" />,
      title: "ML & AI Inference",
      desc: "Run soil crop recommendation models, diagnose leaf photos, or generate timely weather and pest alerts.",
    },
    {
      step: "03",
      icon: <Smartphone className="w-6 h-6 text-amber-400" />,
      title: "Direct SMS Delivery",
      desc: "Instantly translate insights into the farmer's dialect and dispatch via SMS to any mobile device in under 160 characters.",
    },
  ];

  const testimonials = [
    {
      quote: "The weather alerts are incredibly accurate and helped me plan irrigation during the dry spell. My wheat yield improved by 15% this season.",
      name: "Rajesh Kumar",
      crop: "Wheat Farmer",
      location: "Ludhiana, Punjab",
      initials: "RK",
    },
    {
      quote: "The leaf photo diagnosis identified Early Blight immediately and gave me organic neem treatments. Saved my tomato crop from complete loss.",
      name: "Anjali Patel",
      crop: "Vegetable Grower",
      location: "Anand, Gujarat",
      initials: "AP",
    },
    {
      quote: "Getting daily mandi prices via SMS directly on my simple keypad phone made a huge difference. I negotiated 12% higher prices at the mandi.",
      name: "Suresh Singh",
      crop: "Maize & Pulses",
      location: "Samastipur, Bihar",
      initials: "SS",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen text-white">
      <main className="flex-1 space-y-24 pb-20">
        {/* Features Section */}
        <section id="features" className="w-full pt-12 md:pt-20">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>End-to-End AgriTech Suite</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Comprehensive Toolkit for Modern Agriculture
              </h2>
              <p className="max-w-2xl mx-auto text-emerald-100/70 text-sm md:text-base">
                Combining precision Machine Learning models with Generative AI and SMS to bring institutional agricultural expertise to every farmer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.07] transition-all duration-300 flex flex-col justify-between group rounded-2xl hover:-translate-y-1"
                >
                  <CardHeader className="space-y-3 pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border ${feature.color}`}>
                        {feature.icon}
                      </div>
                      <Badge variant="outline" className="text-[10px] text-emerald-300 border-emerald-400/30 bg-emerald-500/10">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-emerald-100/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-16 bg-white/[0.02] border-y border-white/5">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simple 3-Step Flow</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                How AgriAssist SMS Works
              </h2>
              <p className="max-w-xl mx-auto text-emerald-100/70 text-sm md:text-base">
                Connecting deep machine learning insights directly to basic mobile phones without friction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div
                  key={s.step}
                  className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative space-y-4 hover:border-emerald-500/30 transition-all"
                >
                  <span className="text-4xl font-extrabold text-emerald-400/30 block font-mono">
                    {s.step}
                  </span>
                  <div className="p-3 bg-white/5 rounded-2xl w-fit border border-white/10">
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{s.title}</h3>
                  <p className="text-xs md:text-sm text-emerald-100/70 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dual Portal Gateway Section */}
        <section id="ml-models" className="w-full">
          <div className="container px-4 md:px-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Farmer Portal Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-slate-900 border border-emerald-500/30 backdrop-blur-md space-y-5">
                <div className="p-3 bg-emerald-500/20 rounded-2xl w-fit text-emerald-400 border border-emerald-400/30">
                  <Sprout className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    Grower Interface
                  </Badge>
                  <h3 className="text-2xl font-bold text-white">Farmer Portal</h3>
                  <p className="text-xs md:text-sm text-emerald-100/70 leading-relaxed">
                    Designed for farmers in the field. Test soil parameters in the Crop Recommendation ML tool, diagnose leaf photos, check live mandi rates, and listen to voice advisories.
                  </p>
                </div>
                <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl gap-2">
                  <Link href="/farmer">
                    <span>Enter Farmer Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Admin Portal Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/80 to-emerald-950/40 border border-white/15 backdrop-blur-md space-y-5">
                <div className="p-3 bg-sky-500/20 rounded-2xl w-fit text-sky-400 border border-sky-400/30">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/30">
                    Management Interface
                  </Badge>
                  <h3 className="text-2xl font-bold text-white">Admin Dashboard</h3>
                  <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                    Designed for agronomists and field agents. Register farmers with AI ID verification, broadcast emergency pest alerts, consult the farming chatbot, and track SMS logs.
                  </p>
                </div>
                <Button asChild variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white font-bold rounded-xl gap-2">
                  <Link href="/dashboard">
                    <span>Enter Admin Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Farmer Impact Stories
              </h2>
              <p className="max-w-xl mx-auto text-emerald-100/70 text-sm">
                Real feedback from farmers utilizing AgriAssist SMS advisories across India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <Card key={t.name} className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl">
                  <CardContent className="p-6 space-y-4">
                    <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-sm text-emerald-300 font-mono">
                        {t.initials}
                      </div>
                      <div>
                        <strong className="text-sm font-bold text-white block">{t.name}</strong>
                        <span className="text-xs text-emerald-300/80 block">{t.crop} • {t.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-white/10 py-8 bg-slate-950/80 backdrop-blur-md">
        <div className="container px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-emerald-500/20 rounded-md">
              <Sprout className="w-4 h-4 text-emerald-400" />
            </div>
            <span>© {new Date().getFullYear()} AgriAssist SMS • Built for Indian Agriculture</span>
          </div>
          <div className="flex gap-6">
            <Link href="/role-selection" className="hover:text-emerald-400 transition-colors">Portals</Link>
            <Link href="/crop-recommendation" className="hover:text-emerald-400 transition-colors">Crop ML</Link>
            <Link href="/farmer/help" className="hover:text-emerald-400 transition-colors">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
