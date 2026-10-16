'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, Clock, Sparkles, AlertCircle, ArrowRight, Sliders } from 'lucide-react';

export default function HomePage() {
  const [prompt, setPrompt] = useState<string>('');
  const [timeValue, setTimeValue] = useState<number>(24);
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('hours');
  const [defaultDelay, setDefaultDelay] = useState<number>(0);
  const [defaultStatus, setDefaultStatus] = useState<number>(200);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{ endpointId: string; url: string; expiresAt: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Convert time value to hours for backend processing (Max 48 hours, Min 3 minutes ~0.05 hours)
    let lifespanHours = timeUnit === 'minutes' ? timeValue / 60 : timeValue;
    lifespanHours = Math.max(0.05, Math.min(lifespanHours, 48));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, lifespanHours }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate mock endpoint.');
      }

      // Build final URL with optional built-in defaults if user set them
      let finalUrl = data.url;
      const params = new URLSearchParams();
      if (defaultDelay > 0) params.append('delay', defaultDelay.toString());
      if (defaultStatus !== 200) params.append('status', defaultStatus.toString());
      if (params.toString()) {
        finalUrl += `?${params.toString()}`;
      }

      setResult({
        endpointId: data.endpointId,
        url: finalUrl,
        expiresAt: data.expiresAt,
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    const fullUrl = `${window.location.origin}${text}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">
            <Terminal className="w-4 h-4" /> Stanza Mock Engine v1.0
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Instant Stateful Mock APIs</h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Transform text descriptions into live mock endpoints instantly with custom expiration lifespans.
          </p>
        </div>

        {/* Generator Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
          <form onSubmit={handleGenerate} className="space-y-5">
            
            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Describe your mock data structure or scenario
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., E-commerce list of products with id, title, price, and stock status..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                required
              />
            </div>

            {/* Flexible TTL Input (Minutes / Hours) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" /> Endpoint Lifespan (Min: 3m, Max: 48h)
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  min={timeUnit === 'minutes' ? 3 : 1}
                  max={timeUnit === 'minutes' ? 2880 : 48}
                  value={timeValue}
                  onChange={(e) => setTimeValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
                <select
                  value={timeUnit}
                  onChange={(e) => {
                    setTimeUnit(e.target.value as 'minutes' | 'hours');
                    setTimeValue(e.target.value === 'minutes' ? 30 : 24);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors w-36"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>

            {/* Direct Advanced Simulation Controls (Delay & Status) */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Simulated Delay (ms)
                </label>
                <input
                  type="number"
                  min={0}
                  max={10000}
                  step={100}
                  value={defaultDelay}
                  onChange={(e) => setDefaultDelay(Number(e.target.value))}
                  placeholder="e.g. 500"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Response Status Code
                </label>
                <select
                  value={defaultStatus}
                  onChange={(e) => setDefaultStatus(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value={200}>200 OK (Success)</option>
                  <option value={201}>201 Created</option>
                  <option value={400}>400 Bad Request</option>
                  <option value={401}>401 Unauthorized</option>
                  <option value={404}>404 Not Found</option>
                  <option value={500}>500 Internal Error</option>
                </select>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Deploying Endpoint...' : 'Generate Live Mock API'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Generated Result View */}
          {result && (
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Endpoint Live</span>
                <span className="text-xs text-slate-400">Expires: {new Date(result.expiresAt).toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-3">
                <code className="text-xs text-emerald-300 font-mono truncate flex-1">
                  {typeof window !== 'undefined' ? window.location.origin : ''}{result.url}
                </code>
                <button
                  onClick={() => copyToClipboard(result.url)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-md transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}