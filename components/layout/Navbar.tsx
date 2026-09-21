'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleSwitcher } from './RoleSwitcher';
import { PlusCircle, MapPin, Sparkles, FolderGit2, Menu, X, Play, PhoneCall, Globe } from 'lucide-react';

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
    <header className="sticky top-0 z-40 glass-nav border-b border-white/10 bg-black/30 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-teal-400 flex items-center justify-center font-extrabold text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all shrink-0">
                JS
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  JANSETU
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded-full shadow-sm shrink-0">
                    SIH 2026
                  </span>
                </span>
                <span className="text-[10px] text-zinc-400 -mt-0.5 tracking-wide hidden lg:inline-block">
                  Govt of Jharkhand · PS: SIH26043
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 ml-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30 shadow-sm shadow-blue-500/10'
                        : 'text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: Lang + Watch Intro + Talk to AI + Role Switcher + Primary CTA */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="text-[11px] font-semibold text-zinc-400 hover:text-white border border-white/10 rounded-xl px-2.5 py-1.5 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-1"
              title="Toggle Language Preview"
            >
              <Globe className="w-3 h-3 text-zinc-400" />
              <span>{lang === 'EN' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Watch Intro Button */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('play-jansetu-intro'))}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-300 hover:text-white border border-blue-500/30 rounded-xl px-3 py-1.5 bg-blue-950/40 hover:bg-blue-600 transition-all shadow-md shadow-blue-600/10 group"
              title="Watch Intro Video"
            >
              <Play className="w-3 h-3 text-blue-400 group-hover:text-white fill-current transition-colors" />
              <span>Intro</span>
            </button>

            {/* Talk to AI Voice Button */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-jansetu-ai-call'))}
              className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-300 hover:text-white border border-emerald-500/40 rounded-xl px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-600 transition-all shadow-md shadow-emerald-600/20 group animate-pulse"
              title="Talk to JanSetu AI Voice Assistant"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400 group-hover:text-white transition-colors" />
              <span>Talk to AI</span>
            </button>

            {/* Role Switcher */}
            <RoleSwitcher />

            {/* Primary CTA */}
            <Link
              href="/citizen/report"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-xs font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{lang === 'EN' ? 'Report Problem' : 'रिपोर्ट करें'}</span>
            </Link>
          </div>

          {/* Mobile/Tablet Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <RoleSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-300 hover:text-white bg-white/5 border border-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#090b0e]/95 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
            {/* Talk to AI Mobile */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent('open-jansetu-ai-call'));
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs font-extrabold shadow-md shadow-emerald-600/10"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Talk to AI Voice</span>
            </button>

            {/* Watch Intro Mobile */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent('play-jansetu-intro'));
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-blue-500/30 bg-blue-950/40 text-blue-300 text-xs font-semibold"
            >
              <Play className="w-3.5 h-3.5 fill-current text-blue-400" />
              <span>Watch Video</span>
            </button>

            {/* Language Toggle Mobile */}
            <button
              type="button"
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="col-span-2 flex items-center justify-center gap-2 py-2 rounded-xl border border-white/10 bg-white/5 text-zinc-300 text-xs font-semibold"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>Language: {lang === 'EN' ? 'हिन्दी (Hindi)' : 'English'}</span>
            </button>

            {/* Primary CTA Mobile */}
            <Link
              href="/citizen/report"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'EN' ? 'Report a Problem Now' : 'अपनी समस्या दर्ज करें'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
