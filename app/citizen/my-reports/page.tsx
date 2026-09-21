'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyReports } from '@/lib/api';
import { ChallengeSummary } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MapPin, PlusCircle, ArrowRight } from 'lucide-react';

export default function MyReportsPage() {
  const [reports, setReports] = useState<ChallengeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReports('USR-DEMO-CITIZEN').then((data) => {
      let localItems: ChallengeSummary[] = [];
      try {
        localItems = JSON.parse(localStorage.getItem('jansetu_local_reports') || '[]');
      } catch (e) {
        console.warn('LocalStorage load error:', e);
      }

      // Merge and deduplicate by ID
      const combinedMap = new Map<string, ChallengeSummary>();
      localItems.forEach((item) => combinedMap.set(item.id, item));
      data.forEach((item) => combinedMap.set(item.id, item));

      setReports(Array.from(combinedMap.values()));
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Submitted Signals
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track your community submissions as they move through verification, matching, and pilot deployment.
          </p>
        </div>
        <Link
          href="/citizen/report"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md w-fit"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Report New Problem</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-500">Loading your signals...</div>
      ) : reports.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#12151b] border border-zinc-800 text-center space-y-4">
          <p className="text-sm text-zinc-400">You haven&apos;t submitted any community signals yet.</p>
          <Link
            href="/citizen/report"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
          >
            Submit your first report →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reports.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#12151b] border border-zinc-800 hover:border-zinc-700 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-blue-400">{item.id}</span>
                  <StatusBadge status={item.status} size="sm" />
                  <span className="text-xs text-zinc-400 font-medium">Domain: {item.domain}</span>
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  <span>{item.affectedArea}</span>
                </div>
              </div>

              <h3 className="text-base font-semibold text-white">
                <Link href={`/challenge/${item.id}`} className="hover:text-blue-400 transition-colors">
                  {item.title}
                </Link>
              </h3>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-800/80 text-xs text-zinc-400">
                <div className="flex items-center gap-4 text-[11px]">
                  <span>Signals: <strong className="text-zinc-200">{item.signalCount}</strong></span>
                  <span>Evidence: <strong className="text-zinc-200">{item.evidenceCount}</strong></span>
                  <span>Confirmations: <strong className="text-zinc-200">{item.confirmationCount}</strong></span>
                </div>

                <Link
                  href={`/challenge/${item.id}`}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  <span>Track Full Lifecycle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
