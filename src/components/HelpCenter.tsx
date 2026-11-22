"use client";

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  LifeBuoy,
  Bot,
  Mail,
  Phone,
  PhoneCall,
  Sparkles,
  Sprout,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  FileQuestion,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

export function HelpCenter() {
  const { t } = useTranslation();

  const faqs = [
    {
      question: "How does the Machine Learning Crop Recommendation work?",
      answer:
        "The crop recommender uses a Random Forest classification model trained on 2,200 Indian agricultural soil and climate records from Kaggle. By inputting your soil's Nitrogen (N), Phosphorus (P), Potassium (K), pH, rainfall, and temperature (or picking an Indian Soil Preset like Alluvial or Black Deccan), the model computes exact probability distributions across 22 crops to recommend the highest-yielding crop for your specific land.",
    },
    {
      question: "How are the Fertilizer bag dosages calculated?",
      answer:
        "The fertilizer precision engine compares your soil test values against optimal ICAR crop nutrient benchmarks. It calculates the exact deficits (ΔN, ΔP, ΔK) and converts them into precise 50 kg bag counts of commercial fertilizers (Urea 46% N, DAP 18-46-0, MOP 60% K), providing split application schedules (basal at sowing vs. top dressing) and organic alternatives like vermicompost and neem cake.",
    },
    {
      question: "How accurate are the Mandi Price forecasts and where does the data come from?",
      answer:
        "Prices are grounded in authentic historical Agmarknet wholesale arrival records from the Directorate of Marketing & Inspection (DMI), Government of India. The system uses a trained Gradient Boosting Regressor (MAE: ₹66.55/quintal) to project 7-day and 14-day price horizons, comparing them against official Minimum Support Prices (MSP 2024–25) to recommend whether you should HOLD inventory or SELL immediately.",
    },
    {
      question: "How does the Plant Leaf Doctor identify diseases?",
      answer:
        "When you upload or take a photo of an unhealthy leaf, the computer vision classifier analyzes leaf discoloration, yellow chlorosis, and necrotic lesion patterns mapped against the 38 Kaggle PlantVillage disease categories. It immediately provides pathogen identification, severity level, and specific organic and chemical treatment instructions.",
    },
    {
      question: "Can farmers receive advisories without smartphones or internet?",
      answer:
        "Yes! That is the core purpose of AgriAssist SMS. Every recommendation, weather alert, and mandi price update is condensed into under 160 GSM SMS characters and dispatched via Twilio to standard ₹1,000 basic feature phones. Farmers can also click 'Listen Aloud' to hear voice messages in their regional language.",
    },
    {
      question: "How do I switch between Admin and Farmer portals?",
      answer:
        "Use the portal switcher toggle at the top-right of the navigation bar. The Admin Portal is tailored for field officers and agronomists to manage farmers and broadcast emergency advisories, while the Farmer Portal provides a simplified, one-stop self-service dashboard.",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 md:p-8 shadow-md border border-emerald-700/50">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-200 border border-white/10">
            <LifeBuoy className="w-3.5 h-3.5 text-emerald-300" />
            <span>Kisan Support & Knowledge Base</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            How Can We Assist You?
          </h1>
          <p className="text-sm md:text-base text-emerald-100/90 max-w-2xl">
            Find answers to questions about our Machine Learning models, fertilizer calculators, mandi rates, SMS alerts, and toll-free helpline numbers.
          </p>
        </div>
      </div>

      {/* Support Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Kisan Call Centre */}
        <Card className="border bg-card shadow-xs">
          <CardContent className="p-5 space-y-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 w-fit">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                National Kisan Call Centre
              </p>
              <p className="text-xl font-black font-mono text-foreground mt-0.5">
                1800-180-1551
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Toll-free 24x7 support by Indian agricultural scientists in 22 regional languages.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Agri-Assistant Chatbot */}
        <Card className="border bg-card shadow-xs">
          <CardContent className="p-5 space-y-2.5 flex flex-col justify-between h-full">
            <div>
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit">
                <Bot className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2.5">
                Instant AI Assistance
              </p>
              <p className="text-base font-bold text-foreground mt-0.5">
                24x7 AI Agri-Chatbot
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Ask any farming query regarding pests, weather, or mandi prices in natural language.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="w-full gap-2 text-xs font-semibold mt-2">
              <Link href="/chat">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                <span>Open AI Assistant</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Email Technical Helpdesk */}
        <Card className="border bg-card shadow-xs">
          <CardContent className="p-5 space-y-2.5 flex flex-col justify-between h-full">
            <div>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 w-fit">
                <Mail className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2.5">
                Technical Helpdesk
              </p>
              <p className="text-base font-bold text-foreground mt-0.5 truncate">
                support@agriassistsms.farm
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                For administrative account assistance, API key setup, or SMS gateway issues.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="w-full text-xs font-semibold mt-2">
              <a href="mailto:support@agriassistsms.farm">Email Team</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Frequently Asked Questions */}
      <Card className="border shadow-xs">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <div className="flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-bold">Frequently Asked Questions (FAQ)</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Answers to common questions regarding machine learning predictions, SMS delivery, and soil analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Accordion type="single" collapsible className="w-full text-sm">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b last:border-0 py-1">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors py-3">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm text-muted-foreground leading-relaxed pb-3">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
