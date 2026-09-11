'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getChallenge, getUniversityMatches } from '@/lib/api';
import { ChallengeDetail, UniversityMatch } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  GraduationCap,
  Users,
  FileCheck,
  ArrowRight,
} from 'lucide-react';

export default function UniversityDashboardPage() {
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [matches, setMatches] = useState<UniversityMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      const ch = await getChallenge('JNS-1048');
      const m = await getUniversityMatches('JNS-1048');
      setChallenge(ch);
      setMatches(m);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !challenge) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-zinc-500">
        Loading university recommendations...
      </div>
    );
  }

  const primaryMatch = matches[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Header (Section 17) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-mono uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Institution Capability Portal · BIT Mesra</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Challenges that match what we can build.
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Autonomous capability alignment matching verified Jharkhand societal problems with academic faculty labs, research facilities, and student multidisciplinary teams.
          </p>
        </div>

        <Link
          href="/university/proposals"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all w-fit"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Create Team & Submit Proposal</span>
        </Link>
      </div>

      {/* Featured High-Fit Match Card */}
      <div className="p-6 lg:p-8 rounded-2xl bg-[#12151b] border border-zinc-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded">
              {challenge.id}
            </span>
            <StatusBadge status={challenge.status} size="sm" />
            <span className="text-xs text-zinc-400 font-medium">Domain: {challenge.domain}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Institutional Match:</span>
            <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded">
              {primaryMatch.score}% Capability Fit
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-bold text-white leading-snug">
              {challenge.title}
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed bg-[#181d26] p-4 rounded-xl border border-zinc-800">
              {challenge.problemStatement}
            </p>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-lg bg-[#181d26] border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Signals</div>
                <div className="text-base font-bold text-white mt-0.5">{challenge.signalCount}</div>
              </div>
              <div className="p-3 rounded-lg bg-[#181d26] border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Evidence</div>
                <div className="text-base font-bold text-white mt-0.5">{challenge.evidenceCount}</div>
              </div>
              <div className="p-3 rounded-lg bg-[#181d26] border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Population</div>
                <div className="text-base font-bold text-white mt-0.5">
                  ~{challenge.affectedPopulationEstimate.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-zinc-400">
                Required Institutional Competencies
              </div>
              <div className="flex flex-wrap gap-1.5">
                {challenge.requiredExpertise.map((exp, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Explainable Capability Breakdown (Section 16) */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-[#181d26] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Why BIT Mesra Matches ({primaryMatch.score}%)
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Weighted Total</span>
            </div>

            <div className="space-y-2 text-xs">
              {primaryMatch.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 border-b border-zinc-800/60 last:border-0"
                >
                  <span className="text-zinc-300 text-[11px] pr-2">{item.label}</span>
                  <span className="font-mono text-zinc-100 font-bold shrink-0">+{item.points} pts</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/university/proposals"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                <span>Draft Proposal with BIT Faculty Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Active Teams & Proposals Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Registered Student-Faculty Teams</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">1 Active</span>
          </div>

          <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Water Innovation Cell</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded">
                Assigned
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Mentor: Dr. S. Mukherjee · 4 Student Contributors (Chemical, IoT, Civil, Analytics)
            </p>
            <div className="text-[11px] text-zinc-500 pt-1">
              Active Project: Community Water Monitoring (JNP-204)
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Submitted Technical Proposals</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">1 Accepted</span>
          </div>

          <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                Biochar-Alumina Adsorption Cartridge
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded">
                Accepted (Field Pilot)
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Target: sub-1.0 NTU turbidity · Duration: 8 weeks · Partner: Tata Steel CSR Support
            </p>
            <div className="pt-2">
              <Link
                href="/project/JNP-204"
                className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>View Field Pilot Execution Workspace</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
