'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listSolutions } from '@/lib/api';
import { SolutionSummary } from '@/types';
import {
  FolderGit2,
  Filter,
  Share2,
  ExternalLink,
} from 'lucide-react';

export default function SolutionLibraryPage() {
  const [solutions, setSolutions] = useState<SolutionSummary[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [adaptedMessage, setAdaptedMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await listSolutions(
        selectedDomain !== 'ALL' ? { domain: selectedDomain } : undefined
      );
      setSolutions(data);
      setLoading(false);
    }
    load();
  }, [selectedDomain]);

  const handleRequestAdaptation = (title: string) => {
    setAdaptedMessage(`Adaptation package for "${title}" prepared. Ready to deploy to new panchayat.`);
    setTimeout(() => setAdaptedMessage(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header (Section 22) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-mono uppercase tracking-wider mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>Civic Knowledge Repository</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Reusable Solution Library
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Successful field projects don&apos;t end at deployment. Discover tested technical blueprints, sensor designs, and operational SOPs to adapt across Jharkhand.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="rounded-lg bg-[#12151b] border border-zinc-700 px-3 py-1.5 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Domains</option>
            <option value="Water & Sanitation">Water & Sanitation</option>
            <option value="Environmental Monitoring">Environmental Monitoring</option>
            <option value="Healthcare Access">Healthcare Access</option>
          </select>
        </div>
      </div>

      {adaptedMessage && (
        <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-200 text-xs flex items-center justify-between animate-fadeIn">
          <span>{adaptedMessage}</span>
          <button
            type="button"
            onClick={() => setAdaptedMessage(null)}
            className="text-purple-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Solutions Grid */}
      {loading ? (
        <div className="p-20 text-center text-xs text-zinc-500">Loading open solutions...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((sol) => (
            <div
              key={sol.id}
              className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4 hover:border-zinc-700 transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded">
                  {sol.id}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium">
                  {sol.domain}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white leading-snug">
                  {sol.title}
                </h3>
                <div className="text-[11px] text-zinc-400">
                  Origin Challenge:{' '}
                  <Link
                    href={`/challenge/${sol.originChallengeId}`}
                    className="text-blue-400 hover:underline font-mono"
                  >
                    {sol.originChallengeId}
                  </Link>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#181d26] border border-zinc-800/80 space-y-1.5 text-xs text-zinc-300">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Package Includes</div>
                <div className="text-[11px] text-zinc-400 flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded bg-zinc-800">CAD / Hardware Schematics</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800">SOP Hindi Manual</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800">Bill of Materials</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <Link
                  href={`/challenge/${sol.originChallengeId}`}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <span>View Origin Project</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleRequestAdaptation(sol.title)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Request Adaptation</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
