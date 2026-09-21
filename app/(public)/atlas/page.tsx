'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChallengeDetail, ChallengeSummary } from '@/types';
import { SEED_CHALLENGES } from '@/lib/mocks/data';
import { listChallenges } from '@/lib/api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MapErrorBoundary } from '@/components/maps/MapErrorBoundary';
import { SpeakButton } from '@/components/ui/SpeakButton';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Filter,
  ArrowRight,
  Layers,
  Table as TableIcon,
  Map as MapIcon,
  Globe,
  ExternalLink,
  Activity,
  Sparkles,
  Compass,
} from 'lucide-react';

const ProblemAtlasMap = dynamic(
  () => import('@/components/maps/ProblemAtlasMap').then((mod) => mod.ProblemAtlasMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[550px] lg:h-[650px] rounded-2xl bg-[#0c0e12] border border-zinc-800 flex items-center justify-center text-xs text-zinc-500 font-mono">
        Initializing Satellite Map Imagery...
      </div>
    ),
  }
);

export default function ProblemAtlasPage() {
  const [challenges, setChallenges] = useState<ChallengeDetail[]>(SEED_CHALLENGES);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [activeChallenge, setActiveChallenge] = useState<ChallengeDetail>(SEED_CHALLENGES[0]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await listChallenges();
        let localReports: any[] = [];
        try {
          localReports = JSON.parse(localStorage.getItem('jansetu_local_reports') || '[]');
        } catch (e) {
          console.warn('LocalStorage error:', e);
        }

        const map = new Map<string, ChallengeDetail>();
        SEED_CHALLENGES.forEach((ch) => map.set(ch.id, ch));
        data.forEach((ch: any) => map.set(ch.id, ch as ChallengeDetail));
        localReports.forEach((r: any) => map.set(r.id, r as ChallengeDetail));

        const merged = Array.from(map.values());
        setChallenges(merged);
        if (merged.length > 0 && !activeChallenge) {
          setActiveChallenge(merged[0]);
        }
      } catch (err) {
        console.error('Error loading atlas challenges:', err);
      }
    }
    loadData();
  }, []);

  // Filter challenges
  const filteredChallenges = challenges.filter((ch) => {
    if (selectedDistrict !== 'ALL' && !ch.affectedArea.toLowerCase().includes(selectedDistrict.toLowerCase())) {
      return false;
    }
    if (selectedDomain !== 'ALL' && ch.domain !== selectedDomain) {
      return false;
    }
    if (selectedStatus !== 'ALL' && ch.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-mono uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Layers className="w-3.5 h-3.5 text-teal-300" />
            <span>Live GIS Satellite View & Citizen Hotspots</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            JanSetu Interactive Problem Atlas
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Explore verified societal demand signals overlaid on high-resolution Earth satellite imagery. Zoom into any location to inspect photo & video evidence, population scale, and solution status.
          </p>
        </div>

        {/* View Toggle & Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/citizen/report"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Report Issue with Live GPS</span>
          </Link>
          <div className="inline-flex rounded-xl border border-zinc-800 bg-[#12151b] p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Satellite Map</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-[#12151b] border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-zinc-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </span>

          {/* District Filter */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="rounded-lg bg-[#181d26] border border-zinc-700 px-3 py-1.5 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Districts / Locations</option>
            <option value="Ranchi">Ranchi</option>
            <option value="Rawatbhata">Rawatbhata / Chittorgarh</option>
            <option value="Dhanbad">Dhanbad</option>
            <option value="Hazaribagh">Hazaribagh</option>
            <option value="Jamshedpur">Jamshedpur (East Singhbhum)</option>
            <option value="Khunti">Khunti</option>
            <option value="Sahebganj">Sahebganj</option>
            <option value="Bokaro">Bokaro</option>
            <option value="Dumka">Dumka</option>
            <option value="Latehar">Latehar (Netarhat)</option>
          </select>

          {/* Domain Filter */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="rounded-lg bg-[#181d26] border border-zinc-700 px-3 py-1.5 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Domains</option>
            <option value="Water & Sanitation">Water & Sanitation</option>
            <option value="Environmental Monitoring">Environmental Monitoring</option>
            <option value="Infrastructure & Access">Infrastructure & Access</option>
            <option value="Agriculture & Livelihood">Agriculture & Livelihood</option>
            <option value="Waste Management">Waste Management</option>
            <option value="Healthcare Access">Healthcare Access</option>
            <option value="Clean Air & Health">Clean Air & Health</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg bg-[#181d26] border border-zinc-700 px-3 py-1.5 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Lifecycle Stages</option>
            <option value="PILOT">Field Pilot</option>
            <option value="PROTOTYPE">Prototype</option>
            <option value="TEAM_FORMED">Team Formed</option>
            <option value="MATCHING">Matching</option>
            <option value="VERIFIED">Verified</option>
            <option value="VALIDATING">Validating</option>
            <option value="DEPLOYED">Deployed</option>
            <option value="REUSABLE">Reusable</option>
          </select>
        </div>

        <div className="text-zinc-400 font-mono text-[11px]">
          Showing <strong>{filteredChallenges.length}</strong> of {challenges.length} challenges
        </div>
      </div>

      {/* Main View: Map + Inspector or Accessible Table */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Column */}
          <div className="lg:col-span-8">
            <MapErrorBoundary>
              <ProblemAtlasMap
                challenges={filteredChallenges}
                selectedChallengeId={activeChallenge?.id}
                onSelectChallenge={(ch) => setActiveChallenge(ch)}
              />
            </MapErrorBoundary>
          </div>

          {/* Inspector Column */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-4 shadow-xl">
            {activeChallenge ? (
              <>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5" />
                    Selected Hotspot
                  </span>
                  <StatusBadge status={activeChallenge.status} size="sm" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded">
                      {activeChallenge.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase">
                      {activeChallenge.priority || 'HIGH'} Priority
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug pt-1">
                    {activeChallenge.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{activeChallenge.affectedArea}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span>Problem Statement</span>
                    <SpeakButton text={activeChallenge.problemStatement} label="Listen" />
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-[#181d26] p-3 rounded-xl border border-zinc-800 max-h-36 overflow-y-auto">
                    {activeChallenge.problemStatement}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-[#181d26] border border-zinc-800">
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">Signals</div>
                    <div className="text-sm font-bold text-white mt-0.5">{activeChallenge.signalCount}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#181d26] border border-zinc-800">
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">Evidence</div>
                    <div className="text-sm font-bold text-white mt-0.5">{activeChallenge.evidenceCount}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#181d26] border border-zinc-800">
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">Verified</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">{activeChallenge.confirmationCount}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Estimated Reach</div>
                  <div className="text-xs font-semibold text-zinc-200">
                    ~{(activeChallenge.affectedPopulationEstimate || 5000).toLocaleString()} Citizens Impacted
                  </div>
                </div>

                {activeChallenge.requiredExpertise && activeChallenge.requiredExpertise.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono text-zinc-400 uppercase">Required Expertise</div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeChallenge.requiredExpertise.map((exp, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* OpenStreetMap Coordinates & Telemetry */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                      <span>GIS Coordinates</span>
                    </span>
                    <span className="text-zinc-200 font-semibold">{activeChallenge.lat}° N, {activeChallenge.lng}° E</span>
                  </div>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${activeChallenge.lat}&mlon=${activeChallenge.lng}#map=14/${activeChallenge.lat}/${activeChallenge.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 text-xs transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Inspect in OpenStreetMap</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/challenge/${activeChallenge.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-xs font-semibold shadow-md transition-all"
                  >
                    <span>Open Full Challenge Detail</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-xs text-zinc-500">
                Click any satellite map marker to inspect details.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Accessible Table Fallback */
        <div className="rounded-2xl border border-zinc-800 bg-[#12151b] overflow-hidden">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#181d26] text-zinc-400 border-b border-zinc-800 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Challenge Title</th>
                <th className="py-3 px-4">District / Area</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Signals</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredChallenges.map((ch) => (
                <tr key={ch.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-400">{ch.id}</td>
                  <td className="py-3 px-4 font-medium text-white max-w-xs">{ch.title}</td>
                  <td className="py-3 px-4 text-zinc-400">{ch.affectedArea}</td>
                  <td className="py-3 px-4">{ch.domain}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={ch.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono">{ch.signalCount}</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/challenge/${ch.id}`}
                      className="text-blue-400 hover:underline font-semibold"
                    >
                      Inspect →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
