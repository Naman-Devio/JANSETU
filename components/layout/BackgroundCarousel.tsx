'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export const BackgroundCarousel: React.FC = () => {
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload click sound effect
    audioRef.current = new Audio('/assets/open_up.mp3');
    audioRef.current.volume = 0.7;
  }, []);

  // Helper to play the button click sound effect
  const playClickSound = useCallback(() => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // Fallback if preloaded audio instance was interrupted
          const fallback = new Audio('/Open up.mp3');
          fallback.volume = 0.7;
          fallback.play().catch(() => {});
        });
      } else {
        const sound = new Audio('/Open up.mp3');
        sound.volume = 0.7;
        sound.play().catch(() => {});
      }
    } catch (e) {
      console.warn('Click sound playback error:', e);
    }
  }, []);

  // Helper to reset video to 0s and play until last frame
  const replayVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
      videoRef.current.play().catch((err) => {
        console.warn('Background video play failed:', err);
      });
    }
  }, []);

  // Replay video whenever route/page changes
  useEffect(() => {
    replayVideo();
  }, [pathname, replayVideo]);

  // Replay video & play "Open up.mp3" sound whenever user clicks any button or link
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, a, [role="button"], input[type="button"], input[type="submit"]')) {
        playClickSound();
        replayVideo();
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [replayVideo, playClickSound]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-[#090b0e]">
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover filter blur-none scale-100 opacity-90 transition-opacity duration-1000"
        >
          <source src="/assets/back.mp4" type="video/mp4" />
          <source src="/back.mp4" type="video/mp4" />
        </video>
      ) : (
        /* Fallback background image if video fails to load */
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-none"
          style={{ backgroundImage: `url('/assets/water.webp')` }}
        />
      )}

      {/* High-contrast ambient dark gradient overlay so background video is visible while guaranteeing 100% text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/75 pointer-events-none" />
    </div>
  );
};
