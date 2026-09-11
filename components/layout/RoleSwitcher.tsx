'use client';

import React, { useEffect, useState } from 'react';
import { UserRole } from '@/types';
import { getCurrentUser, switchDemoRole } from '@/lib/api';
import { Users, GraduationCap, Building2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const RoleSwitcher: React.FC = () => {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole>('CITIZEN');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setCurrentRole(user.role as UserRole);
      }
    });
  }, []);

  const roles: { role: UserRole; label: string; desc: string; icon: React.ElementType; route: string }[] = [
    {
      role: 'CITIZEN',
      label: 'Citizen Demo',
      desc: 'Report problems & community verification',
      icon: Users,
      route: '/citizen/report',
    },
    {
      role: 'UNIVERSITY',
      label: 'University Demo',
      desc: 'BIT Mesra · Capability matching & team proposals',
      icon: GraduationCap,
      route: '/university',
    },
    {
      role: 'PARTNER',
      label: 'Partner Demo',
      desc: 'Tata Steel CSR · Resource contribution & grants',
      icon: Building2,
      route: '/partner',
    },
    {
      role: 'GOVERNMENT',
      label: 'Government Demo',
      desc: 'Dept of Higher & Tech Ed · Verification queue',
      icon: ShieldAlert,
      route: '/government/review',
    },
  ];

  const handleSelectRole = async (role: UserRole, targetRoute: string) => {
    await switchDemoRole(role);
    setCurrentRole(role);
    setIsOpen(false);
    router.push(targetRoute);
  };

  const activeConfig = roles.find((r) => r.role === currentRole) || roles[0];
  const ActiveIcon = activeConfig.icon;

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900/90 hover:bg-zinc-800 text-xs text-zinc-200 transition-colors shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <ActiveIcon className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-medium">{activeConfig.label}</span>
        <span className="text-[10px] text-zinc-400 uppercase tracking-wider bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
          Demo
        </span>
        <svg
          className={`w-3 h-3 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl border border-zinc-700 bg-zinc-900/95 backdrop-blur-md shadow-2xl p-1.5 z-50 divide-y divide-zinc-800/80">
            <div className="px-3 py-2 text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
              Switch Persona (SIH Demo Mode)
            </div>
            <div className="py-1 space-y-1">
              {roles.map((item) => {
                const ItemIcon = item.icon;
                const isSelected = item.role === currentRole;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleSelectRole(item.role, item.route)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-3 transition-colors ${
                      isSelected
                        ? 'bg-blue-600/15 text-blue-300 border border-blue-500/30'
                        : 'hover:bg-zinc-800/80 text-zinc-300'
                    }`}
                  >
                    <ItemIcon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-blue-400' : 'text-zinc-400'}`} />
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        {item.label}
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-3 py-2 text-[10px] text-zinc-400 leading-tight">
              Fictionalized persona state for hackathon evaluation. No real government credentials implied.
            </div>
          </div>
        </>
      )}
    </div>
  );
};
