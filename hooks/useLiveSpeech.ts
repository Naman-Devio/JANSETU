'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ReportDraft {
  title: string;
  domain: string;
  district: string;
  block: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  suggestedCapabilities: string[];
}

export type LiveSpeechState = 'idle' | 'listening' | 'thinking' | 'speaking';

// Anika - High Quality Warm Indian Voice ID from ElevenLabs
export const PREFERRED_VOICE_ID = 'jUjRbhZWoMK4aDciW36V';

export function useLiveSpeech() {
  const [state, setState] = useState<LiveSpeechState>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [reportDraft, setReportDraft] = useState<ReportDraft | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const isSessionActiveRef = useRef<boolean>(false);
  const messagesRef = useRef<ChatMessage[]>([]);

  // Concurrency, Epoch, and Echo-prevention Refs
  const speechEpochRef = useRef<number>(0);
  const isProcessingTurnRef = useRef<boolean>(false);
  const hasTranscribedTurnRef = useRef<boolean>(false);
  const stateRef = useRef<LiveSpeechState>('idle');

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Helper to get Puter instance (waits up to 1.2s if script is still mounting)
  const getPuterInstance = async (): Promise<any> => {
    if (typeof window === 'undefined') return null;
    if ((window as any).puter?.ai?.txt2speech) return (window as any).puter;

    for (let i = 0; i < 12; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if ((window as any).puter?.ai?.txt2speech) {
        return (window as any).puter;
      }
    }
    return null;
  };

  // Stop ALL playing audio and invalidate any in-flight voice synthesis promises immediately
  const stopAllSpeech = useCallback(() => {
    speechEpochRef.current += 1;
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } catch {}
      audioPlayerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }, []);

  // Fast Fallback TTS (Google Native Indian Voice / Browser Web Speech)
  const playFastFallbackTTS = useCallback(
    async (text: string, epoch: number, onEndedCallback?: () => void) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (speechEpochRef.current !== epoch) return;

        if (response.ok) {
          const audioBlob = await response.blob();
          if (speechEpochRef.current !== epoch) return;

          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audioPlayerRef.current = audio;

          audio.onplay = () => {
            if (speechEpochRef.current === epoch) {
              setState('speaking');
            }
          };

          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            audioPlayerRef.current = null;
            if (speechEpochRef.current === epoch) {
              if (onEndedCallback) onEndedCallback();
            }
          };

          audio.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            audioPlayerRef.current = null;
            if (speechEpochRef.current === epoch) {
              speakWithWebSpeech(text, epoch, onEndedCallback);
            }
          };

          await audio.play();
          return;
        }
      } catch {
        // Fallback to Web Speech
      }

      if (speechEpochRef.current === epoch) {
        speakWithWebSpeech(text, epoch, onEndedCallback);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Web Speech Native Browser TTS
  const speakWithWebSpeech = useCallback(
    (text: string, epoch: number, onEndedCallback?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        if (onEndedCallback) onEndedCallback();
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(
          (v) =>
            v.lang.includes('hi') ||
            v.name.includes('Hindi') ||
            v.name.includes('Swara') ||
            v.name.includes('Hemant') ||
            v.lang.includes('IN')
        ) || voices.find((v) => v.lang.includes('en'));

        if (indianVoice) utterance.voice = indianVoice;

        utterance.onstart = () => {
          if (speechEpochRef.current === epoch) {
            setState('speaking');
          }
        };

        utterance.onend = () => {
          if (speechEpochRef.current === epoch) {
            if (onEndedCallback) onEndedCallback();
          }
        };

        utterance.onerror = () => {
          if (speechEpochRef.current === epoch) {
            if (onEndedCallback) onEndedCallback();
          }
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        if (onEndedCallback) onEndedCallback();
      }
    },
    []
  );

  // PRIMARY VOICE ENGINE: ElevenLabs Anika (jUjRbhZWoMK4aDciW36V) via Puter.js
  const speakText = useCallback(
    async (text: string, onEndedCallback?: () => void) => {
      if (typeof window === 'undefined') {
        if (onEndedCallback) onEndedCallback();
        return;
      }

      // 1. Immediately abort any currently playing audio & cancel prior turns
      stopAllSpeech();
      const currentEpoch = speechEpochRef.current;

      // 2. Stop microphone listening so speaker output is NEVER heard by microphone (ECHO PREVENTION)
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }

      // TIER 1: ElevenLabs Voice ID: Anika (jUjRbhZWoMK4aDciW36V) via Puter.js
      const puter = await getPuterInstance();
      if (puter?.ai?.txt2speech) {
        try {
          // Set state to thinking while voice is being prepared
          setState('thinking');

          const audio = await puter.ai.txt2speech(text, {
            provider: 'elevenlabs',
            voice: PREFERRED_VOICE_ID, // Anika - Warm Indian Voice
            model: 'eleven_flash_v2_5', // Faster generation than multilingual_v2
          });

          // Check if user interrupted while audio was synthesizing
          if (speechEpochRef.current !== currentEpoch) return;

          if (audio && typeof audio.play === 'function') {
            audioPlayerRef.current = audio;

            audio.onplay = () => {
              if (speechEpochRef.current === currentEpoch) {
                setState('speaking');
              }
            };

            audio.onended = () => {
              audioPlayerRef.current = null;
              if (speechEpochRef.current === currentEpoch) {
                if (onEndedCallback) onEndedCallback();
              }
            };

            audio.onerror = () => {
              audioPlayerRef.current = null;
              if (speechEpochRef.current === currentEpoch) {
                playFastFallbackTTS(text, currentEpoch, onEndedCallback);
              }
            };

            await audio.play();
            return;
          }
        } catch (err) {
          console.warn('Puter ElevenLabs Anika voice synthesis error, using resilient fallback:', err);
        }
      }

      // TIER 2: Fast Fallback Voice (Google Indian Voice / Web Speech)
      if (speechEpochRef.current === currentEpoch) {
        playFastFallbackTTS(text, currentEpoch, onEndedCallback);
      }
    },
    [stopAllSpeech, playFastFallbackTTS]
  );

  // Process user message via API & speak response
  const processUserMessage = useCallback(
    async (userText: string) => {
      const cleanText = userText.trim();
      if (!cleanText || isProcessingTurnRef.current) return;

      isProcessingTurnRef.current = true;
      stopAllSpeech();

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: cleanText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setCurrentTranscript('');
      setState('thinking');

      try {
        const history = [...messagesRef.current, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        });

        if (!res.ok) throw new Error('API failed');
        const data = await res.json();

        const aiReplyText = data.reply || 'मैंने आपकी बात नोट कर ली है। क्या आप कुछ और बताना चाहते हैं?';
        if (data.reportDraft) {
          setReportDraft(data.reportDraft);
        }

        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, aiMsg]);

        // Speak AI reply. When playback COMPLETELY finishes, restart listening for user
        await speakText(aiReplyText, () => {
          isProcessingTurnRef.current = false;
          if (isSessionActiveRef.current) {
            startListening();
          } else {
            setState('idle');
          }
        });
      } catch (err) {
        console.error('Error processing AI chat:', err);
        const fallbackText =
          'नमस्ते! मैंने आपकी बात सुन ली है। कृपया बताएं कि आपकी क्या समस्या है?';
        await speakText(fallbackText, () => {
          isProcessingTurnRef.current = false;
          if (isSessionActiveRef.current) {
            startListening();
          } else {
            setState('idle');
          }
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [speakText, stopAllSpeech]
  );

  // Ultra-accurate Speech-To-Text transcription:
  // 1. Puter.js GPT-4o Transcribe / Whisper-1 (keyless, free)
  // 2. Deepgram Nova-2 Fallback API
  const transcribeAudioBlob = async (blob: Blob): Promise<string> => {
    // 1. Try Puter.js Speech-to-Text
    const puter = typeof window !== 'undefined' ? (window as any).puter : null;
    if (puter?.ai?.speech2txt) {
      try {
        const res = await puter.ai.speech2txt(blob, {
          model: 'gpt-4o-mini-transcribe',
        });
        const transcript = typeof res === 'string' ? res : res?.text || '';
        if (transcript && transcript.trim()) {
          return transcript.trim();
        }
      } catch (err) {
        console.warn('Puter STT fallback to Deepgram:', err);
      }
    }

    // 2. Deepgram Nova-2 Fallback
    try {
      const response = await fetch('/api/deepgram/stt', {
        method: 'POST',
        headers: { 'Content-Type': blob.type || 'audio/webm' },
        body: blob,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.transcript && data.transcript.trim()) {
          return data.transcript.trim();
        }
      }
    } catch (e) {
      console.warn('Deepgram STT fetch error:', e);
    }
    return '';
  };

  // High-accuracy listening loop using real-time Web Speech with Puter/Deepgram backup
  const startListening = useCallback(async () => {
    if (typeof window === 'undefined' || !isSessionActiveRef.current) return;

    // Reset turn flags
    hasTranscribedTurnRef.current = false;
    audioChunksRef.current = [];

    // Stop any existing recognition instance cleanly
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN';

      recognition.onstart = () => {
        if (isSessionActiveRef.current && stateRef.current !== 'speaking') {
          setState('listening');
        }
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptText;
          } else {
            interim += transcriptText;
          }
        }

        const activeText = final || interim;
        setCurrentTranscript(activeText);

        // When speech recognition produces the final text, trigger response IMMEDIATELY (0ms delay)
        if (final && final.trim() && !hasTranscribedTurnRef.current) {
          hasTranscribedTurnRef.current = true;
          try {
            recognition.stop();
          } catch {}
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            try {
              mediaRecorderRef.current.stop();
            } catch {}
          }
          processUserMessage(final.trim());
        }
      };

      // CONTINUOUS PERSISTENCE: If user takes a pause, clicks photo/location, never drop call!
      recognition.onend = () => {
        if (
          isSessionActiveRef.current &&
          stateRef.current !== 'speaking' &&
          !isProcessingTurnRef.current
        ) {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        if (
          event.error !== 'aborted' &&
          isSessionActiveRef.current &&
          stateRef.current !== 'speaking'
        ) {
          setTimeout(() => {
            if (isSessionActiveRef.current && stateRef.current !== 'speaking') {
              try {
                recognition.start();
              } catch {}
            }
          }, 400);
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (e) {
        console.warn('Failed to start Web Speech recognition:', e);
      }
    }

    // Secondary backup recorder for environments with noisy microphones
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());

        // Only transcribe via cloud if Web Speech did not already handle this turn
        if (!hasTranscribedTurnRef.current && audioBlob.size > 0 && isSessionActiveRef.current) {
          setState('thinking');
          const accurateTranscript = await transcribeAudioBlob(audioBlob);
          if (accurateTranscript && !hasTranscribedTurnRef.current) {
            hasTranscribedTurnRef.current = true;
            processUserMessage(accurateTranscript);
          }
        }
      };

      mediaRecorder.start();
    } catch (err) {
      console.warn('Microphone MediaRecorder access warning:', err);
    }
  }, [processUserMessage, state]);

  // Start continuous Live Voice Call Session
  const startLiveSession = useCallback(async () => {
    isSessionActiveRef.current = true;
    isProcessingTurnRef.current = false;
    hasTranscribedTurnRef.current = false;
    stopAllSpeech();

    const welcomeText =
      'नमस्ते! मैं जनसेतु एआई मित्र हूँ। आप मुझसे बोलकर कोई भी नागरिक समस्या बताएं।';

    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    await speakText(welcomeText, () => {
      if (isSessionActiveRef.current) {
        startListening();
      }
    });
  }, [speakText, startListening, stopAllSpeech]);

  // Stop Live Voice Call Session
  const stopLiveSession = useCallback(() => {
    isSessionActiveRef.current = false;
    isProcessingTurnRef.current = false;
    stopAllSpeech();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    setState('idle');
  }, [stopAllSpeech]);

  const sendMessageText = useCallback(
    (text: string) => {
      processUserMessage(text);
    },
    [processUserMessage]
  );

  const clearChat = useCallback(() => {
    stopAllSpeech();
    setMessages([]);
    setReportDraft(null);
    setCurrentTranscript('');
  }, [stopAllSpeech]);

  return {
    state,
    messages,
    currentTranscript,
    reportDraft,
    isMuted,
    setIsMuted,
    startLiveSession,
    stopLiveSession,
    startListening,
    sendMessageText,
    clearChat,
  };
}
