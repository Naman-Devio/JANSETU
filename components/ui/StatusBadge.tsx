import React from 'react';
import { ChallengeStatus } from '@/types';

interface StatusBadgeProps {
  status: ChallengeStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_CONFIG: Record<
  ChallengeStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  SIGNAL: {
    label: 'Signal',
    bg: 'bg-zinc-800/80',
    text: 'text-zinc-300',
    border: 'border-zinc-700',
    dot: 'bg-zinc-400',
  },
  VALIDATING: {
    label: 'Under Review',
    bg: 'bg-amber-950/50',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    dot: 'bg-amber-400 animate-pulse',
  },
  VERIFIED: {
    label: 'Verified Challenge',
    bg: 'bg-emerald-950/50',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    dot: 'bg-emerald-400',
  },
  MATCHING: {
    label: 'Capability Matching',
    bg: 'bg-sky-950/50',
    text: 'text-sky-300',
    border: 'border-sky-500/40',
    dot: 'bg-sky-400',
  },
  TEAM_FORMED: {
    label: 'Team Formed',
    bg: 'bg-indigo-950/50',
    text: 'text-indigo-300',
    border: 'border-indigo-500/40',
    dot: 'bg-indigo-400',
  },
  PROTOTYPE: {
    label: 'Prototype Built',
    bg: 'bg-cyan-950/50',
    text: 'text-cyan-300',
    border: 'border-cyan-500/40',
    dot: 'bg-cyan-400',
  },
  PILOT: {
    label: 'Field Pilot Trial',
    bg: 'bg-emerald-950/80',
    text: 'text-emerald-300 font-bold',
    border: 'border-emerald-400/60 shadow-sm shadow-emerald-500/20',
    dot: 'bg-emerald-400 animate-ping',
  },
  DEPLOYED: {
    label: 'Ground Deployed',
    bg: 'bg-teal-950/50',
    text: 'text-teal-300',
    border: 'border-teal-500/40',
    dot: 'bg-teal-400',
  },
  IMPACT_MEASURED: {
    label: 'Impact Measured',
    bg: 'bg-blue-950/50',
    text: 'text-blue-300',
    border: 'border-blue-500/40',
    dot: 'bg-blue-400',
  },
  REUSABLE: {
    label: 'Reusable Solution',
    bg: 'bg-purple-950/50',
    text: 'text-purple-300',
    border: 'border-purple-500/40',
    dot: 'bg-purple-400',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  size = 'md',
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.SIGNAL;
  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2.5 py-0.5'
      : size === 'lg'
      ? 'text-sm px-4 py-1.5'
      : 'text-xs px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border backdrop-blur-md font-semibold tracking-wide shadow-sm ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
