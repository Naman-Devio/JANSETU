'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface SpeakButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  label = 'Listen',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakWithWebSpeech = (inputText: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(inputText);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleToggleSpeak = async () => {
    if (typeof window === 'undefined') return;

    if (isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 300) }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('audio')) {
        const blob = await res.blob();
        if (blob.size > 100) {
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);

          audio.onended = () => setIsPlaying(false);
          audio.onerror = () => speakWithWebSpeech(text);

          try {
            await audio.play();
            setIsPlaying(true);
            setIsLoading(false);
            return;
          } catch {
            // Audio play failed, fallback to Web Speech
          }
        }
      }
    } catch {
      // API call failed, fallback to Web Speech
    }

    speakWithWebSpeech(text);
    setIsLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      disabled={isLoading}
      title={isPlaying ? 'Stop Audio' : 'Listen via AI Voice Narration'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
        isPlaying
          ? 'border-emerald-700/80 bg-emerald-950/60 text-emerald-300'
          : 'border-zinc-700/80 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white'
      } ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
      ) : isPlaying ? (
        <VolumeX className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-blue-400" />
      )}
      {label && <span>{isLoading ? 'Generating...' : isPlaying ? 'Stop' : label}</span>}
    </button>
  );
};
