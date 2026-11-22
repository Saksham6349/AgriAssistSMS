"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, ArrowRight, Leaf, Check, Sparkles, Sprout, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RoleSelectionPage() {
  const farmerFeatures = [
    "Run Soil & Climate Crop Recommendation ML model",
    "Instant leaf disease diagnosis with organic action plans",
    "Hyperlocal 48-hour weather forecast and rain alerts",
    "Real-time mandi wholesale prices across regional markets",
    "Audio Text-to-Speech in 10 Indian regional languages",
  ];

  const adminFeatures = [
    "Register and manage authenticated farmer profiles",
    "Broadcast critical SMS alerts to farmer mobile phones",
    "AI Government ID verification (Aadhar, PAN, Ration)",
    "Consult intelligent Agricultural Chat Assistant",
    "Monitor Twilio SMS dispatch history and delivery logs",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gradient-mesh p-4 md:p-8">
      {/* Header Branding */}
      <div className="mb-10 text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-xs font-semibold text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AgriTech v2.0 • Multilingual SMS Advisory</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Welcome to <span className="text-primary">AgriAssist</span> SMS
        </h1>

        <p className="text-sm md:text-base text-muted-foreground">
          Select your portal to continue. Farmers get personalized field tools; Administrators manage farmers and broadcast SMS alerts.
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Farmer Portal Card */}
        <Card className="border border-border/80 bg-card/90 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-primary/10 p-4 rounded-2xl w-fit group-hover:bg-primary/20 transition-colors">
                <Sprout className="w-10 h-10 text-primary transition-transform group-hover:scale-110" />
              </div>
              <div className="pt-3">
                <Badge variant="outline" className="text-xs text-primary bg-primary/5 mb-1">
                  Kisan Suvidha
                </Badge>
                <CardTitle className="text-2xl font-bold">Farmer Portal</CardTitle>
                <CardDescription className="text-xs mt-1">
                  Tailored specifically for growers and agricultural producers
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Included Services:
              </span>
              <ul className="space-y-2">
                {farmerFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </div>

          <CardFooter className="pt-4 border-t">
            <Button asChild size="lg" className="w-full font-semibold gap-2 rounded-xl">
              <Link href="/farmer">
                <span>Enter Farmer Portal</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Admin Portal Card */}
        <Card className="border border-border/80 bg-card/90 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-emerald-500/10 p-4 rounded-2xl w-fit group-hover:bg-emerald-500/20 transition-colors">
                <Shield className="w-10 h-10 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110" />
              </div>
              <div className="pt-3">
                <Badge variant="outline" className="text-xs text-emerald-600 bg-emerald-500/5 mb-1">
                  Admin & Field Agents
                </Badge>
                <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
                <CardDescription className="text-xs mt-1">
                  Manage farmers, dispatch SMS notifications, and track analytics
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Admin Capabilities:
              </span>
              <ul className="space-y-2">
                {adminFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </div>

          <CardFooter className="pt-4 border-t">
            <Button asChild size="lg" variant="outline" className="w-full font-semibold gap-2 rounded-xl border-primary/30 hover:bg-primary/10 text-primary">
              <Link href="/dashboard">
                <span>Enter Admin Dashboard</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <footer className="mt-12 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AgriAssist SMS Platform • Developed for Indian Agriculture
      </footer>
    </div>
  );
}
