'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  MapPin,
  GraduationCap,
  Building2,
  Activity,
  Share2,
  CheckCircle2,
  Layers,
  Zap,
  Play,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SpeakButton } from '@/components/ui/SpeakButton';

export default function LandingPage() {
  return (
    <div className="space-y-28 pb-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="ambient-glow-blue top-0 left-1/2 -translate-x-1/2 -translate-y-1/3" />
      <div className="ambient-glow-teal top-[40%] right-[-10%]" />
      <div className="ambient-glow-purple top-[70%] left-[-10%]" />

      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-24 lg:pt-28 pb-20 overflow-hidden border-b border-white/10">
        {/* Modern grid backdrop */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#3b82f615_1px,transparent_1px)] [bg-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 text-blue-300 text-xs font-semibold tracking-wide backdrop-blur-md shadow-lg shadow-blue-500/10">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>SIH 2026 Problem Statement SIH26043 · Jharkhand</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Problems are everywhere.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300 drop-shadow-sm">
                Solutions are everywhere too.
              </span>{' '}
              We connect them.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
              JanSetu turns community signals into verified challenges, connects them with academic and industry capabilities, and follows the solution from first report to field deployment.
            </p>

            <div className="flex justify-center pt-1">
              <SpeakButton
                text="JanSetu turns community signals into verified challenges, connects them with academic and industry capabilities, and follows the solution from first report to field deployment."
                label="Listen to Mission (AI Voice)"
              />
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 pt-4 max-w-md sm:max-w-none mx-auto">
              <Link
                href="/citizen/report"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all transform hover:-translate-y-0.5"
              >
                <span>Report a Problem</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('play-jansetu-intro'))}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 hover:text-white font-semibold text-sm backdrop-blur-md transition-all shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-current text-blue-400" />
                <span>Watch Intro Video</span>
              </button>

              <Link
                href="/atlas"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200 font-semibold text-sm backdrop-blur-md transition-all hover:border-white/20"
              >
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Explore Problem Atlas</span>
              </Link>
            </div>

            {/* Live Hero Proof Grid Cards */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 mt-12 text-left">
              <div className="p-4 rounded-2xl glass-card glass-card-hover">
                <div className="text-xs text-zinc-400 font-medium">Canonical Hero Pilot</div>
                <div className="text-base font-extrabold text-white mt-1">JNS-1048</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Namkum Water Station
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-card glass-card-hover">
                <div className="text-xs text-zinc-400 font-medium">Academic Fit</div>
                <div className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300 mt-1">94% Match</div>
                <div className="text-[11px] text-zinc-300 mt-1">BIT Mesra Environmental Lab</div>
              </div>

              <div className="p-4 rounded-2xl glass-card glass-card-hover">
                <div className="text-xs text-zinc-400 font-medium">Industry Partner</div>
                <div className="text-base font-extrabold text-white mt-1">Tata Steel CSR</div>
                <div className="text-[11px] text-zinc-400 mt-1">Prototyping & Sensor Grant</div>
              </div>

              <div className="p-4 rounded-2xl glass-card glass-card-hover">
                <div className="text-xs text-zinc-400 font-medium">Field Impact</div>
                <div className="text-base font-extrabold text-teal-400 mt-1">8,500 Citizens</div>
                <div className="text-[11px] text-zinc-300 mt-1">Safe Potable Water Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 1 — THE SIGNAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Stage 1: The Signal
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
              From raw civic observation to structured challenge intelligence.
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Citizens don’t need to navigate government hierarchy. A natural language voice memo, photo, or short text is automatically structured into domain taxonomy, priority suggestions, and required technical capabilities.
            </p>
            <div className="pt-2">
              <Link
                href="/citizen/report"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Try interactive 5-step report intake</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                Live Intake Transformation
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                Advisory AI Output
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Unstructured citizen signal */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold">Citizen Voice / Text</span>
                <p className="text-xs text-zinc-200 italic leading-relaxed">
                  &ldquo;हमारे गाँव में बोरवेल से 10 दिन से गंदला लाल पानी आ रहा है, पाइपलाइन भी लीक है और कई लोग बीमार हैं।&rdquo;
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] text-zinc-400 font-medium">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Hindi Audio Note</span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Photo Attached</span>
                  <span className="text-blue-400 font-semibold">Namkum, Ranchi</span>
                </div>
              </div>

              {/* Structured intelligence output */}
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-blue-300 font-bold">Structured Challenge</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 font-semibold border border-blue-400/30">96% Conf</span>
                </div>
                <div className="text-xs font-bold text-white">
                  Water & Sanitation · Drinking Water Contamination
                </div>
                <div className="text-[11px] text-zinc-300">
                  Priority: <span className="text-rose-400 font-bold">HIGH</span> · Suggested: Water Chemistry, Adsorption Filtration, IoT Telemetry
                </div>
                <div className="text-[10px] text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-xl p-2 font-medium">
                  Semantic Duplicate: Found 3 related signals nearby (Cluster JNS-1048)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 2 — THE ATLAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-card p-6 sm:p-10 space-y-8 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-blue-400 font-bold tracking-wider">
                <MapPin className="w-4 h-4" /> Stage 2: The Living Civic Atlas
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
                Visualizing Jharkhand&apos;s Societal Demand
              </h2>
            </div>
            <Link
              href="/atlas"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/15 transition-all w-fit shadow-md"
            >
              <span>Open Full Problem Atlas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Atlas preview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl glass-card glass-card-hover space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Namkum Block, Ranchi</span>
                <StatusBadge status="PILOT" size="sm" />
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                Rural Drinking Water Reliability & Multi-Village Borewell Testing (JNS-1048)
              </p>
              <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-3 border-t border-white/10">
                <span>17 Community Signals</span>
                <span className="text-blue-400 font-bold">94% Univ Match</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-card glass-card-hover space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Jharia Coal Belt, Dhanbad</span>
                <StatusBadge status="VERIFIED" size="sm" />
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                Abandoned Open-Cast Mine Acidic Runoff Contaminating Agro Wells (JNS-1012)
              </p>
              <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-3 border-t border-white/10">
                <span>24 Community Signals</span>
                <span className="text-blue-400 font-bold">82% Univ Match</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-card glass-card-hover space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Subarnarekha, Jamshedpur</span>
                <StatusBadge status="PROTOTYPE" size="sm" />
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                Plastic Siltation Choking Subarnarekha Tributary Natural Canals (JNS-1055)
              </p>
              <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-3 border-t border-white/10">
                <span>31 Community Signals</span>
                <span className="text-blue-400 font-bold">84% Univ Match</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 3 — THE MATCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-purple-400" /> Stage 3: Transparent Matching
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
              Transparent capability scoring. Not random numbers.
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Matching relies on structured institutional profiles: domain expertise (35%), faculty expertise (25%), past project fit (15%), laboratory facilities (10%), regional proximity (5%), and team availability (10%).
            </p>
            <div className="pt-2">
              <Link
                href="/university"
                className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span>Inspect university capability workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 space-y-5 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold text-white">BIT Mesra, Ranchi</span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold shadow-sm">
                94% Match Score
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-zinc-300">Domain Expertise (Water Chemistry)</span>
                <span className="font-mono font-bold text-blue-400">+35 pts</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-zinc-300">Faculty Lead (Dr. S. Mukherjee, Environmental Lab)</span>
                <span className="font-mono font-bold text-blue-400">+24 pts</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-zinc-300">Past Project Track Record</span>
                <span className="font-mono font-bold text-blue-400">+13 pts</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-zinc-300">Spectrometry & Materials Testing Facility</span>
                <span className="font-mono font-bold text-blue-400">+9 pts</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-zinc-300">Regional Proximity to Namkum (&lt;18 km)</span>
                <span className="font-mono font-bold text-blue-400">+5 pts</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-zinc-300">Student Innovation Cell Team Availability</span>
                <span className="font-mono font-bold text-blue-400">+8 pts</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-teal-400" />
                <span className="text-zinc-200 font-semibold">Partner: Tata Steel Foundation CSR (92% Fit)</span>
              </div>
              <span className="text-teal-400 text-[11px] font-bold bg-teal-950/60 border border-teal-500/30 px-2.5 py-1 rounded-lg">Testing & Grant Offer</span>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-950/40 via-blue-950/20 to-black/60 p-8 sm:p-14 text-center space-y-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Turn a community signal into something that reaches the ground.
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Experience the complete end-to-end civic innovation journey built for Smart India Hackathon 2026.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/citizen/report"
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
            >
              Start Citizen Report
            </Link>
            <Link
              href="/government/review"
              className="px-7 py-3.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-zinc-200 font-bold text-sm transition-all backdrop-blur-md"
            >
              Open Government Queue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
