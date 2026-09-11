'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { submitPartnerOffer } from '@/lib/api';
import {
  Building2,
  CheckCircle2,
  Cpu,
  Wrench,
  FlaskConical,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function PartnerPage() {
  const [selectedContributions, setSelectedContributions] = useState<string[]>([
    'CSR Hardware Prototyping Grants (₹85,000 committed)',
    'Field Spectrometry & Water Lab Testing Access',
    'Jal Sahiya Rural Operations Network Mobilization',
  ]);

  const partnerId = 'PART-01';
  const projectId = 'JNP-204';
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedOfferId, setSubmittedOfferId] = useState<string | null>(null);

  const availableOptions = [
    {
      id: 'csr_grant',
      label: 'CSR Hardware Prototyping Grants (₹85,000 committed)',
      desc: 'Direct material acquisition for student fabrication at BIT Mesra.',
      icon: ShieldCheck,
    },
    {
      id: 'lab_test',
      label: 'Field Spectrometry & Water Lab Testing Access',
      desc: 'Certified laboratory assays for iron, arsenic, and total dissolved solids.',
      icon: FlaskConical,
    },
    {
      id: 'mentorship',
      label: 'Technical Mentor & Industrial Engineering Advisory',
      desc: 'Weekly guidance on ruggedizing plastic HDPE housing for village use.',
      icon: GraduationCap,
    },
    {
      id: 'iot_hardware',
      label: 'Solar Optical Turbidity Sensors & GSM Modules',
      desc: 'Donation of 3 calibrated telemetry nodes with solar panels.',
      icon: Cpu,
    },
    {
      id: 'jal_sahiya',
      label: 'Jal Sahiya Rural Operations Network Mobilization',
      desc: 'Grassroots coordination with women village water inspectors.',
      icon: Wrench,
    },
  ];

  const toggleOption = (label: string) => {
    if (selectedContributions.includes(label)) {
      setSelectedContributions(selectedContributions.filter((c) => c !== label));
    } else {
      setSelectedContributions([...selectedContributions, label]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitPartnerOffer({
        projectId,
        partnerId,
        contributions: selectedContributions,
      });
      setSubmittedOfferId(res.offerId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header (Section 18) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-mono uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Corporate & CSR Resource Partner Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Deploy Corporate Resources to Verified Field Solutions
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Partner: <strong className="text-zinc-200">Tata Steel Foundation (Rural Water Initiative)</strong>
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded font-bold">
            92% Capability Fit
          </span>
        </div>
      </div>

      {submittedOfferId ? (
        <div className="p-8 rounded-2xl bg-[#12151b] border border-emerald-800/60 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Partner Resource Offer Transmitted</h2>
            <p className="text-xs text-zinc-400">
              Assigned Agreement Code: <strong className="font-mono text-emerald-400">{submittedOfferId}</strong>
            </p>
          </div>
          <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
            Your material and testing commitment has been merged into Project JNP-204. The BIT Mesra engineering team has been notified.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/project/JNP-204"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center gap-2"
            >
              <span>View Updated Project Workspace (JNP-204)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-6 lg:p-8 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-6 shadow-xl">
          {/* Target Project Card */}
          <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-400">Target Project: JNP-204</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  Stage: FIELD PILOT
                </span>
              </div>
              <span className="text-[11px] text-zinc-400">Namkum Block, Ranchi</span>
            </div>
            <h3 className="text-sm font-bold text-white">
              Community Water Quality Monitoring & Adsorption Filtration Pilot
            </h3>
            <p className="text-xs text-zinc-400">
              Led by BIT Mesra Department of Chemical & Environmental Engineering.
            </p>
          </div>

          {/* Selectable contributions */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
              Select Practical Resource Commitments ({selectedContributions.length} Selected)
            </label>

            <div className="grid grid-cols-1 gap-3">
              {availableOptions.map((opt) => {
                const isChecked = selectedContributions.includes(opt.label);
                const Icon = opt.icon;
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleOption(opt.label)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                      isChecked
                        ? 'bg-blue-950/30 border-blue-500/80 ring-1 ring-blue-500/40'
                        : 'bg-[#181d26] border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="mt-0.5">
                      <Icon className={`w-5 h-5 ${isChecked ? 'text-blue-400' : 'text-zinc-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{opt.label}</span>
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <div className="text-[11px] text-zinc-500">
              Demo scenario. No commercial binding contract executed.
            </div>
            <button
              type="button"
              disabled={isSubmitting || selectedContributions.length === 0}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition-all flex items-center gap-2"
            >
              <span>{isSubmitting ? 'Transmitting Offer...' : 'Commit CSR Resource Support'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
