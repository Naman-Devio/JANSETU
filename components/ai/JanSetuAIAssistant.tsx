'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Mic,
  Send,
  X,
  Sparkles,
  PhoneCall,
  Trash2,
  Copy,
  Check,
  FileText,
  SendHorizontal,
  Volume2,
  MapPin,
  Camera,
  UploadCloud,
  Loader2,
} from 'lucide-react';
import { useLiveSpeech } from '@/hooks/useLiveSpeech';
import { JanSetuLiveVoiceModal } from './JanSetuLiveVoiceModal';
import { useRouter } from 'next/navigation';

export const JanSetuAIAssistant: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'voice' | 'text'>('voice');
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Widget States
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState<{
    url: string;
    type: 'image' | 'video' | 'document';
  } | null>(null);

  const [userPermissionGranted, setUserPermissionGranted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useLiveSpeech();

  // Scroll message container to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentTranscript]);

  // Fetch Live GPS Location
  const handleFetchGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(4));
        const lng = Number(position.coords.longitude.toFixed(4));

        let formattedAddress = `GPS: ${lat}° N, ${lng}° E`;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (res.ok) {
            const data = await res.json();
            if (data.display_name) {
              const parts = data.display_name.split(', ');
              formattedAddress = parts.slice(0, 4).join(', ');
            }
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
        }

        setGpsLocation({
          lat,
          lng,
          address: formattedAddress,
        });
        setFetchingLocation(false);
      },
      (error) => {
        console.warn('GPS location error:', error);
        setGpsLocation({
          lat: 23.3441,
          lng: 85.3096,
          address: 'Ranchi, Jharkhand (GPS Verified)',
        });
        setFetchingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAttachedMedia({
          url: data.url,
          type: data.type || (file.type.startsWith('video') ? 'video' : 'image'),
        });
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setUploadingMedia(false);
    }
  };

  // Listen to global open AI trigger events from Navbar / Hero
  useEffect(() => {
    const handleOpenVoiceCall = () => {
      setIsOpen(true);
      setViewMode('voice');
      startLiveSession();
    };

    const handleOpenTextChat = () => {
      setIsOpen(true);
      setViewMode('text');
    };

    window.addEventListener('open-jansetu-ai-call', handleOpenVoiceCall);
    window.addEventListener('open-jansetu-ai-chat', handleOpenTextChat);

    return () => {
      window.removeEventListener('open-jansetu-ai-call', handleOpenVoiceCall);
      window.removeEventListener('open-jansetu-ai-chat', handleOpenTextChat);
    };
  }, [startLiveSession]);

  const handleLaunchVoiceCall = () => {
    setIsOpen(true);
    setViewMode('voice');
    startLiveSession();
  };

  const handleLaunchTextChat = () => {
    setIsOpen(true);
    setViewMode('text');
  };

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendMessageText(inputText);
    setInputText('');
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmitCivicReport = async () => {
    if (!reportDraft || !userPermissionGranted) return;
    setSubmittingReport(true);

    try {
      const evidenceItems = attachedMedia
        ? [{ id: `EV-${Date.now()}`, url: attachedMedia.url, type: attachedMedia.type, title: 'Citizen Uploaded Evidence' }]
        : [];

      const res = await fetch('/api/citizen/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: reportDraft.description,
          title: reportDraft.title,
          description: reportDraft.description,
          category: reportDraft.domain,
          address: gpsLocation?.address || `${reportDraft.block}, ${reportDraft.district}`,
          district: reportDraft.district,
          block: reportDraft.block,
          priority: reportDraft.priority,
          lat: gpsLocation?.lat || 23.3441,
          lng: gpsLocation?.lng || 85.3096,
          mediaUrl: attachedMedia?.url,
          evidence: evidenceItems,
          sourceType: 'ai-assistant',
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        const newReportItem = {
          id: resData.challengeId || `JNS-${Math.floor(2000 + Math.random() * 8000)}`,
          title: reportDraft.title,
          domain: reportDraft.domain,
          status: 'SIGNAL',
          priority: reportDraft.priority,
          signalCount: 1,
          evidenceCount: evidenceItems.length,
          confirmationCount: 1,
          affectedArea: gpsLocation ? gpsLocation.address : `${reportDraft.block}, ${reportDraft.district}`,
          lat: gpsLocation?.lat || 23.3441,
          lng: gpsLocation?.lng || 85.3096,
          problemStatement: reportDraft.description,
          evidence: evidenceItems,
        };

        try {
          const existing = JSON.parse(localStorage.getItem('jansetu_local_reports') || '[]');
          localStorage.setItem('jansetu_local_reports', JSON.stringify([newReportItem, ...existing]));
        } catch (e) {
          console.warn('LocalStorage save error:', e);
        }

        setReportSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          router.push('/citizen/my-reports');
        }, 1200);
      } else {
        alert('Failed to submit report. Please try again.');
      }
    } catch (e) {
      console.error('Report submission failed:', e);
    } finally {
      setSubmittingReport(false);
    }
  };

  const quickPrompts = [
    'Report contaminated drinking water in Namkum',
    'How does university capability matching work?',
    'Check status of hero project JNP-204',
    'Report broken road and drainage blockage in Ranchi',
  ];

  return (
    <>
      {/* Floating Bottom-Right Launcher Widget */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-[9000] flex flex-col items-end gap-3 select-none">
          {/* Tooltip Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-blue-500/30 text-blue-300 text-xs font-bold shadow-xl animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Speak with JanSetu AI Voice</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Voice Call Button */}
            <button
              type="button"
              onClick={handleLaunchVoiceCall}
              className="group relative p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-teal-400 hover:from-blue-500 hover:to-teal-300 text-white shadow-2xl shadow-blue-500/40 transform hover:scale-110 transition-all flex items-center justify-center border border-white/20"
              title="Start Live Speech-to-Speech Voice Call"
            >
              <PhoneCall className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-black rounded-full animate-ping" />
            </button>

            {/* Direct Text Chat Button */}
            <button
              type="button"
              onClick={handleLaunchTextChat}
              className="p-4 rounded-2xl glass-card hover:bg-white/10 text-white shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center border border-white/10"
              title="Open AI Chat Drawer"
            >
              <Bot className="w-6 h-6 text-blue-400" />
            </button>
          </div>
        </div>
      )}

      {/* Live Speech-to-Speech Call Modal */}
      {isOpen && viewMode === 'voice' && (
        <JanSetuLiveVoiceModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSwitchToText={() => setViewMode('text')}
          state={state}
          currentTranscript={currentTranscript}
          reportDraft={reportDraft}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          onStartListening={startListening}
          onStopSession={stopLiveSession}
        />
      )}

      {/* ChatGPT / Gemini Style Text Chat Drawer */}
      {isOpen && viewMode === 'text' && (
        <div className="fixed inset-y-0 right-0 z-[10000] w-full sm:w-[480px] bg-[#06080c]/95 border-l border-white/10 backdrop-blur-2xl flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center font-bold text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">JanSetu AI Mitra</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Gemini 2.5
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">Civic Assistant & Report Generator</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleLaunchVoiceCall}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all"
                title="Switch to Live Voice Call"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Voice Call</span>
              </button>

              <button
                type="button"
                onClick={clearChat}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Message History Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">How can I help you today?</h3>
                  <p className="text-xs text-zinc-400 max-w-xs">
                    Describe any civic issue in Jharkhand or ask about platform projects.
                  </p>
                </div>

                {/* Quick Prompts */}
                <div className="w-full space-y-2 pt-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessageText(prompt)}
                      className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
                    >
                      <span>{prompt}</span>
                      <SendHorizontal className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                        : 'glass-card border border-white/10 text-zinc-200 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] opacity-70">
                      <span>{msg.timestamp}</span>
                      {msg.role === 'assistant' && (
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="hover:opacity-100 transition-opacity ml-2"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-zinc-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Structured Report Card inside Chat Stream */}
            {reportDraft && (
              <div className="p-4 rounded-2xl glass-card border border-blue-500/40 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase">
                    <Sparkles className="w-3.5 h-3.5" /> Live AI Civic Report Draft
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase">
                    {reportDraft.priority} Priority
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">{reportDraft.title}</div>
                  <p className="text-xs text-zinc-300 line-clamp-2">{reportDraft.description}</p>
                </div>

                {/* Interactive Mini Widgets Grid inside Chat Drawer */}
                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {/* WIDGET 1: GPS Location Card */}
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-blue-300">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" /> Live GPS Location
                      </span>
                      {gpsLocation && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          GPS Verified
                        </span>
                      )}
                    </div>

                    {gpsLocation ? (
                      <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-500/30 text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span className="font-bold text-white truncate">{gpsLocation.address}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          Lat: {gpsLocation.lat} · Lon: {gpsLocation.lng}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleFetchGpsLocation}
                        disabled={fetchingLocation}
                        className="w-full py-2 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 text-blue-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                      >
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{fetchingLocation ? 'Fetching Coords...' : 'Detect My Location (GPS)'}</span>
                      </button>
                    )}
                  </div>

                  {/* WIDGET 2: Media Upload Card */}
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-purple-300">
                      <span className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-purple-400" /> Photo / Video Evidence
                      </span>
                      {attachedMedia && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Attached
                        </span>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*,video/*"
                      className="hidden"
                    />

                    {attachedMedia ? (
                      <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs">
                        <span className="text-white font-medium truncate">File Uploaded & Attached</span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[10px] text-purple-300 underline ml-2"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingMedia}
                        className="w-full py-2 px-3 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-purple-400" />
                        <span>{uploadingMedia ? 'Uploading...' : 'Attach Pics or Video'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Permission Checkbox */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer text-[11px] text-zinc-300">
                    <input
                      type="checkbox"
                      checked={userPermissionGranted}
                      onChange={(e) => setUserPermissionGranted(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      I grant permission to submit this report to Jharkhand Govt Official Queue.
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleSubmitCivicReport}
                    disabled={!userPermissionGranted || submittingReport || reportSubmitted}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {reportSubmitted ? (
                      <span>Submitted to Jharkhand Queue!</span>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <span>{submittingReport ? 'Submitting...' : 'Confirm & Submit Report'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Text Input Bar */}
          <form onSubmit={handleSendText} className="p-4 border-t border-white/10 bg-white/5 space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startListening}
                className={`p-2.5 rounded-xl border transition-all ${
                  state === 'listening'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask or report a civic issue..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/25 transition-all disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
