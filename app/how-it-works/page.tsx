'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function HowItWorksPage() {
  const lifecycleSteps = [
    { name: 'SIGNAL', label: '1. Community Signal', desc: 'Citizen inputs natural language observation, audio, or photo evidence.' },
    { name: 'VALIDATING', label: '2. Validating', desc: 'AI structures taxonomy and checks semantic duplicates nearby.' },
    { name: 'VERIFIED', label: '3. Verified Challenge', desc: 'Government or institutional moderator reviews and verifies societal priority.' },
    { name: 'MATCHING', label: '4. Capability Matching', desc: 'Autonomous weighted scoring evaluates university labs & facilities.' },
    { name: 'TEAM_FORMED', label: '5. Team Formed', desc: 'Faculty mentor and multidisciplinary students assemble around the challenge.' },
    { name: 'PROTOTYPE', label: '6. Prototype', desc: 'Initial bench prototype fabricated using industry partner resources.' },
    { name: 'PILOT', label: '7. Field Pilot', desc: 'Deployment in community conditions with continuous IoT telemetry.' },
    { name: 'DEPLOYED', label: '8. Deployed', desc: 'Handover to local Gram Panchayat / Jal Sahiya operational committees.' },
    { name: 'IMPACT_MEASURED', label: '9. Measured Impact', desc: 'Provenanced outcomes recorded with verified methodology and date.' },
    { name: 'REUSABLE', label: '10. Reusable Solution', desc: 'Open blueprints packaged into Solution Library for statewide adaptation.' },
  ];

  const judgeQuestions = [
    {
      q: 'How is JanSetu different from CPGRAMS or municipal grievance portals?',
      a: 'Grievance systems focus on complaint registration, administrative routing, and bureaucratic redressal. JanSetu addresses the innovation layer after: converting validated problems into structured research challenges and coordinating universities and CSR to build, pilot, and deploy permanent technical solutions.',
    },
    {
      q: 'Is the academic matching just an AI hallucination?',
      a: 'No. Capability matching uses a deterministic, inspectable weighted model based on structured institution attributes: Domain Expertise (35%), Faculty Leads (25%), Past Track Record (15%), Laboratory Facilities (10%), Proximity (5%), and Team Availability (10%). AI only summarizes and explains the match.',
    },
    {
      q: 'What happens after a proposal is accepted?',
      a: 'The proposal transitions into an active project workspace with real milestone delivery, field sensor telemetry logging, CSR material commitments, and community operational training.',
    },
    {
      q: 'How is impact measured and kept truthful?',
      a: 'Every displayed metric is accompanied by strict provenance: Source, Date, and Method. On this demonstration build, all illustrative figures are explicitly labeled as demo data.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-zinc-800 pb-8 text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase text-blue-400 tracking-wider">
          Architecture & Coordination Logic
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How JanSetu Works
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          From an unstructured citizen observation to a tested solution operating on the ground in Jharkhand.
        </p>
      </div>

      {/* The Canonical 10-Stage Lifecycle (Section 4) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
            The Canonical 10-Stage Lifecycle
          </h2>
          <span className="text-xs text-zinc-400 font-mono">Governed Lifecycle</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lifecycleSteps.map((step) => (
            <div
              key={step.name}
              className="p-4 rounded-xl bg-[#181d26] border border-zinc-800/80 space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{step.label}</span>
                <span className="text-[10px] font-mono text-blue-400 px-1.5 py-0.5 rounded bg-zinc-800">
                  {step.name}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The Judge Test (Section 2 & 54) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-6">
        <div className="flex items-center gap-2 text-emerald-400 border-b border-zinc-800 pb-3">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
            Frequently Addressed Judge Questions (SIH 2026)
          </h2>
        </div>

        <div className="space-y-4">
          {judgeQuestions.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#181d26] border border-zinc-800 space-y-2"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-blue-400 font-mono">Q{idx + 1}:</span>
                <span>{item.q}</span>
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed pl-6">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          href="/citizen/report"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg transition-all"
        >
          <span>Experience the 5-Minute Demo Walkthrough</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
