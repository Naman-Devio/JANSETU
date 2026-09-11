import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#090b0e] text-zinc-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity & Thesis */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-sm">JANSETU</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                SIH26043
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
              From community signals to solutions that reach the ground. A civic innovation & collaboration platform connecting verified societal challenges in Jharkhand with university research and industry capability.
            </p>
            <div className="pt-2 text-[11px] text-zinc-500">
              Department of Higher & Technical Education · Government of Jharkhand
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-zinc-200 font-semibold mb-3 tracking-wider text-[11px] uppercase">
              Platform Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/citizen/report" className="hover:text-white transition-colors">
                  Citizen Signal Intake
                </Link>
              </li>
              <li>
                <Link href="/atlas" className="hover:text-white transition-colors">
                  Living Problem Atlas
                </Link>
              </li>
              <li>
                <Link href="/challenge/JNS-1048" className="hover:text-white transition-colors">
                  Canonical Challenge (JNS-1048)
                </Link>
              </li>
              <li>
                <Link href="/project/JNP-204" className="hover:text-white transition-colors">
                  Hero Pilot Workspace (JNP-204)
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-white transition-colors">
                  Reusable Solution Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Roles */}
          <div>
            <h4 className="text-zinc-200 font-semibold mb-3 tracking-wider text-[11px] uppercase">
              Role Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/university" className="hover:text-white transition-colors">
                  University Capability Workspace
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-white transition-colors">
                  Industry & CSR Partner Portal
                </Link>
              </li>
              <li>
                <Link href="/government/review" className="hover:text-white transition-colors">
                  Government Verification Queue
                </Link>
              </li>
              <li>
                <Link href="/government" className="hover:text-white transition-colors">
                  Executive Command Center
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  Core 10-Stage Lifecycle Spec
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer Banner */}
        <div className="mt-8 pt-8 border-t border-zinc-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-zinc-500 max-w-2xl leading-normal">
            <strong className="text-zinc-400">Notice:</strong> SIH 2026 Demonstration Prototype. All scenarios, locations, and sensor figures represent illustrative demo data designed to validate the end-to-end civic coordination chain. Privacy-conscious location generalization applied.
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">
            Zero-Cost Build · Next.js & Supabase
          </div>
        </div>
      </div>
    </footer>
  );
};
