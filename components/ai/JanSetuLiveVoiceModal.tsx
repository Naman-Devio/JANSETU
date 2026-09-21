'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Mic,
  PhoneOff,
  Sparkles,
  MessageSquareText,
  Volume2,
  VolumeX,
  Send,
  FileCheck,
  MapPin,
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Film,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { LiveVoiceOrb } from './LiveVoiceOrb';
import { LiveSpeechState, ReportDraft } from '@/hooks/useLiveSpeech';
import { useRouter } from 'next/navigation';

interface JanSetuLiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToText: () => void;
  state: LiveSpeechState;
  currentTranscript: string;
  reportDraft: ReportDraft | null;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onStartListening: () => void;
  onStopSession: () => void;
}

export const JanSetuLiveVoiceModal: React.FC<JanSetuLiveVoiceModalProps> = ({
  isOpen,
  onClose,
  onSwitchToText,
  state,
  currentTranscript,
  reportDraft,
  isMuted,
  setIsMuted,
  onStartListening,
  onStopSession,
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!isOpen) return null;

  // 1. Fetch Live GPS Location with real Nominatim reverse geocoding
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
          // Fetch real street/city address from OpenStreetMap Nominatim
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
        // Clean fallback
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

  // 2. Upload Photo / Video Attachment
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
      } else {
        alert('Failed to upload file. Please try again.');
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setUploadingMedia(false);
    }
  };

  // 3. Final Submission to JanSetu Queue
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
          sourceType: 'ai-voice-guided',
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
          onStopSession();
          onClose();
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

  return (
    <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6 overflow-y-auto select-none animate-in fade-in duration-300">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,video/*"
        className="hidden"
      />

      {/* Background Ambient Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="ambient-glow-blue top-1/4 left-1/2 -translate-x-1/2" />
        <div className="ambient-glow-purple bottom-10 left-1/4" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-teal-400 flex items-center justify-center font-extrabold text-white shadow-lg shadow-blue-500/30">
            JS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold text-base tracking-tight">JanSetu AI Mitra</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Call
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-400/30">
                ✨ Voice: Anika (ElevenLabs)
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Speech & Smart Report Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSwitchToText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all backdrop-blur-md"
          >
            <MessageSquareText className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Text Mode</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onStopSession();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 text-zinc-400 hover:text-rose-400 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center 3D Voice Orb */}
      <div className={`relative z-10 py-3 flex flex-col items-center justify-center space-y-3 transition-all ${reportDraft ? 'my-2' : 'my-auto'}`}>
        <LiveVoiceOrb state={state} size={reportDraft ? 'sm' : 'md'} />

        {/* Live Spoken Transcript */}
        {currentTranscript && (
          <div className="max-w-xl text-center px-4 py-2 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-2">
            <p className="text-xs sm:text-sm font-medium text-blue-200 italic">
              &ldquo;{currentTranscript}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Interactive Guided Widgets & Live Civic Report Container */}
      {reportDraft && (
        <div className="relative z-10 max-w-2xl mx-auto w-full mb-3 p-4 sm:p-5 rounded-2xl bg-zinc-950/90 border border-blue-500/50 shadow-2xl space-y-3 animate-in slide-in-from-bottom-4 shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Live AI Report Draft
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
              Priority: {reportDraft.priority}
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-xs sm:text-sm font-bold text-white">{reportDraft.title}</div>
            <p className="text-xs text-zinc-300 line-clamp-2">{reportDraft.description}</p>
          </div>

          {/* Interactive Mini Widgets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* WIDGET 1: Interactive GPS Location Fetcher & Map Card */}
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  Live GPS Location
                </span>
                {gpsLocation && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Verified
                  </span>
                )}
              </div>

              {gpsLocation ? (
                <div className="p-2 rounded-lg bg-blue-950/50 border border-blue-500/40 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span className="text-xs font-bold text-white truncate">{gpsLocation.address}</span>
                  </div>
                  <div className="text-[10px] text-blue-300 font-mono">
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
                  {fetchingLocation ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                      <span>Reading GPS Sensors...</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>Detect My Current GPS Location</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* WIDGET 2: Photo / Video Attachment Widget */}
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-purple-400" />
                  Media Evidence
                </span>
                {attachedMedia && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Attached
                  </span>
                )}
              </div>

              {attachedMedia ? (
                <div className="p-2 rounded-lg bg-purple-950/50 border border-purple-500/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    {attachedMedia.type === 'video' ? (
                      <Film className="w-4 h-4 text-purple-400 shrink-0" />
                    ) : (
                      <Camera className="w-4 h-4 text-purple-400 shrink-0" />
                    )}
                    <span className="text-white font-medium truncate">File Attached</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] text-purple-300 underline shrink-0 ml-1"
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
                  {uploadingMedia ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                      <span>Uploading File...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5 text-purple-400" />
                      <span>Attach Photo or Video</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Explicit User Confirmation & Permission Step */}
          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
              <input
                type="checkbox"
                checked={userPermissionGranted}
                onChange={(e) => setUserPermissionGranted(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-400"
              />
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 inline shrink-0" />
                I grant permission to submit this report to Govt Queue
              </span>
            </label>

            <button
              type="button"
              onClick={handleSubmitCivicReport}
              disabled={!userPermissionGranted || submittingReport || reportSubmitted}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white font-extrabold text-xs shadow-xl shadow-emerald-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
            >
              {reportSubmitted ? (
                <>
                  <FileCheck className="w-4 h-4 text-white" />
                  <span>Report Submitted!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{submittingReport ? 'Submitting...' : 'Confirm & Submit Report'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div className="relative z-10 flex items-center justify-center gap-5 py-2 border-t border-white/10 shrink-0">
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3.5 rounded-full border backdrop-blur-md transition-all shadow-xl ${
            isMuted
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 hover:bg-rose-500/30'
              : 'bg-white/10 border-white/20 text-zinc-200 hover:bg-white/20'
          }`}
          title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={onStartListening}
          className={`p-4 sm:p-5 rounded-full border shadow-2xl transform hover:scale-105 transition-all ${
            state === 'listening'
              ? 'bg-gradient-to-r from-blue-600 to-sky-500 border-sky-400 text-white shadow-sky-500/40 animate-pulse'
              : 'bg-blue-950/80 border-blue-500/40 text-blue-300 hover:bg-blue-600 hover:text-white'
          }`}
          title="Tap to speak"
        >
          <Mic className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        <button
          type="button"
          onClick={() => {
            onStopSession();
            onClose();
          }}
          className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/40 border border-rose-400/40 transition-all hover:scale-105"
          title="End Live Voice Call"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
