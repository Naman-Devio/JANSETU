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
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SpeakButton } from '@/components/ui/SpeakButton';

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION (Section 8) */}
      <section className="relative pt-12 md:pt-20 lg:pt-24 overflow-hidden border-b border-zinc-800/80 pb-20">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f243015_1px,transparent_1px),linear-gradient(to_bottom,#1f243015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 text-blue-300 text-xs font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>SIH 2026 Problem Statement SIH26043 · Jharkhand</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Problems are everywhere.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300">
                Solutions are everywhere too.
              </span>{' '}
              We connect them.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              JanSetu turns community signals into verified challenges, connects them with academic and industry capabilities, and follows the solution from first report to field deployment.
            </p>
            <div className="flex justify-center pt-1">
              <SpeakButton
                text="JanSetu turns community signals into verified challenges, connects them with academic and industry capabilities, and follows the solution from first report to field deployment."
                label="Listen to Mission (AI Voice)"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/citizen/report"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Report a Problem</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/atlas"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm transition-all"
              >
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Explore the Atlas</span>
              </Link>
              <Link
                href="/how-it-works"
                className="px-4 py-3.5 text-zinc-400 hover:text-white font-medium text-sm transition-colors"
              >
                See how it works →
              </Link>
            </div>

            {/* Live Hero Proof Bar */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-800/80 mt-12 text-left">
              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 font-medium">Canonical Hero Pilot</div>
                <div className="text-sm font-bold text-white mt-0.5">JNS-1048</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Namkum Water Station
                </div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 font-medium">Academic Fit</div>
                <div className="text-sm font-bold text-white mt-0.5">94% Match</div>
                <div className="text-[11px] text-blue-400">BIT Mesra Environmental Lab</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 font-medium">Industry Partner</div>
                <div className="text-sm font-bold text-white mt-0.5">Tata Steel CSR</div>
                <div className="text-[11px] text-zinc-400">Prototyping & Sensor Grant</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 font-medium">Field Impact</div>
                <div className="text-sm font-bold text-white mt-0.5">8,500 Citizens</div>
                <div className="text-[11px] text-teal-400">Safe Potable Water Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION A — THE SIGNAL (Citizen report to structured intelligence) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950/50 border border-blue-800/60 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Stage 1: The Signal
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From raw civic observation to structured challenge intelligence.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Citizens don’t need to navigate government hierarchy. A natural language voice memo, photo, or short text is automatically structured into domain taxonomy, priority suggestions, and required technical capabilities.
            </p>
            <div className="pt-2">
              <Link
                href="/citizen/report"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                Try the interactive 5-step report intake →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#12151b] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Live Intake Transformation
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-medium">
                Advisory AI Output
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Unstructured citizen signal */}
              <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800/80 space-y-2">
                <span className="text-[11px] font-mono uppercase text-zinc-400">Citizen Voice / Text</span>
                <p className="text-xs text-zinc-300 italic leading-relaxed">
                  &ldquo;हमारे गाँव में बोरवेल से 10 दिन से गंदला लाल पानी आ रहा है, पाइपलाइन भी लीक है और कई लोग बीमार हैं।&rdquo;
                </p>
                <div className="pt-2 flex items-center gap-2 text-[10px] text-zinc-400">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800">Hindi Audio Note</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800">Photo Attached</span>
                  <span>Namkum, Ranchi</span>
                </div>
              </div>

              {/* Structured intelligence output */}
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-blue-300 font-semibold">Structured Challenge</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200">96% Conf</span>
                </div>
                <div className="text-xs font-semibold text-white">
                  Water & Sanitation · Drinking Water Contamination
                </div>
                <div className="text-[11px] text-zinc-400">
                  Priority: <span className="text-rose-400 font-medium">HIGH</span> · Suggested: Water Chemistry, Adsorption Filtration, IoT Telemetry
                </div>
                <div className="text-[10px] text-amber-300 bg-amber-950/40 border border-amber-800/40 rounded p-1.5">
                  Semantic Duplicate: Found 3 related signals nearby (Cluster JNS-1048)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — THE ATLAS (Problem Atlas Teaser) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-800 bg-[#12151b] p-6 lg:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-blue-400 tracking-wider">
                <MapPin className="w-3.5 h-3.5" /> Stage 2: The Living Civic Atlas
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Visualizing Jharkhand&apos;s Societal Demand
              </h2>
            </div>
            <Link
              href="/atlas"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-zinc-700 transition-colors w-fit"
            >
              Open Full Problem Atlas →
            </Link>
          </div>

          {/* Atlas preview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Namkum Block, Ranchi</span>
                <StatusBadge status="PILOT" size="sm" />
              </div>
              <p className="text-xs text-zinc-300 line-clamp-2">
                Rural Drinking Water Reliability & Multi-Village Borewell Testing (JNS-1048)
              </p>
              <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <span>17 Community Signals</span>
                <span className="text-blue-400 font-semibold">94% Univ Match</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Jharia Coal Belt, Dhanbad</span>
                <StatusBadge status="VERIFIED" size="sm" />
              </div>
              <p className="text-xs text-zinc-300 line-clamp-2">
                Abandoned Open-Cast Mine Acidic Runoff Contaminating Agro Wells (JNS-1012)
              </p>
              <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <span>24 Community Signals</span>
                <span className="text-blue-400 font-semibold">82% Univ Match</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Subarnarekha, Jamshedpur</span>
                <StatusBadge status="PROTOTYPE" size="sm" />
              </div>
              <p className="text-xs text-zinc-300 line-clamp-2">
                Plastic Siltation Choking Subarnarekha Tributary Natural Canals (JNS-1055)
              </p>
              <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <span>31 Community Signals</span>
                <span className="text-blue-400 font-semibold">84% Univ Match</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C — THE MATCH (Capability Matching) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-950/50 border border-indigo-800/60 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" /> Stage 3: Explainable Matching
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Transparent capability scoring. Not random numbers.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Matching relies on structured institutional profiles: domain expertise (35%), faculty expertise (25%), past project fit (15%), laboratory facilities (10%), regional proximity (5%), and team availability (10%).
            </p>
            <div className="pt-2">
              <Link
                href="/university"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Inspect university capability workspace →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#12151b] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">BIT Mesra, Ranchi</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800 font-mono font-bold">
                94% Match Score
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Domain Expertise (Water Chemistry)</span>
                <span className="font-mono text-zinc-200">+35 pts</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Faculty Lead (Dr. S. Mukherjee, Environmental Lab)</span>
                <span className="font-mono text-zinc-200">+24 pts</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Past Project Track Record</span>
                <span className="font-mono text-zinc-200">+13 pts</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Spectrometry & Materials Testing Facility</span>
                <span className="font-mono text-zinc-200">+9 pts</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Regional Proximity to Namkum (&lt;18 km)</span>
                <span className="font-mono text-zinc-200">+5 pts</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">Student Innovation Cell Team Availability</span>
                <span className="font-mono text-zinc-200">+8 pts</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-400" />
                <span className="text-zinc-300">Partner: Tata Steel Foundation CSR (92% Fit)</span>
              </div>
              <span className="text-teal-400 text-[11px] font-medium">Testing & Grant Offer</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D — THE BUILD & IMPACT (Project Lifecycle) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-800 bg-[#12151b] p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-emerald-400 tracking-wider">
                <Activity className="w-3.5 h-3.5" /> Stage 4 & 5: Build, Pilot & Measured Impact
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Canonical Hero Project: JNP-204
              </h2>
            </div>
            <Link
              href="/project/JNP-204"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-colors w-fit"
            >
              Open Project Workspace →
            </Link>
          </div>

          {/* Canonical Timeline */}
          <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-3">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Canonical 10-Stage Lifecycle Progress
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
                1. SIGNAL ✓
              </div>
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
                2. VERIFIED ✓
              </div>
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
                3. MATCHED ✓
              </div>
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
                4. PROTOTYPE ✓
              </div>
              <div className="p-2 rounded bg-emerald-900 text-white font-bold border border-emerald-500 shadow-md">
                5. PILOT ● Active
              </div>
            </div>
          </div>

          {/* Outcome Provenance Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-1.5">
              <div className="text-[11px] text-zinc-400 uppercase font-mono">Verified Metric</div>
              <div className="text-lg font-bold text-white">8,500 Citizens</div>
              <p className="text-xs text-zinc-300">1,420 households with potable water access</p>
              <div className="pt-2 text-[10px] text-zinc-500 border-t border-zinc-800">
                Source: Namkum Gram Panchayat Audit (Aug 2026)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-1.5">
              <div className="text-[11px] text-zinc-400 uppercase font-mono">Laboratory Proof</div>
              <div className="text-lg font-bold text-emerald-400">95.4% Turbidity Drop</div>
              <p className="text-xs text-zinc-300">Iron reduced to 0.14 mg/L (WHO standard)</p>
              <div className="pt-2 text-[10px] text-zinc-500 border-t border-zinc-800">
                Source: BIT Mesra Spectrometry Assay (Aug 2026)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-1.5">
              <div className="text-[11px] text-zinc-400 uppercase font-mono">Continuous Telemetry</div>
              <div className="text-lg font-bold text-blue-400">32,000 L / Day</div>
              <p className="text-xs text-zinc-300">Solar IoT in-line flow delivery sensor</p>
              <div className="pt-2 text-[10px] text-zinc-500 border-t border-zinc-800">
                Source: AquaTech Telemetry Node (Sep 2026)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-1.5">
              <div className="text-[11px] text-zinc-400 uppercase font-mono">Turnaround Time</div>
              <div className="text-lg font-bold text-teal-400">14 Days → 4 Hours</div>
              <p className="text-xs text-zinc-300">Borewell outage alert to maintenance</p>
              <div className="pt-2 text-[10px] text-zinc-500 border-t border-zinc-800">
                Source: Jal Sahiya Operations Telemetry
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E — REUSE (Solution Library Preview) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-950/50 border border-purple-800/60 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Share2 className="w-3.5 h-3.5" /> Stage 6: Reusable Solution Network
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Solutions don&apos;t disappear after completion.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              When a project succeeds, it is packaged into the open Solution Library. Future challenges in similar geological or civic conditions can discover, adapt, and deploy existing blueprints rather than starting from scratch.
            </p>
            <div className="pt-2">
              <Link
                href="/solutions"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
              >
                Browse open solution blueprints →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#12151b] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="p-3.5 rounded-xl bg-[#181d26] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Gravity Biochar-Alumina Adsorption Cartridge
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  98% Match for Iron Wells
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Origin: Namkum Pilot (JNS-1048) · Cost: ₹3,500 / unit · Operational blueprint with local bamboo biochar preparation.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#181d26] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Low-Power Optical Turbidity IoT Sentinel
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Hardware Blueprint
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Origin: JNP-204 · Open ESP32 firmware + solar charging circuit with SMS alert fallback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA (Section 8 / 9 Section G) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-blue-900/50 bg-gradient-to-b from-blue-950/30 to-[#12151b] p-8 md:p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Turn a community signal into something that reaches the ground.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Experience the complete end-to-end civic innovation journey built for Smart India Hackathon 2026.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/citizen/report"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all"
            >
              Start Citizen Report
            </Link>
            <Link
              href="/government/review"
              className="px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm transition-all"
            >
              Open Government Review Queue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
