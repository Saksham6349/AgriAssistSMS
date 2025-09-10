"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, Languages, MessageSquareWarning, Speaker, Stethoscope, Sun, TrendingUp } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from "./Header";

export function LandingPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Sun className="w-8 h-8 text-primary" />,
      title: t('sidebar.weather'),
      description: "Get AI-powered weather summaries for any location.",
    },
    {
      icon: <MessageSquareWarning className="w-8 h-8 text-primary" />,
      title: t('sidebar.advisory'),
      description: "Generate and send critical pest and advisory alerts to farmers.",
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-primary" />,
      title: t('sidebar.diagnosis'),
      description: "Identify crop diseases by simply uploading a photo of the plant.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: t('sidebar.market'),
      description: "Access live mandi rates for key crops to make informed selling decisions.",
    },
    {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: t('sidebar.chat'),
      description: "Ask the AI assistant anything about farming, crops, and weather.",
    },
    {
      icon: <Languages className="w-8 h-8 text-primary" />,
      title: "Multi-Language Support",
      description: "Translate alerts and interact with the app in 10 different Indian languages.",
    },
    {
      icon: <Speaker className="w-8 h-8 text-primary" />,
      title: "Text-to-Speech",
      description: "Listen to weather forecasts and advisory alerts in a clear, natural voice.",
    },
    {
        icon: <ArrowRight className="w-8 h-8 text-primary" />,
        title: "SMS Integration",
        description: "Deliver all critical information directly to farmers' mobile phones via SMS.",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                Welcome to AgriAssist SMS
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Empowering farmers with AI-driven insights and real-time alerts, delivered directly via SMS. Bridge the information gap and boost agricultural productivity.
              </p>
              <div className="flex justify-center">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
                Key Features
              </h2>
              <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">
                A comprehensive suite of tools designed for the modern farmer.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader className="flex items-center gap-4 pb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 px-4 md:px-6 border-t bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AgriAssist SMS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
