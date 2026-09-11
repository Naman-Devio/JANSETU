'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  getProject,
  updateMilestone,
  addPilotEvidence,
  getImpactMetrics,
} from '@/lib/api';
import {
  CANONICAL_PILOT_EVIDENCE,
  CANONICAL_TEAM,
} from '@/lib/mocks/data';
import {
  ChallengeStatus,
  ImpactMetric,
  Milestone,
  PilotEvidence,
  Project,
} from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  CheckCircle2,
  Upload,
  Award,
} from 'lucide-react';

const PROJECT_STAGES: { stage: ChallengeStatus; label: string }[] = [
  { stage: 'SIGNAL', label: '1. Signal' },
  { stage: 'VERIFIED', label: '2. Verified' },
  { stage: 'MATCHING', label: '3. Matched' },
  { stage: 'TEAM_FORMED', label: '4. Team Formed' },
  { stage: 'PROTOTYPE', label: '5. Prototype' },
  { stage: 'PILOT', label: '6. Field Pilot' },
  { stage: 'DEPLOYED', label: '7. Deployed' },
  { stage: 'IMPACT_MEASURED', label: '8. Impact' },
  { stage: 'REUSABLE', label: '9. Reusable' },
];

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [pilotEvidence, setPilotEvidence] = useState<PilotEvidence[]>(CANONICAL_PILOT_EVIDENCE);
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'team' | 'testing' | 'impact'>('overview');
  const [loading, setLoading] = useState<boolean>(true);

  // New evidence form state
  const [newEvidenceNote, setNewEvidenceNote] = useState<string>('');
  const [newEvidenceType, setNewEvidenceType] = useState<PilotEvidence['type']>('test_report');
  const [isUploadingEvidence, setIsUploadingEvidence] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      try {
        const proj = await getProject(projectId);
        setProject(proj);
        setMilestones(proj.milestones);

        const met = await getImpactMetrics(projectId);
        setMetrics(met);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

  const handleToggleMilestone = async (mId: string, currentStatus: Milestone['status']) => {
    const nextStatus = currentStatus === 'DONE' ? 'IN_PROGRESS' : 'DONE';
    const updated = await updateMilestone(mId, { status: nextStatus });
    setMilestones(milestones.map((m) => (m.id === mId ? updated : m)));
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidenceNote.trim()) return;
    setIsUploadingEvidence(true);
    try {
      const added = await addPilotEvidence(projectId, {
        type: newEvidenceType,
        url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
        note: newEvidenceNote,
      });
      setPilotEvidence([added, ...pilotEvidence]);
      setNewEvidenceNote('');
    } finally {
      setIsUploadingEvidence(false);
    }
  };

  if (loading || !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-zinc-500">
        Loading project workspace...
      </div>
    );
  }

  const currentStageIndex = PROJECT_STAGES.findIndex((s) => s.stage === project.stage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href={`/challenge/${project.challengeId}`} className="hover:text-white">
            Challenge {project.challengeId}
          </Link>
          <span>/</span>
          <span className="text-emerald-400 font-mono font-bold">{project.id}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                {project.id}
              </span>
              <StatusBadge status={project.stage} size="md" />
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                Operational State: {project.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-xs text-zinc-400">
              BIT Mesra Environmental Lab × Tata Steel CSR × Namkum Gram Panchayat
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/solutions"
              className="px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Package into Reusable Solution</span>
            </Link>
          </div>
        </div>
      </div>

      {/* PROJECT TIMELINE (Section 20) */}
      <div className="p-4 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-zinc-400 uppercase tracking-wider text-[11px]">
            Project Lifecycle Stage Tracking
          </span>
          <span className="text-emerald-400 font-medium text-[11px]">
            Active Stage: {project.stage}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5 text-center text-[10px] font-mono">
          {PROJECT_STAGES.map((st, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={st.stage}
                className={`py-2 px-1 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-emerald-600 border-emerald-400 text-white font-bold shadow-md'
                    : isCompleted
                    ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400'
                    : 'bg-[#181d26] border-zinc-800 text-zinc-500'
                }`}
              >
                {isCompleted ? '✓ ' : isCurrent ? '● ' : ''}
                {st.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* WORKSPACE TABS (Section 19) */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-px text-xs font-semibold">
        {(
          [
            { id: 'overview', label: 'Overview' },
            { id: 'milestones', label: `Milestones (${milestones.filter(m => m.status === 'DONE').length}/${milestones.length})` },
            { id: 'team', label: 'Multidisciplinary Team' },
            { id: 'testing', label: `Field Testing & Evidence (${pilotEvidence.length})` },
            { id: 'impact', label: 'Measured Outcomes' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-t-xl transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-blue-500 text-white bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-3">
              <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                Pilot Objective & Execution Scope
              </h3>
              <p className="text-sm text-zinc-200 leading-relaxed">
                Deploy 3 demonstration modular gravity biochar-alumina adsorption filtration columns coupled with solar IoT turbidity nodes across 3 high-fluoride/iron borewells in Namkum Block. The system guarantees continuous sub-1.0 NTU potable water delivery to 1,420 households while evaluating community operation and maintenance by village Jal Sahiyas.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Current Status</div>
                <div className="text-base font-bold text-emerald-400 mt-1">45-Day Field Run</div>
                <div className="text-[11px] text-zinc-500">Day 18 of 45 active</div>
              </div>
              <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Water Flow</div>
                <div className="text-base font-bold text-blue-400 mt-1">32,000 L / Day</div>
                <div className="text-[11px] text-zinc-500">Continuous telemetry</div>
              </div>
              <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Turbidity Drop</div>
                <div className="text-base font-bold text-white mt-1">95.4% Reduced</div>
                <div className="text-[11px] text-zinc-500">18.4 NTU → 0.85 NTU</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4">
            <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider border-b border-zinc-800 pb-2">
              Coordinating Partners
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#181d26] border border-zinc-800 space-y-1">
                <div className="text-zinc-400 text-[10px] uppercase font-mono">Academic Lead</div>
                <div className="font-bold text-white">BIT Mesra Ranchi</div>
                <div className="text-zinc-400">Chemical & Environmental Eng.</div>
              </div>
              <div className="p-3 rounded-lg bg-[#181d26] border border-zinc-800 space-y-1">
                <div className="text-zinc-400 text-[10px] uppercase font-mono">CSR Resource Partner</div>
                <div className="font-bold text-teal-400">Tata Steel Foundation</div>
                <div className="text-zinc-400">Testing & Fabrication Support</div>
              </div>
              <div className="p-3 rounded-lg bg-[#181d26] border border-zinc-800 space-y-1">
                <div className="text-zinc-400 text-[10px] uppercase font-mono">Community Governance</div>
                <div className="font-bold text-zinc-200">Namkum Gram Panchayat</div>
                <div className="text-zinc-400">Jal Sahiya Water Committee</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MILESTONES TAB */}
      {activeTab === 'milestones' && (
        <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Project Milestones & Deliverables</h3>
              <p className="text-xs text-zinc-400">
                Click milestone checkbox to test interactive status update.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {milestones.map((ms) => {
              const isDone = ms.status === 'DONE';
              return (
                <div
                  key={ms.id}
                  className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                    isDone
                      ? 'bg-[#181d26]/60 border-zinc-800/60'
                      : 'bg-[#181d26] border-zinc-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleMilestone(ms.id, ms.status)}
                    className="mt-0.5 p-1 rounded-md text-zinc-400 hover:text-white"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-zinc-500" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className={`text-xs font-bold ${isDone ? 'text-zinc-400 line-through' : 'text-white'}`}>
                        {ms.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          isDone
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {ms.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-4 pt-1">
                      <span>Owner: <strong className="text-zinc-300">{ms.owner}</strong></span>
                      <span>Due: <strong className="text-zinc-300">{ms.dueDate}</strong></span>
                      {ms.deliverable && (
                        <span className="text-blue-400">
                          Deliverable: {ms.deliverable}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TEAM TAB */}
      {activeTab === 'team' && (
        <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white">Multidisciplinary Engineering Team</h3>
            <p className="text-xs text-zinc-400">
              Cross-discipline collaboration from Birla Institute of Technology (BIT) Mesra.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-1">
            <div className="text-[10px] uppercase font-mono text-zinc-400">Faculty Mentor Lead</div>
            <div className="text-sm font-bold text-white">{CANONICAL_TEAM.facultyMentor}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CANONICAL_TEAM.members.map((member, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-1">
                <div className="text-xs font-bold text-white">{member.name}</div>
                <div className="text-[11px] text-blue-400 font-mono">{member.discipline}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TESTING & EVIDENCE TAB */}
      {activeTab === 'testing' && (
        <div className="space-y-6">
          {/* Add Evidence Box */}
          <form onSubmit={handleAddEvidence} className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Attach Field Pilot Evidence / Measurement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300">Evidence Type</label>
                <select
                  value={newEvidenceType}
                  onChange={(e) => setNewEvidenceType(e.target.value as PilotEvidence['type'])}
                  className="w-full rounded-lg bg-[#181d26] border border-zinc-700 p-2.5 text-xs text-white"
                >
                  <option value="test_report">Lab Test Report</option>
                  <option value="measurement">Sensor Telemetry Log</option>
                  <option value="photo">Field Photo</option>
                  <option value="video">Field Video</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-zinc-300">Measurement Note / Certification</label>
                <input
                  type="text"
                  placeholder="e.g. Iron concentration verified at 0.12 mg/L after 200 hours backwash."
                  value={newEvidenceNote}
                  onChange={(e) => setNewEvidenceNote(e.target.value)}
                  className="w-full rounded-lg bg-[#181d26] border border-zinc-700 p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isUploadingEvidence || !newEvidenceNote.trim()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingEvidence ? 'Uploading...' : 'Attach Pilot Evidence'}</span>
              </button>
            </div>
          </form>

          {/* Evidence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pilotEvidence.map((ev) => (
              <div
                key={ev.id}
                className="p-5 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-blue-400">{ev.id}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {ev.type.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-zinc-200 leading-relaxed bg-[#181d26] p-3 rounded-xl border border-zinc-800/80">
                  {ev.note}
                </p>

                {ev.url !== '#' && (ev.url.endsWith('.mp4') || ev.type === 'video') ? (
                  <video
                    src={ev.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="w-full h-52 object-cover rounded-xl border border-zinc-800"
                  />
                ) : ev.url !== '#' ? (
                  <img
                    src={ev.url}
                    alt="Pilot testing"
                    className="w-full h-44 object-cover rounded-xl border border-zinc-800"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/1663908248_delhi-rain.jpg';
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMPACT TAB (Section 21) */}
      {activeTab === 'impact' && (
        <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white">Provenanced Impact Metrics</h3>
            <p className="text-xs text-zinc-400">
              Every displayed metric requires Source · Date · Method provenance per Section 21.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics.map((met) => (
              <div
                key={met.id}
                className="p-5 rounded-xl bg-[#181d26] border border-zinc-800 space-y-2"
              >
                <div className="text-[11px] font-mono uppercase text-zinc-400">
                  {met.label}
                </div>
                <div className="text-xl font-extrabold text-emerald-400">
                  {met.value}
                </div>

                <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                  <div>Source: <strong className="text-zinc-200">{met.source}</strong></div>
                  <div>Date: <strong className="text-zinc-200">{met.date}</strong></div>
                  <div>Method: <strong className="text-zinc-200">{met.method}</strong></div>
                </div>

                <div className="pt-1">
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                    Demo Metric · Illustrative
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
