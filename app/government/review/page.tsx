'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listChallenges, verifyChallenge } from '@/lib/api';
import { ChallengeSummary } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  ShieldAlert,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function GovernmentReviewQueuePage() {
  const [challenges, setChallenges] = useState<ChallengeSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [auditNotice, setAuditNotice] = useState<string | null>(null);

  const refreshQueue = async () => {
    setLoading(true);
    const data = await listChallenges();
    setChallenges(data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    listChallenges().then((data) => {
      if (active) {
        setChallenges(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleVerify = async (chId: string) => {
    await verifyChallenge(chId, 'VERIFIED');
    setAuditNotice(`Challenge ${chId} successfully marked as VERIFIED. Audit log written to state ledger.`);
    refreshQueue();
    setTimeout(() => setAuditNotice(null), 5000);
  };

  const handleReject = async (chId: string) => {
    await verifyChallenge(chId, 'REJECTED');
    setAuditNotice(`Challenge ${chId} marked as REJECTED / SPAM.`);
    refreshQueue();
    setTimeout(() => setAuditNotice(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header (Section 23) */}
      <div className="p-6 rounded-2xl bg-[#0a0d14]/85 border border-zinc-800/80 backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>State Moderator & Oversight Queue</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
            Signal Verification Queue
          </h1>
          <p className="text-xs font-medium text-zinc-200 max-w-2xl leading-relaxed">
            Review incoming citizen problem signals, examine uploaded evidence, resolve potential duplicates, and verify challenges to open university capability matching.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/government"
            className="px-4 py-2.5 rounded-xl bg-[#141923] hover:bg-[#1f2636] text-white text-xs font-bold border border-zinc-700/80 shadow-md transition-all"
          >
            Executive Command Center →
          </Link>
        </div>
      </div>

      {auditNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{auditNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setAuditNotice(null)}
            className="text-emerald-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Verification Table */}
      <div className="rounded-2xl border border-zinc-800 bg-[#12151b] overflow-hidden shadow-xl">
        <div className="p-4 bg-[#181d26] border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Active Challenges Awaiting / Operating Under Verification ({challenges.length})
          </span>
          <button
            type="button"
            onClick={refreshQueue}
            className="text-zinc-400 hover:text-white text-xs flex items-center gap-1 font-mono"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh Queue</span>
          </button>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-zinc-500">Loading moderation queue...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#151921] text-zinc-400 border-b border-zinc-800 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Challenge ID</th>
                  <th className="py-3 px-4">Title & Context</th>
                  <th className="py-3 px-4">Area / District</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Signals</th>
                  <th className="py-3 px-4 text-center">Evidence</th>
                  <th className="py-3 px-4 text-right">Moderator Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {challenges.map((ch) => {
                  const isPendingReview = ch.status === 'VALIDATING' || ch.status === 'SIGNAL';
                  return (
                    <tr key={ch.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-blue-400">{ch.id}</td>
                      <td className="py-4 px-4 max-w-sm space-y-1">
                        <Link
                          href={`/challenge/${ch.id}`}
                          className="font-semibold text-white hover:text-blue-400 transition-colors block"
                        >
                          {ch.title}
                        </Link>
                        <span className="text-[11px] text-zinc-400 block">{ch.domain}</span>
                      </td>
                      <td className="py-4 px-4 text-zinc-400">{ch.affectedArea}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={ch.status} size="sm" />
                      </td>
                      <td className="py-4 px-4 text-center font-mono">{ch.signalCount}</td>
                      <td className="py-4 px-4 text-center font-mono">{ch.evidenceCount}</td>
                      <td className="py-4 px-4 text-right space-x-2">
                        {isPendingReview ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleVerify(ch.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-all"
                            >
                              Verify Challenge
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(ch.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-rose-300 font-semibold text-[11px] border border-zinc-700"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <Link
                            href={`/challenge/${ch.id}`}
                            className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:underline font-semibold"
                          >
                            <span>Inspect Detail</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
