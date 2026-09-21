import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-[#06080c]/40 via-[#06080c]/65 to-[#06080c]/85 backdrop-blur-2xl text-zinc-300 text-xs mt-16 sm:mt-20 relative z-10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Col 1: Identity & Thesis */}
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center font-extrabold text-white text-xs shadow-md shadow-blue-500/20 shrink-0">
                JS
              </div>
              <span className="font-extrabold text-white tracking-tight text-base">JANSETU</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 shrink-0">
                SIH26043
              </span>
            </div>
            <p className="text-zinc-200 text-xs leading-relaxed max-w-md">
              From community signals to solutions that reach the ground. A civic innovation & collaboration platform connecting verified societal challenges in Jharkhand with university research and industry capability.
            </p>
            <div className="pt-1 text-[11px] text-zinc-300 font-medium">
              Department of Higher & Technical Education · Government of Jharkhand
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-bold mb-3 sm:mb-4 tracking-wider text-[11px] uppercase">
              Platform Modules
            </h4>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link href="/citizen/report" className="text-zinc-300 hover:text-white transition-colors">
                  Citizen Signal Intake
                </Link>
              </li>
              <li>
                <Link href="/atlas" className="text-zinc-300 hover:text-white transition-colors">
                  Living Problem Atlas
                </Link>
              </li>
              <li>
                <Link href="/challenge/JNS-1048" className="text-zinc-300 hover:text-white transition-colors">
                  Canonical Challenge (JNS-1048)
                </Link>
              </li>
              <li>
                <Link href="/project/JNP-204" className="text-zinc-300 hover:text-white transition-colors">
                  Hero Pilot Workspace (JNP-204)
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-zinc-300 hover:text-white transition-colors">
                  Reusable Solution Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Roles */}
          <div>
            <h4 className="text-white font-bold mb-3 sm:mb-4 tracking-wider text-[11px] uppercase">
              Role Portals
            </h4>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link href="/university" className="text-zinc-300 hover:text-white transition-colors">
                  University Capability Workspace
                </Link>
              </li>
              <li>
                <Link href="/partner" className="text-zinc-300 hover:text-white transition-colors">
                  Industry & CSR Partner Portal
                </Link>
              </li>
              <li>
                <Link href="/government/review" className="text-zinc-300 hover:text-white transition-colors">
                  Government Verification Queue
                </Link>
              </li>
              <li>
                <Link href="/government" className="text-zinc-300 hover:text-white transition-colors">
                  Executive Command Center
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-zinc-300 hover:text-white transition-colors">
                  Core 10-Stage Lifecycle Spec
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer Banner */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="text-[11px] text-zinc-300 max-w-2xl leading-normal">
            <strong className="text-white">Notice:</strong> SIH 2026 Demonstration Prototype. All scenarios, locations, and sensor figures represent illustrative demo data designed to validate the end-to-end civic coordination chain. Privacy-conscious location generalization applied.
          </div>
          <div className="text-[11px] text-zinc-200 font-mono bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full shrink-0 shadow-sm">
            SIH 2026 · Next.js & Supabase
          </div>
        </div>
      </div>
    </footer>
  );
};
