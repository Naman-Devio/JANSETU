'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  getChallenge,
  confirmChallenge,
  getUniversityMatches,
  getPartnerMatches,
  findRelatedSolutions,
} from '@/lib/api';
import {
  ChallengeDetail,
  ChallengeStatus,
  PartnerMatch,
  SolutionSummary,
  UniversityMatch,
} from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SpeakButton } from '@/components/ui/SpeakButton';
import {
  MapPin,
  Users,
  Camera,
  Mic,
  FileText,
  GraduationCap,
  Building2,
  Share2,
  ArrowRight,
  Activity,
} from 'lucide-react';

const LIFECYCLE_STAGES: ChallengeStatus[] = [
  'SIGNAL',
  'VALIDATING',
  'VERIFIED',
  'MATCHING',
  'TEAM_FORMED',
  'PROTOTYPE',
  'PILOT',
  'DEPLOYED',
  'IMPACT_MEASURED',
  'REUSABLE',
];

export default function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const challengeId = resolvedParams.id;

  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [univMatches, setUnivMatches] = useState<UniversityMatch[]>([]);
  const [partnerMatches, setPartnerMatches] = useState<PartnerMatch[]>([]);
  const [relatedSolutions, setRelatedSolutions] = useState<SolutionSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [confirmCount, setConfirmCount] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const ch = await getChallenge(challengeId);
        setChallenge(ch);
        setConfirmCount(ch.confirmationCount);

        const [univs, partners, solutions] = await Promise.all([
          getUniversityMatches(challengeId),
          getPartnerMatches(challengeId),
          findRelatedSolutions(challengeId),
        ]);

        setUnivMatches(univs);
        setPartnerMatches(partners);
        setRelatedSolutions(solutions);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [challengeId]);

  const handleConfirm = async () => {
    if (confirmed || !challenge) return;
    const res = await confirmChallenge(challenge.id, 'USR-DEMO-CITIZEN');
    setConfirmCount(res.confirmationCount);
    setConfirmed(true);
  };

  if (loading || !challenge) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-zinc-500">
        Loading challenge intelligence...
      </div>
    );
  }

  const currentStageIndex = LIFECYCLE_STAGES.indexOf(challenge.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Metadata */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/atlas" className="hover:text-white">Problem Atlas</Link>
          <span>/</span>
          <span className="text-blue-400 font-mono font-bold">{challenge.id}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded">
                {challenge.id}
              </span>
              <StatusBadge status={challenge.status} size="md" />
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium">
                Domain: {challenge.domain}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 font-mono">
                {challenge.isDemoData ? 'Demo Dataset' : 'Verified'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {challenge.title}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>{challenge.affectedArea}</span>
              <span className="text-zinc-600">·</span>
              <span>~{challenge.affectedPopulationEstimate.toLocaleString()} Citizens Impacted</span>
            </div>
          </div>

          {/* Quick CTA to Hero Project if PILOT/ACTIVE */}
          {challenge.status === 'PILOT' && (
            <Link
              href="/project/JNP-204"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all w-fit shrink-0"
            >
              <Activity className="w-4 h-4" />
              <span>Open Hero Project (JNP-204)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* CANONICAL 10-STAGE LIFECYCLE PROGRESS BAR (Section 4 & 20) */}
      <div className="p-4 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-zinc-400 uppercase tracking-wider text-[11px]">
            Canonical Lifecycle Progression
          </span>
          <span className="text-blue-400 font-medium text-[11px]">
            Stage {currentStageIndex + 1} of {LIFECYCLE_STAGES.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 text-center text-[10px] font-mono">
          {LIFECYCLE_STAGES.map((st, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={st}
                className={`py-1.5 px-1 rounded-md border transition-all ${
                  isCurrent
                    ? 'bg-blue-600 border-blue-400 text-white font-bold shadow-md shadow-blue-500/20'
                    : isCompleted
                    ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400'
                    : 'bg-[#181d26] border-zinc-800 text-zinc-500'
                }`}
              >
                {isCompleted ? '✓ ' : isCurrent ? '● ' : ''}
                {st.replace('_', ' ')}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Evidence & Story | Right Capability & Matching */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Story & Evidence */}
        <div className="lg:col-span-7 space-y-6">
          {/* Problem Statement */}
          <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono text-[11px]">
                Validated Problem Intelligence
              </h2>
              <SpeakButton text={challenge.problemStatement} label="Listen (AI Voice)" />
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed">
              {challenge.problemStatement}
            </p>

            {/* Evidence & Signals Proof Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80 text-center">
              <div className="p-3 rounded-xl bg-[#181d26] border border-zinc-800">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Independent Signals</div>
                <div className="text-lg font-bold text-white mt-0.5">{challenge.signalCount}</div>
                <div className="text-[10px] text-zinc-500">Citizen Reports</div>
              </div>

              <div className="p-3 rounded-xl bg-[#181d26] border border-zinc-800">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Evidence Uploads</div>
                <div className="text-lg font-bold text-white mt-0.5">{challenge.evidenceCount}</div>
                <div className="text-[10px] text-zinc-500">Photos / Audio / Docs</div>
              </div>

              <div className="p-3 rounded-xl bg-[#181d26] border border-zinc-800">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Confirmations</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">{confirmCount}</div>
                <div className="text-[10px] text-zinc-500">Nearby Residents</div>
              </div>
            </div>
          </div>

          {/* Citizen Confirmation Action Widget */}
          <div className="p-5 rounded-2xl bg-[#12151b] border border-zinc-800 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Do you reside in or near Namkum Block?</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Confirming an ongoing issue strengthens its priority in the university matching queue.
              </p>
            </div>

            <button
              type="button"
              disabled={confirmed}
              onClick={handleConfirm}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                confirmed
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
              }`}
            >
              {confirmed ? '✓ Confirmed by You' : 'Confirm This Issue (+1)'}
            </button>
          </div>

          {/* Evidence Gallery */}
          <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono text-[11px]">
                Citizen Evidence Log ({challenge.evidence.length} Items)
              </h2>
              <span className="text-[11px] text-zinc-400">Verified by Gram Sabha</span>
            </div>

            <div className="space-y-3">
              {challenge.evidence.length === 0 && (
                <p className="text-xs text-zinc-500 italic py-2">
                  No evidence files attached yet. Citizens can upload photos, videos, voice notes and documents via the Report page.
                </p>
              )}
              {challenge.evidence.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#181d26] border border-zinc-800/90 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {(item.type === 'photo') && <Camera className="w-4 h-4 text-blue-400" />}
                      {item.type === 'video' && <FileText className="w-4 h-4 text-violet-400" />}
                      {item.type === 'voice' && <Mic className="w-4 h-4 text-teal-400" />}
                      {item.type === 'document' && <FileText className="w-4 h-4 text-amber-400" />}
                      <span className="font-mono text-zinc-300 font-bold">{item.id}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500">
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {item.caption && (
                    <p className="text-xs text-zinc-300 leading-relaxed italic">
                      &ldquo;{item.caption}&rdquo;
                    </p>
                  )}

                  {/* Video */}
                  {(item.type === 'video' || item.url.endsWith('.mp4') || item.url.endsWith('.mov')) && (
                    <div className="pt-2">
                      <video
                        src={item.url}
                        loop
                        muted
                        playsInline
                        controls
                        {...({ referrerPolicy: 'no-referrer' } as any)}
                        className="w-full h-56 object-cover rounded-lg border border-zinc-800"
                      />
                    </div>
                  )}

                  {/* Photo */}
                  {item.type === 'photo' && !item.url.endsWith('.mp4') && (
                    <div className="pt-2 flex justify-center bg-black/40 p-2 rounded-xl border border-zinc-800/80">
                      <img
                        src={item.url}
                        alt="Evidence"
                        className="max-h-[520px] w-auto max-w-full object-contain rounded-lg shadow-xl"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Voice / audio */}
                  {item.type === 'voice' && (
                    <div className="pt-2">
                      <audio controls src={item.url} className="w-full h-10 rounded-lg" />
                    </div>
                  )}

                  {/* Document */}
                  {item.type === 'document' && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline pt-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Open Document ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: University & Industry Capability Alignment */}
        <div className="lg:col-span-5 space-y-6">
          {/* Required Capabilities Tags */}
          <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-3">
            <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
              Required Technical Capabilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {challenge.requiredExpertise.map((exp, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>

          {/* University Matches (Explainable Capability Scoring) */}
          <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Academic Capability Matches
                </h3>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">Weighted Model</span>
            </div>

            <div className="space-y-4">
              {univMatches.map((univ) => (
                <div
                  key={univ.institutionId}
                  className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white">{univ.institutionName}</h4>
                      <span className="text-[10px] text-zinc-400 font-mono">{univ.institutionId}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold shrink-0">
                      {univ.score}% Match
                    </span>
                  </div>

                  {/* Explainability Breakdown (Section 16: sum must equal score) */}
                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80 space-y-1.5 text-[11px]">
                    <div className="text-[10px] font-mono uppercase text-zinc-400 mb-1">
                      Explainable Scoring Breakdown
                    </div>
                    {univ.breakdown.map((b, idx) => (
                      <div key={idx} className="flex justify-between items-center text-zinc-300">
                        <span className="text-zinc-400 truncate pr-2">{b.label}</span>
                        <span className="font-mono text-zinc-200 shrink-0">+{b.points}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/university/proposals"
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
                  >
                    <span>Form University Team / Proposal</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Partner Matches */}
          <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Industry & CSR Partner Support
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {partnerMatches.map((partner) => (
                <div
                  key={partner.partnerId}
                  className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{partner.partnerName}</h4>
                    <span className="text-xs font-mono text-teal-400 font-bold">{partner.score}% Fit</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-mono text-zinc-400">Can Contribute:</div>
                    <ul className="text-[11px] text-zinc-300 space-y-0.5 list-disc list-inside">
                      {partner.canContribute.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/partner"
                    className="inline-block text-[11px] text-blue-400 hover:underline pt-1"
                  >
                    Submit resource offer →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Related Solutions */}
          {relatedSolutions.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Share2 className="w-4 h-4" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Reusable Solution Blueprints
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                An existing tested blueprint may be adaptable to this challenge.
              </p>
              <div className="space-y-2">
                {relatedSolutions.map((sol) => (
                  <Link
                    key={sol.id}
                    href="/solutions"
                    className="block p-3 rounded-xl bg-[#181d26] border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{sol.title}</span>
                      <span className="text-[10px] text-purple-400 font-mono">
                        {sol.similarityToCurrentChallenge}% Fit
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
