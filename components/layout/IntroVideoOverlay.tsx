'use client';

import React, { useState, useEffect, useRef } from 'react';

interface IntroVideoOverlayProps {
  onComplete?: () => void;
}

export const IntroVideoOverlay: React.FC<IntroVideoOverlayProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const [isEnding, setIsEnding] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const attemptUnmutedPlay = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    videoRef.current.play().catch(() => {
      // If browser blocks unmuted play without gesture, play muted temporarily
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }
    });
  };

  useEffect(() => {
    const handleReplayEvent = () => {
      setIsEnding(false);
      setIsVisible(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        attemptUnmutedPlay();
      }
    };

    window.addEventListener('play-jansetu-intro', handleReplayEvent);

    const hasSeenIntro = sessionStorage.getItem('jansetu_intro_played');
    if (!hasSeenIntro) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('play-jansetu-intro', handleReplayEvent);
    };
  }, []);

  // Try unmuted play on mount + attach instant unmuting on any user interaction anywhere
  useEffect(() => {
    if (isVisible && videoRef.current) {
      attemptUnmutedPlay();

      // Listen for any user gesture anywhere to force unmute audio instantly
      const unlockAudio = () => {
        if (videoRef.current) {
          videoRef.current.muted = false;
          videoRef.current.play().catch(() => {});
        }
      };

      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
      window.addEventListener('touchstart', unlockAudio, { once: true });
      window.addEventListener('mousemove', unlockAudio, { once: true });

      return () => {
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('mousemove', unlockAudio);
      };
    }
  }, [isVisible]);

  const handleFinish = () => {
    setIsEnding(true);
    sessionStorage.setItem('jansetu_intro_played', 'true');
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 500);
  };

  if (isVisible === false || isVisible === null) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-500 overflow-hidden ${
        isEnding ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={handleFinish}
    >
      {/* Pure Original Quality Video */}
      <video
        ref={videoRef}
        src="/assets/intro/intro.mp4"
        autoPlay
        playsInline
        preload="auto"
        onEnded={handleFinish}
        className="w-full h-full object-contain max-w-full max-h-full cursor-pointer bg-black"
      />
    </div>
  );
};
