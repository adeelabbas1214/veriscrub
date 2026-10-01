'use client';

import { useState } from 'react';
import PrivacyMeshCanvas from '../components/PrivacyMeshCanvas';
import Logo from '../components/Logo';
import { buildDocumentPipeline, DocumentVariants } from '../lib/pipeline';

interface UploadMetrics {
  rawBytes: number;
  dimensions: string;
  fileName: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DocumentVariants | null>(null);
  const [metrics, setMetrics] = useState<UploadMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'blur' | 'pixel' | 'scanner'>('blur');
  const [sliderPos, setSliderPos] = useState<number>(50);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResults(null);
      setMetrics(null);
      setError(null);
    }
  };

  const handleUploadAndScrub = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const signRes = await fetch('/api/sign-intake', { method: 'POST' });
      if (!signRes.ok) throw new Error('Handshake failed');
      const signData = await signRes.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signData.apiKey);
      formData.append('timestamp', signData.timestamp.toString());
      formData.append('signature', signData.signature);
      formData.append('folder', signData.folder);
      formData.append('transformation', signData.transformation);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!uploadRes.ok) {
        const errJson = await uploadRes.json();
        throw new Error(errJson.error?.message || 'Ingestion failed');
      }

      const uploadData = await uploadRes.json();
      const pipelineVariants = buildDocumentPipeline(signData.cloudName, uploadData.public_id);

      setMetrics({
        rawBytes: uploadData.bytes,
        dimensions: `${uploadData.width} × ${uploadData.height}`,
        fileName: file.name,
      });
      setResults(pipelineVariants);
    } catch (err: any) {
      setError(err.message || 'Processing failed');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUrl = () => {
    if (!results) return '';
    if (activeTab === 'pixel') return results.auditPixelated;
    if (activeTab === 'blur') return results.auditBlurred;
    return results.scannerContrast;
  };

  return (
    <main className="relative min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
      {/* Background Motion Canvas */}
      <PrivacyMeshCanvas />

      {/* Top Navbar */}
      <nav className="relative z-10 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center space-x-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Zero-Trust Shield Active</span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Header */}
        <section className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
            Automated Visual PII Redactor
          </h1>
          <p className="text-sm text-slate-400">
            Intelligently obscures facial PII and embeds official audit protection badges on identification documents.
          </p>
        </section>

        {/* Upload Card */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
          <div className="space-y-5">
            <div className="border-2 border-dashed border-slate-700/80 hover:border-emerald-500/50 transition-all rounded-xl p-8 text-center relative group bg-slate-950/40">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              {preview ? (
                <div className="space-y-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-56 mx-auto rounded-lg shadow-md border border-slate-800 object-contain"
                  />
                  <p className="text-xs text-slate-400 font-mono">
                    {file?.name} • {((file?.size || 0) / 1024).toFixed(1)} KB
                  </p>
                  <span className="text-xs text-emerald-400 underline">Click to choose a different document</span>
                </div>
              ) : (
                <div className="space-y-3 py-6">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:scale-105 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium text-slate-200">
                    Upload ID card, passport, or document scan
                  </div>
                  <p className="text-xs text-slate-500">Supports PNG, JPG, or WEBP</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUploadAndScrub}
                disabled={!file || loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Scrubbing Media...</span>
                  </>
                ) : (
                  <span>Sanitize & Redact Document</span>
                )}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl">
                {error}
              </div>
            )}
          </div>
        </section>

        {/* Results & Inspection Section */}
        {results && (
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
              {/* Tabs */}
              <div className="flex items-center space-x-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('blur')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'blur'
                      ? 'bg-emerald-500 text-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Gaussian Blur
                </button>
                <button
                  onClick={() => setActiveTab('pixel')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'pixel'
                      ? 'bg-emerald-500 text-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pixelate
                </button>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'scanner'
                      ? 'bg-emerald-500 text-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Scanner Enhancer
                </button>
              </div>

              {/* Action Button */}
              <button
                onClick={() => window.open(getCurrentUrl(), '_blank')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Open Full Asset
              </button>
            </div>

            {/* Split View Interactive Slider */}
            <div className="space-y-3">
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[520px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 select-none">
                {/* Redacted image */}
                <img
                  src={getCurrentUrl()}
                  alt="Redacted document"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />

                {/* Original raw image */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={results.rawOptimized}
                    alt="Raw document"
                    className="absolute inset-0 w-full h-full object-contain max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute top-3 left-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-white/10">
                    RAW ORIGINAL
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-emerald-950/80 px-2.5 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                  REDACTED
                </div>

                {/* Slider divider */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-400 text-black flex items-center justify-center font-bold text-[10px] shadow-lg shadow-emerald-500/50">
                    ↔
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
                <span>Drag divider horizontally to inspect redactions</span>
                {metrics && (
                  <span>
                    {metrics.dimensions} • {(metrics.rawBytes / 1024).toFixed(1)} KB
                  </span>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}