"use client";

import Link from 'next/link';
import { UserManagement } from '@/components/UserManagement';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sprout,
  Stethoscope,
  Sun,
  TrendingUp,
  MessageSquareWarning,
  Bot,
  Users,
  Cpu,
  Radio,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function DashboardPage() {
  const { registeredFarmer, smsHistory } = useAppContext();

  const quickActions = [
    {
      title: 'ML Crop Recommender',
      desc: 'Predict best crops using soil N-P-K & climate values',
      href: '/crop-recommendation',
      icon: Sprout,
      badge: 'ML 99.5%',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Crop Disease Diagnosis',
      desc: 'Computer vision analysis across 38 leaf classes',
      href: '/diagnosis',
      icon: Stethoscope,
      badge: 'CV AI',
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Weather Advisory',
      desc: 'Hyperlocal forecast with SMS translation',
      href: '/weather',
      icon: Sun,
      badge: 'Live',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Mandi Market Rates',
      desc: 'Indicative mandi prices for selling decisions',
      href: '/market-prices',
      icon: TrendingUp,
      badge: 'Rates',
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 md:p-10 shadow-xl border border-emerald-700/50">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-emerald-200 border border-white/10">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Operational Control</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Agricultural Intelligence Dashboard
          </h1>

          <p className="text-sm md:text-base text-emerald-100/90 leading-relaxed">
            Manage farmer registrations, run Machine Learning soil models, diagnose crop diseases, and broadcast 160-character localized SMS advisories.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="sm" className="bg-white text-emerald-900 hover:bg-white/90 font-semibold gap-1.5 rounded-full px-5">
              <Link href="/crop-recommendation">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Run Crop ML Model</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-5">
              <Link href="/chat">
                <Bot className="w-4 h-4 mr-1.5" />
                <span>AI Chat Assistant</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative background glow rings */}
        <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-32 top-0 w-64 h-64 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/70 backdrop-blur-sm border-border/80 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Registered Farmer</span>
              <strong className="text-lg font-bold text-foreground">
                {registeredFarmer ? registeredFarmer.name : '0 Registered'}
              </strong>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70 backdrop-blur-sm border-border/80 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 rounded-2xl text-sky-600 dark:text-sky-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">ML Model Accuracy</span>
              <strong className="text-lg font-bold text-foreground">95.0% (ICAR)</strong>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70 backdrop-blur-sm border-border/80 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 rounded-2xl text-purple-600 dark:text-purple-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">SMS Dispatched</span>
              <strong className="text-lg font-bold text-foreground">{smsHistory.length} Messages</strong>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70 backdrop-blur-sm border-border/80 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Languages</span>
              <strong className="text-lg font-bold text-foreground">10 Indian Dialects</strong>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-foreground uppercase tracking-wider text-muted-foreground">
          Quick Launch Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href} className="group">
                <Card className="h-full border border-border/80 bg-card hover:border-primary/40 hover:shadow-md transition-all group-hover:-translate-y-0.5">
                  <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border ${action.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {action.badge}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {action.desc}
                      </p>
                    </div>

                    <div className="flex items-center text-xs font-semibold text-primary pt-1">
                      <span>Launch Tool</span>
                      <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Farmer Registration & Management Module */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground uppercase tracking-wider text-muted-foreground">
            Farmer Profile & Registration
          </h2>
        </div>
        <UserManagement isAdmin={true} />
      </div>
    </div>
  );
}
