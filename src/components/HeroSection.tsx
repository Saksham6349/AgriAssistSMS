'use client';

import { ArrowRight, ChevronDown, ChevronRight, Leaf, Menu, X, Sparkles, Sprout, Shield, Smartphone, Globe } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';

export function HeroSection() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      setMenuOpen(false);
    }

    if (menuOpen) {
      document.addEventListener('keydown', onKey);
      document.addEventListener('click', onClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClickOutside);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const stats = [
    { value: '2,200+', label: 'Soil Profiles Trained', desc: 'ICAR Crop Dataset' },
    { value: '38', label: 'Plant Disease Classes', desc: 'Kaggle CV Dataset' },
    { value: '10', label: 'Indian Languages', desc: 'Text & Voice TTS' },
    { value: '160', label: 'Char Concise SMS', desc: 'Zero Internet Needed' },
  ];

  return (
    <section className="relative w-full overflow-hidden text-white pt-4 pb-20">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-4 md:px-12 lg:px-20 max-w-7xl mx-auto w-full z-20 relative">
        <Link href="/" aria-label="AgriAssist SMS home" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 rounded-2xl group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl tracking-tight text-white">AgriAssist</span>
            <span className="text-xs font-bold px-1.5 py-0.5 bg-emerald-500/30 text-emerald-300 rounded font-mono border border-emerald-400/30">
              SMS
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div
          id="menu"
          ref={menuRef}
          className={[
            'max-md:fixed max-md:top-0 max-md:left-0 max-md:transition-all max-md:duration-300 max-md:overflow-hidden max-md:h-screen max-md:bg-slate-950/95 max-md:backdrop-blur-xl z-50',
            'flex items-center gap-8 font-medium text-sm',
            'max-md:flex-col max-md:justify-center max-md:w-full',
            menuOpen ? 'max-md:opacity-100 max-md:pointer-events-auto' : 'max-md:opacity-0 max-md:pointer-events-none md:opacity-100',
          ].join(' ')}
          aria-hidden={!menuOpen}
        >
          <a href="#features" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-emerald-400 transition-colors">Features</a>
          <a href="#ml-models" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-emerald-400 transition-colors">ML Models</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-emerald-400 transition-colors">How It Works</a>
          <a href="#testimonials" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-emerald-400 transition-colors">Impact</a>

          <div className="flex flex-col gap-3 mt-4 md:hidden w-3/4 max-w-xs">
            <Link href="/farmer" onClick={() => setMenuOpen(false)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-center px-6 py-3 rounded-full font-semibold transition shadow-lg">
              Farmer Portal
            </Link>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-center px-6 py-3 rounded-full font-semibold transition">
              Admin Portal
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(false)}
            className="md:hidden absolute top-6 right-6 bg-white/10 text-white p-2.5 rounded-full"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/farmer"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-500/25 hover:scale-105"
          >
            <Sprout className="w-4 h-4 text-slate-950" />
            <span>Farmer Portal</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all backdrop-blur-md"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Admin Portal</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          id="open-menu"
          onClick={() => setMenuOpen(true)}
          className="md:hidden bg-white/10 text-white p-2 rounded-xl backdrop-blur-md border border-white/10"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Hero Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-16 md:pt-24 text-center relative z-10 space-y-6">
        {/* Floating Feature Chip */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md text-emerald-300 text-xs md:text-sm font-medium animate-pulse">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Next-Gen Agricultural Intelligence: Machine Learning & SMS</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] text-white">
          Empowering Every Farmer with <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-200 bg-clip-text text-transparent">AI & ML Insights</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl mx-auto max-w-3xl text-emerald-100/80 leading-relaxed font-normal">
          Bridge the agricultural digital divide with precision soil crop recommendation, instant leaf disease diagnosis, and localized weather insights—delivered directly to any mobile phone via SMS without requiring internet.
        </p>

        {/* Main CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/role-selection"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-xl hover:shadow-emerald-500/30 hover:scale-105"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </Link>

          <Link
            href="/crop-recommendation"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-4 rounded-2xl font-semibold text-base transition-all backdrop-blur-md hover:border-emerald-400/50"
          >
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span>Try Crop ML Model</span>
          </Link>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-4xl mx-auto">
          {stats.map(s => (
            <div
              key={s.label}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left space-y-1 hover:border-emerald-500/30 transition-colors"
            >
              <strong className="text-2xl md:text-3xl font-extrabold text-white block">
                {s.value}
              </strong>
              <span className="text-xs font-semibold text-emerald-300 block">
                {s.label}
              </span>
              <span className="text-[11px] text-white/60 block">
                {s.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
