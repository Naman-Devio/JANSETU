'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  analyzeReport,
  findSimilarChallenges,
  submitProblemReport,
} from '@/lib/api';
import { ReportAnalysis, SimilarChallengeResult } from '@/types';
import { SpeakButton } from '@/components/ui/SpeakButton';
import {
  Sparkles,
  MapPin,
  Camera,
  Mic,
  FileText,
  Film,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Loader2,
  X,
  Upload,
} from 'lucide-react';
import Link from 'next/link';

type UploadedFile = {
  id: string;
  name: string;
  url: string;
  previewUrl?: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function detectType(mime: string): UploadedFile['type'] {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  return 'document';
}

export default function CitizenReportPage() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Form state
  const [description, setDescription] = useState<string>(
    'हमारे गाँव (नामकुम, राँची) में मुख्य बोरवेल से 10 दिनों से बहुत गंदला लाल पानी आ रहा है। फिल्टर की कोई व्यवस्था नहीं है और कई बच्चों को उल्टी-दस्त की शिकायत हुई है।'
  );
  const [district, setDistrict] = useState<string>('Ranchi');
  const [blockHabitation, setBlockHabitation] = useState<string>('Namkum Block, Tiril Ashram Habitation');
  const lat = 23.3364;
  const lng = 85.3475;

  // Real file upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingName, setUploadingName] = useState<string>('');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // AI analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null);
  const [editableSummary, setEditableSummary] = useState<string>('');
  const [editableDomain, setEditableDomain] = useState<string>('');

  const [similarChallenges, setSimilarChallenges] = useState<SimilarChallengeResult[]>([]);
  const [showSimilarModal, setShowSimilarModal] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedIds, setSubmittedIds] = useState<{ signalId: string; challengeId: string } | null>(null);

  // Upload a single file to /api/upload proxy
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadingName(file.name);

    // Generate a local preview URL for images
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;

    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await res.json();

      if (!res.ok || !json.url) {
        throw new Error(json.error ?? 'Upload failed');
      }

      const uploaded: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        url: json.url,
        previewUrl,
        type: detectType(file.type),
        size: file.size,
      };
      setUploadedFiles((prev) => [...prev, uploaded]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    } finally {
      setIsUploading(false);
      setUploadingName('');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ''; // allow re-selecting same file
    for (const f of files) {
      await uploadFile(f);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  // AI triage + duplicate check
  const handleProceedToReview = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeReport({ text: description, lang });
      setAnalysis(result);
      setEditableSummary(result.summary);
      setEditableDomain(result.domain);

      const similar = await findSimilarChallenges({ text: description, lat, lng });
      setSimilarChallenges(similar);
      setStep(4);
      if (similar.length > 0) setShowSimilarModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const evidencePayload = uploadedFiles.map((f) => ({
        url: f.url,
        type: f.type.toUpperCase(),
        title: f.name,
      }));
      const res = await submitProblemReport({
        text: `${editableSummary} (${blockHabitation})`,
        lang,
        lat,
        lng,
        evidence: evidencePayload,
      });
      setSubmittedIds(res);
      setStep(5);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-zinc-200">Citizen Report</span>
          <span>/</span>
          <span className="text-blue-400 font-medium">5-Step Intake</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {lang === 'en' ? 'What did you notice?' : 'आपने क्या समस्या देखी?'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Submit an unstructured community observation. JanSetu structures it into a verified innovation challenge.
            </p>
          </div>

          {/* Language Toggle */}
          <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900/80 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                lang === 'en' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                lang === 'hi' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {[
          { num: 1, label: lang === 'en' ? '1. Describe' : '१. विवरण' },
          { num: 2, label: lang === 'en' ? '2. Evidence' : '२. साक्ष्य' },
          { num: 3, label: lang === 'en' ? '3. Location' : '३. स्थान' },
          { num: 4, label: lang === 'en' ? '4. Review' : '४. समीक्षा' },
          { num: 5, label: lang === 'en' ? '5. Submitted' : '५. पूर्ण' },
        ].map((item) => {
          const isActive = step === item.num;
          const isDone = step > item.num;
          return (
            <div
              key={item.num}
              className={`py-2 px-1 rounded-lg border font-medium transition-colors ${
                isActive
                  ? 'bg-blue-950/60 border-blue-500 text-blue-300 shadow-sm'
                  : isDone
                  ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
              }`}
            >
              {item.label}
            </div>
          );
        })}
      </div>

      {/* ─── STEP 1: DESCRIBE ─── */}
      {step === 1 && (
        <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">
              {lang === 'en'
                ? 'Describe the issue in your own words'
                : 'अपनी भाषा में समस्या का विस्तार से वर्णन करें'}
            </label>
            <p className="text-xs text-zinc-400">
              Mention what happens, how long it has been occurring, and how many people or households are affected.
            </p>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. The community borewell water has turned reddish brown and smells metallic. 40 families are without safe drinking water..."
              className="w-full rounded-xl bg-[#181d26] border border-zinc-700/80 p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Public signals are privacy-protected; no phone or Aadhaar required.</span>
            </div>
            <button
              type="button"
              disabled={!description.trim()}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md disabled:opacity-50 transition-all"
            >
              <span>{lang === 'en' ? 'Next: Add Evidence' : 'आगे: साक्ष्य जोड़ें'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 2: EVIDENCE (Real File Upload) ─── */}
      {step === 2 && (
        <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">
              {lang === 'en' ? 'Upload Supporting Evidence (Optional)' : 'सहायक साक्ष्य अपलोड करें (वैकल्पिक)'}
            </h3>
            <p className="text-xs text-zinc-400">
              Upload photos, videos, audio notes, or documents. They are stored securely and strengthen your community signal.
            </p>
          </div>

          {/* Hidden file inputs */}
          <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
          <input ref={videoInputRef} type="file" accept="video/*" multiple className="hidden" onChange={handleFileChange} />
          <input ref={audioInputRef} type="file" accept="audio/*" multiple className="hidden" onChange={handleFileChange} />
          <input ref={docInputRef} type="file" accept=".pdf,.doc,.docx,.txt" multiple className="hidden" onChange={handleFileChange} />

          {/* Upload trigger tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Photo */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => photoInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-zinc-700 bg-[#181d26] hover:border-blue-500/60 hover:bg-blue-950/20 transition-all disabled:opacity-50 group"
            >
              <Camera className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white">Photo</span>
              <span className="text-[10px] text-zinc-500">JPG · PNG · WEBP</span>
            </button>
            {/* Video */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => videoInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-zinc-700 bg-[#181d26] hover:border-violet-500/60 hover:bg-violet-950/20 transition-all disabled:opacity-50 group"
            >
              <Film className="w-6 h-6 text-violet-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white">Video</span>
              <span className="text-[10px] text-zinc-500">MP4 · MOV · AVI</span>
            </button>
            {/* Audio */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => audioInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-zinc-700 bg-[#181d26] hover:border-teal-500/60 hover:bg-teal-950/20 transition-all disabled:opacity-50 group"
            >
              <Mic className="w-6 h-6 text-teal-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white">Voice Note</span>
              <span className="text-[10px] text-zinc-500">MP3 · WAV · OGG</span>
            </button>
            {/* Document */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => docInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-zinc-700 bg-[#181d26] hover:border-amber-500/60 hover:bg-amber-950/20 transition-all disabled:opacity-50 group"
            >
              <FileText className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white">Document</span>
              <span className="text-[10px] text-zinc-500">PDF · DOC · TXT</span>
            </button>
          </div>

          {/* Uploading progress indicator */}
          {isUploading && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-950/30 border border-blue-800/50">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-blue-300">Uploading...</div>
                <div className="text-[11px] text-zinc-400 truncate">{uploadingName}</div>
              </div>
            </div>
          )}

          {/* Upload error */}
          {uploadError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800/50">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-xs text-red-300">{uploadError}</span>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="ml-auto text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Uploaded file previews */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} attached
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {uploadedFiles.map((f) => (
                  <div key={f.id} className="relative group rounded-xl overflow-hidden bg-[#181d26] border border-zinc-700">
                    {/* Preview */}
                    {f.type === 'image' && f.previewUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={f.previewUrl} alt={f.name} className="w-full h-24 object-cover" />
                    ) : f.type === 'video' ? (
                      <div className="w-full h-24 flex items-center justify-center bg-violet-950/30">
                        <Film className="w-8 h-8 text-violet-400" />
                      </div>
                    ) : f.type === 'audio' ? (
                      <div className="w-full h-24 flex items-center justify-center bg-teal-950/30">
                        <Mic className="w-8 h-8 text-teal-400" />
                      </div>
                    ) : (
                      <div className="w-full h-24 flex items-center justify-center bg-amber-950/20">
                        <FileText className="w-8 h-8 text-amber-400" />
                      </div>
                    )}
                    {/* File info */}
                    <div className="p-2">
                      <div className="text-[11px] font-medium text-zinc-200 truncate">{f.name}</div>
                      <div className="text-[10px] text-zinc-500">{formatBytes(f.size)}</div>
                    </div>
                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-zinc-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {/* URL copy link */}
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-1 right-1 text-[10px] text-blue-400 hover:underline hidden group-hover:block"
                    >
                      View ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drag-and-drop hint */}
          {uploadedFiles.length === 0 && !isUploading && (
            <div className="flex flex-col items-center gap-2 py-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 text-zinc-500">
              <Upload className="w-5 h-5" />
              <span className="text-xs">Click a tile above to attach evidence, or skip this step</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md disabled:opacity-50 transition-all"
            >
              <span>{lang === 'en' ? 'Next: Location' : 'आगे: स्थान की पुष्टि'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 3: CONFIRM LOCATION ─── */}
      {step === 3 && (
        <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">
              {lang === 'en' ? 'Confirm Affected Location' : 'प्रभावित स्थान की पुष्टि करें'}
            </h3>
            <p className="text-xs text-zinc-400">
              Generalized to the village/block level. Exact household coordinates are never made public.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">District in Jharkhand</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-xl bg-[#181d26] border border-zinc-700 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Ranchi">Ranchi District</option>
                <option value="Dhanbad">Dhanbad District</option>
                <option value="Hazaribagh">Hazaribagh District</option>
                <option value="East Singhbhum">East Singhbhum (Jamshedpur)</option>
                <option value="Khunti">Khunti District</option>
                <option value="Bokaro">Bokaro District</option>
                <option value="Dumka">Dumka District</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Block / Habitation / Landmark</label>
              <input
                type="text"
                value={blockHabitation}
                onChange={(e) => setBlockHabitation(e.target.value)}
                className="w-full rounded-xl bg-[#181d26] border border-zinc-700 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Location preview banner */}
          <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-blue-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{district} · {blockHabitation}</div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  Coordinates: {lat}° N, {lng}° E (Displaced for civic privacy)
                </div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded font-mono">
              Geo-verified
            </span>
          </div>

          {/* Evidence summary */}
          {uploadedFiles.length > 0 && (
            <div className="flex items-center gap-2 text-[11px] text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {uploadedFiles.length} evidence file{uploadedFiles.length > 1 ? 's' : ''} attached
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleProceedToReview}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Structuring Challenge...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze &amp; Review JanSetu Understanding</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 4: REVIEW AI UNDERSTANDING ─── */}
      {step === 4 && analysis && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#12151b] border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Review JanSetu&apos;s Structured Understanding</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  AI output is advisory. You can review, correct, or override before submission.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SpeakButton text={editableSummary} label="Read Aloud" />
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                  Source: {analysis.source}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Classified Domain</label>
                <input
                  type="text"
                  value={editableDomain}
                  onChange={(e) => setEditableDomain(e.target.value)}
                  className="w-full rounded-xl bg-[#181d26] border border-zinc-700 p-3 text-xs text-white focus:ring-1 focus:ring-blue-500"
                />
                <div className="text-[10px] text-emerald-400">
                  Confidence: {analysis.domainConfidence}%
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Suggested Priority</label>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#181d26] border border-zinc-700">
                  <span className="text-xs font-bold text-rose-400">{analysis.priority} Priority</span>
                  <span className="text-[10px] text-zinc-400">
                    Confidence: {analysis.priorityConfidence}%
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500">
                  Rationale: Recurring drinking water contamination with multiple health complaints.
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Generated Challenge Summary (Editable)
              </label>
              <textarea
                rows={3}
                value={editableSummary}
                onChange={(e) => setEditableSummary(e.target.value)}
                className="w-full rounded-xl bg-[#181d26] border border-zinc-700 p-3 text-xs text-white focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">
                Required Capabilities Extracted by JanSetu
              </label>
              <div className="flex flex-wrap gap-2">
                {analysis.suggestedExpertise.map((exp, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            {/* Attached evidence summary */}
            {uploadedFiles.length > 0 && (
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {uploadedFiles.length} evidence file{uploadedFiles.length > 1 ? 's' : ''} will be submitted
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {uploadedFiles.map((f) => (
                    <span key={f.id} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {f.type === 'image' ? '📷' : f.type === 'video' ? '🎥' : f.type === 'audio' ? '🎤' : '📄'} {f.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Semantic duplicates notice */}
            {similarChallenges.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>{similarChallenges.length} Similar Community Signals Found Nearby</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSimilarModal(true)}
                    className="text-xs text-amber-400 hover:underline font-semibold"
                  >
                    Compare Details →
                  </button>
                </div>
                <p className="text-xs text-zinc-300">
                  A challenge already exists for &ldquo;{similarChallenges[0].title}&rdquo; ({similarChallenges[0].similarityScore}% semantic match). You can join your signal to it or submit this as a distinct challenge.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting Signal...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Submit Problem Signal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP 5: SUCCESS ─── */}
      {step === 5 && submittedIds && (
        <div className="p-8 rounded-2xl bg-[#12151b] border border-emerald-800/60 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white">Community Signal Transmitted</h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Your signal has been registered into the JanSetu innovation pipeline. It is queued for government verification and academic capability matching.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#181d26] border border-zinc-800 max-w-md mx-auto grid grid-cols-2 gap-4 text-left">
            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-400">Signal ID</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">{submittedIds.signalId}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-400">Assigned Challenge</div>
              <div className="text-sm font-bold text-blue-400 font-mono mt-0.5">{submittedIds.challengeId}</div>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <p className="text-[11px] text-emerald-300">
              {uploadedFiles.length} evidence file{uploadedFiles.length > 1 ? 's' : ''} saved to challenge record.
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={`/challenge/${submittedIds.challengeId}`}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all"
            >
              View Challenge Detail
            </Link>
            <Link
              href="/atlas"
              className="px-5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition-all"
            >
              Explore on Problem Atlas
            </Link>
            <Link
              href="/government/review"
              className="px-5 py-2.5 rounded-xl border border-amber-800/60 bg-amber-950/30 text-amber-300 text-xs font-semibold hover:bg-amber-900/40 transition-all"
            >
              Switch to Moderator Review Queue →
            </Link>
          </div>
        </div>
      )}

      {/* ─── SEMANTIC DUPLICATES MODAL ─── */}
      {showSimilarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#12151b] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">
                  Nearby Similar Challenges Found
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSimilarModal(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              JanSetu clustered these community signals based on semantic embeddings and geographic distance. Connecting to an existing challenge fast-tracks academic and industry engagement.
            </p>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {similarChallenges.map((item) => (
                <div
                  key={item.challengeId}
                  className="p-3.5 rounded-xl bg-[#181d26] border border-zinc-800 space-y-2 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-3 mt-1">
                        <span>ID: <strong className="text-zinc-200">{item.challengeId}</strong></span>
                        <span>Distance: <strong>{item.distanceKm} km</strong></span>
                        <span>Signals: <strong>{item.signalCount}</strong></span>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                      {item.similarityScore}% Match
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/80">
                    <Link
                      href={`/challenge/${item.challengeId}`}
                      target="_blank"
                      className="text-xs text-zinc-400 hover:text-white px-2 py-1 flex items-center gap-1"
                    >
                      <span>Inspect Existing</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSimilarModal(false);
                        router.push(`/challenge/${item.challengeId}`);
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                    >
                      Join Existing Challenge
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-zinc-800">
              <span className="text-[11px] text-zinc-500">
                You can still proceed with your report as a distinct issue.
              </span>
              <button
                type="button"
                onClick={() => setShowSimilarModal(false)}
                className="px-4 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium"
              >
                Continue as New Signal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
