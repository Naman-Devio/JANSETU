'use client';

import React from 'react';
import { LiveSpeechState } from '@/hooks/useLiveSpeech';

interface LiveVoiceOrbProps {
  state: LiveSpeechState;
  size?: 'sm' | 'md' | 'lg';
}

export const LiveVoiceOrb: React.FC<LiveVoiceOrbProps> = ({ state, size = 'lg' }) => {
  const sizeClasses =
    size === 'sm'
      ? 'w-20 h-20'
      : size === 'md'
      ? 'w-36 h-36'
      : 'w-48 h-48 sm:w-60 sm:h-60';

  // Config mapping state to glow colors and animations
  const getStateStyles = () => {
    switch (state) {
      case 'listening':
        return {
          gradient: 'from-blue-600 via-sky-400 to-cyan-300',
          glow: 'shadow-[0_0_80px_rgba(56,189,248,0.5)] border-sky-400/50',
          ringColor: 'border-sky-400/30',
          statusText: 'Listening to your voice...',
          statusDot: 'bg-sky-400 animate-ping',
        };
      case 'thinking':
        return {
          gradient: 'from-purple-600 via-fuchsia-500 to-pink-400',
          glow: 'shadow-[0_0_80px_rgba(217,70,239,0.5)] border-purple-400/50',
          ringColor: 'border-purple-400/30',
          statusText: 'Thinking & structuring report...',
          statusDot: 'bg-purple-400 animate-pulse',
        };
      case 'speaking':
        return {
          gradient: 'from-emerald-500 via-teal-400 to-cyan-300',
          glow: 'shadow-[0_0_90px_rgba(16,185,129,0.6)] border-emerald-400/60',
          ringColor: 'border-emerald-400/40',
          statusText: 'JanSetu AI is speaking...',
          statusDot: 'bg-emerald-400 animate-bounce',
        };
      case 'idle':
      default:
        return {
          gradient: 'from-blue-700 via-indigo-600 to-sky-500',
          glow: 'shadow-[0_0_50px_rgba(37,99,235,0.3)] border-blue-500/30',
          ringColor: 'border-blue-500/20',
          statusText: 'Ready to speak',
          statusDot: 'bg-blue-400',
        };
    }
  };

  const currentStyles = getStateStyles();

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Outer Container with Pulsing Soundwave Rings */}
      <div className="relative flex items-center justify-center">
        {/* Ring 3 (Outermost expansion) */}
        <div
          className={`absolute rounded-full border ${currentStyles.ringColor} ${
            state === 'speaking' || state === 'listening' ? 'animate-ping opacity-30' : 'opacity-10'
          } ${size === 'lg' ? 'w-72 h-72 sm:w-88 sm:h-88' : 'w-44 h-44'}`}
          style={{ animationDuration: state === 'speaking' ? '1.8s' : '2.5s' }}
        />

        {/* Ring 2 (Middle expansion) */}
        <div
          className={`absolute rounded-full border ${currentStyles.ringColor} ${
            state !== 'idle' ? 'animate-pulse opacity-40' : 'opacity-20'
          } ${size === 'lg' ? 'w-60 h-60 sm:w-72 sm:h-72' : 'w-36 h-36'}`}
        />

        {/* Main Fluid 3D Glowing Orb */}
        <div
          className={`relative rounded-full bg-gradient-to-tr ${currentStyles.gradient} ${currentStyles.glow} ${sizeClasses} flex items-center justify-center transition-all duration-700 transform ${
            state === 'speaking'
              ? 'scale-110 animate-pulse'
              : state === 'listening'
              ? 'scale-105'
              : state === 'thinking'
              ? 'rotate-180 scale-100'
              : 'scale-100 hover:scale-105'
          }`}
        >
          {/* Inner Core Shimmer */}
          <div className="w-3/4 h-3/4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
            <div
              className={`w-1/2 h-1/2 rounded-full bg-white/40 filter blur-sm ${
                state !== 'idle' ? 'animate-ping' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {/* State Status Badge */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-lg">
        <span className={`w-2 h-2 rounded-full ${currentStyles.statusDot}`} />
        <span className="text-xs font-semibold text-zinc-200 tracking-wide">
          {currentStyles.statusText}
        </span>
      </div>
    </div>
  );
};
