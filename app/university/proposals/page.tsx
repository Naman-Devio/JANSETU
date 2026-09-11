'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { acceptProposal, createTeam, submitProposal } from '@/lib/api';
import {
  Users,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  Plus,
  Trash2,
} from 'lucide-react';

export default function UniversityProposalsPage() {
  const router = useRouter();

  // Team creation states
  const [facultyMentor, setFacultyMentor] = useState<string>(
    'Dr. S. Mukherjee (Dept of Chemical & Environmental Engineering, BIT Mesra)'
  );
  const [members, setMembers] = useState<{ name: string; discipline: string }[]>([
    { name: 'Ananya Sharma', discipline: 'Chemical Engineering (Final Year)' },
    { name: 'Rohan Soren', discipline: 'IoT & Embedded Systems' },
    { name: 'Priya Kispotta', discipline: 'Civil & Water Resources' },
    { name: 'Amitav Verma', discipline: 'Data Analytics & GIS' },
  ]);

  // Proposal fields
  const [title, setTitle] = useState<string>(
    'Low-Cost Biochar-Alumina Adsorption Cartridge with Telemetric Turbidity Warning'
  );
  const [problemUnderstanding, setProblemUnderstanding] = useState<string>(
    'Namkum community borewells suffer from dual failure: iron oxide precipitation staining supply channels, combined with unannounced seasonal bacterial turbidity spikes during high water-table monsoons.'
  );
  const [approach, setApproach] = useState<string>(
    'We combine a two-stage local biochar + activated alumina gravity cartridge (costing <₹3,500 per tapstand) with an optical nephelometric sensor node transmitting real-time NTU logs via low-power GSM.'
  );
  const [expectedImpact, setExpectedImpact] = useState<string>(
    'Guaranteed sub-1.0 NTU turbidity and safe potable water access for 1,400+ households across 3 hamlets with zero recurring electricity cost.'
  );
  const [prototypePlan, setPrototypePlan] = useState<string>(
    'Fabricate 3 pilot gravity cartridges using locally sourced bamboo biochar and food-grade HDPE barrels in the BIT Mesra workshop.'
  );
  const [testingPlan, setTestingPlan] = useState<string>(
    '45-day continuous assay: weekly laboratory spectrophotometer testing paired with automated hourly IoT turbidity and conductivity telemetry.'
  );
  const [durationWeeks, setDurationWeeks] = useState<number>(8);
  const [costRange, setCostRange] = useState<string>('₹65,000 – ₹95,000 (Covered by Tata Steel CSR Offer)');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedProposalId, setSubmittedProposalId] = useState<string | null>(null);

  const handleAddMember = () => {
    setMembers([...members, { name: '', discipline: '' }]);
  };

  const handleRemoveMember = (idx: number) => {
    setMembers(members.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const team = await createTeam({
        challengeId: 'JNS-1048',
        facultyMentor,
        members: members.filter((m) => m.name.trim() !== ''),
      });

      const prop = await submitProposal({
        teamId: team.id,
        title,
        problemUnderstanding,
        approach,
        expectedImpact,
        prototypePlan,
        testingPlan,
        durationWeeks,
        estimatedCostRange: costRange,
      });

      setSubmittedProposalId(prop.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptAndLaunch = async () => {
    if (!submittedProposalId) return;
    await acceptProposal(submittedProposalId);
    router.push('/project/JNP-204');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/university" className="hover:text-white">University Portal</Link>
          <span>/</span>
          <span className="text-blue-400">Team & Proposal Form</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Form Multidisciplinary Team & Submit Solution Proposal
        </h1>
        <p className="text-xs text-zinc-400">
          Target Challenge: <strong className="text-zinc-200">JNS-1048 (Rural Drinking Water Reliability)</strong>
        </p>
      </div>

      {submittedProposalId ? (
        <div className="p-8 rounded-2xl bg-[#12151b] border border-emerald-800/60 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Proposal Transmitted to Review Pipeline</h2>
            <p className="text-xs text-zinc-400">
              Assigned Proposal Reference: <strong className="font-mono text-emerald-400">{submittedProposalId}</strong>
            </p>
          </div>
          <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
            Your multidisciplinary proposal has been linked with Tata Steel CSR resources and verified for field execution.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={handleAcceptAndLaunch}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <span>Accept & Move to Project Workspace (JNP-204)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/university"
              className="px-5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 text-xs font-semibold"
            >
              Back to University Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* TEAM CREATION SECTION */}
          <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Users className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                1. Faculty Mentorship & Student Team Composition
              </h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Faculty Mentor Lead</label>
              <input
                type="text"
                value={facultyMentor}
                onChange={(e) => setFacultyMentor(e.target.value)}
                className="w-full rounded-xl bg-[#181d26] border border-zinc-700 p-3 text-xs text-white focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300">
                  Multidisciplinary Student Contributors ({members.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Contributor</span>
                </button>
              </div>

              <div className="space-y-2">
                {members.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Student Full Name"
                      value={m.name}
                      onChange={(e) => {
                        const copy = [...members];
                        copy[idx].name = e.target.value;
                        setMembers(copy);
                      }}
                      className="flex-1 rounded-lg bg-[#181d26] border border-zinc-700 px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Discipline / Department"
                      value={m.discipline}
                      onChange={(e) => {
                        const copy = [...members];
                        copy[idx].discipline = e.target.value;
                        setMembers(copy);
                      }}
                      className="flex-1 rounded-lg bg-[#181d26] border border-zinc-700 px-3 py-2 text-xs text-white"
                    />
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PROPOSAL DETAILS SECTION */}
          <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                2. Technical Solution Blueprint & Pilot Schedule
              </h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Solution Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl bg-[#181d26] border border-zinc-700 p-3 text-xs text-white focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Problem Understanding</label>
              <textarea
                rows={2}
                value={problemUnderstanding}
                onChange={(e) => setProblemUnderstanding(e.target.value)}
                className="w-full rounded-xl bg-[#181d26] border border-zinc-700 p-3 text-xs text-white focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Technical Approach</label>
              <textarea
                rows={3}
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                className="w-full rounded-xl bg-[#181d26] border border-zinc-700 p-3 text-xs text-white focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Expected Field Impact</label>
              <textarea
                rows={2}
                value={expectedImpact}
                onChange={(e) => setExpectedImpact(e.target.value)}
                className="w-full rounded-xl bg-[#181d26] border border-zinc-700 p-3 text-xs text-white focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Prototyping Plan</label>
                <textarea
                  rows={2}
                  value={prototypePlan}
                  onChange={(e) => setPrototypePlan(e.target.value)}
                  className="w-full rounded-xl bg-[#181d26] border border-zinc-700 p-3 text-xs text-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Testing & Pilot Assay</label>
                <textarea
                  rows={2}
                  value={testingPlan}
                  onChange={(e) => setTestingPlan(e.target.value)}
                  className="w-full rounded-xl bg-[#181d26] border border-zinc-700 p-3 text-xs text-white focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Duration (Weeks)</label>
                <input
                  type="number"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="w-full rounded-xl bg-[#181d26] border border-zinc-700 p-3 text-xs text-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Estimated Cost Range</label>
                <input
                  type="text"
                  value={costRange}
                  onChange={(e) => setCostRange(e.target.value)}
                  className="w-full rounded-xl bg-[#181d26] border border-zinc-700 p-3 text-xs text-white focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/university"
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel & Return
            </Link>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting Proposal...' : 'Submit University Proposal'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
