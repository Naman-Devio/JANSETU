'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function GovernmentCommandCenterPage() {
  const funnelData = [
    { name: 'Signals Received', count: 140 },
    { name: 'Verified Challenges', count: 48 },
    { name: 'Active Proposals', count: 19 },
    { name: 'Field Pilots', count: 9 },
    { name: 'Ground Deployed', count: 4 },
  ];

  const domainData = [
    { name: 'Water & Sanitation', value: 38, color: '#0ea5e9' },
    { name: 'Environmental', value: 24, color: '#10b981' },
    { name: 'Infrastructure', value: 18, color: '#f59e0b' },
    { name: 'Agriculture', value: 12, color: '#8b5cf6' },
    { name: 'Health & Air', value: 8, color: '#ef4444' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-mono uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Executive Command Center · Dept of Higher & Technical Education</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Jharkhand Civic Innovation Pipeline
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Real-time state overview of crowdsourced societal challenges, higher education research engagement, and industry CSR field pilots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/government/review"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Open Verification Queue (8 Pending)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-2">
          <div className="text-[11px] text-zinc-400 uppercase font-mono flex items-center justify-between">
            <span>Community Signals</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">140</div>
          <div className="text-[11px] text-zinc-500">Across 18 Jharkhand districts</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-2">
          <div className="text-[11px] text-zinc-400 uppercase font-mono flex items-center justify-between">
            <span>Verified Challenges</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">48</div>
          <div className="text-[11px] text-zinc-500">Passed moderation review</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-2">
          <div className="text-[11px] text-zinc-400 uppercase font-mono flex items-center justify-between">
            <span>University HEI Teams</span>
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400">14 Teams</div>
          <div className="text-[11px] text-zinc-500">BIT Mesra, NIT, ISM Dhanbad</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-2">
          <div className="text-[11px] text-zinc-400 uppercase font-mono flex items-center justify-between">
            <span>Documented Citizens Reached</span>
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">42,500+</div>
          <div className="text-[11px] text-zinc-500">From 9 active field pilots</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Funnel Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Signal-to-Deployment Pipeline Funnel
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">Verified Ratio: 34.2%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181d26', borderColor: '#2d3748', fontSize: '12px', color: '#fff' }}
                  cursor={{ fill: '#1f2937' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domain Distribution Pie Chart */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Societal Demand by Domain
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">Jharkhand</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={domainData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#181d26', borderColor: '#2d3748', fontSize: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-zinc-800">
            {domainData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
