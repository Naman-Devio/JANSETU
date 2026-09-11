'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleSwitcher } from './RoleSwitcher';
import { PlusCircle, MapPin, Sparkles, FolderGit2, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

  const navLinks = [
    { label: lang === 'EN' ? 'Problem Atlas' : 'समस्या एटलस', href: '/atlas', icon: MapPin },
    { label: lang === 'EN' ? 'Hero Project (JNP-204)' : 'मुख्य परियोजना', href: '/project/JNP-204', icon: Sparkles },
    { label: lang === 'EN' ? 'Solution Library' : 'समाधान पुस्तकालय', href: '/solutions', icon: FolderGit2 },
    { label: lang === 'EN' ? 'How It Works' : 'प्रक्रिया', href: '/how-it-works' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#090b0e]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
                JS
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  JANSETU
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.2 rounded">
                    SIH 2026
                  </span>
                </span>
                <span className="text-[10px] text-zinc-400 -mt-0.5 tracking-wide hidden sm:inline-block">
                  Govt of Jharkhand · PS: SIH26043
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: Lang + Role Switcher + Primary CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="text-[11px] font-medium text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded px-2 py-1 bg-zinc-900/60"
              title="Toggle Language Preview"
            >
              {lang === 'EN' ? 'हिन्दी' : 'English'}
            </button>

            {/* Role Switcher */}
            <RoleSwitcher />

            {/* Primary CTA */}
            <Link
              href="/citizen/report"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#090b0e]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{lang === 'EN' ? 'Report a Problem' : 'समस्या दर्ज करें'}</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <RoleSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-zinc-800 bg-zinc-950 px-4 pt-3 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
            <Link
              href="/citizen/report"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report a Problem</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
