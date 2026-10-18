"use client";

import Footer from '@/src/components/Footer';
import Instructions from '@/src/components/Instructions';
import JsonPreview from '@/src/components/JsonPreview';
import Navbar from '@/src/components/Navbar';
import ToggleSwitch from '@/src/components/ToggleSwitch';
import { AlertCircle, ArrowRight, Clock, Layers, Sliders, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

export default function HomePage() {
  const [prompt, setPrompt] = useState<string>('');
  const [timeValue, setTimeValue] = useState<number>(24);
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('hours');
  const [defaultDelay, setDefaultDelay] = useState<number>(0);
  const [defaultStatus, setDefaultStatus] = useState<number>(200);
  const [isList, setIsList] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{ endpointId: string; url: string; expiresAt: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);
    setResult(null);

    let lifespanHours = timeUnit === 'minutes' ? timeValue / 60 : timeValue;
    lifespanHours = Math.max(0.05, Math.min(lifespanHours, 48));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, lifespanHours, isList }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate mock endpoint.');
      }

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
      setCopied(false);
    }
  };

  const copyToClipboard = (text: string) => {
    const fullUrl = `${window.location.origin}${text}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Navbar />

        <header className="text-center space-y-3 mb-6">
          <h1 className="text-4xl font-extrabold">Instant Stateful Mock APIs</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Transform text descriptions into live mock endpoints instantly with custom expiration lifespans and query-parameter overrides for delay/status.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow">
              <form onSubmit={handleGenerate} className="space-y-5">

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Describe your mock data structure or scenario
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., E-commerce product list with id, name, price, and availability status..."
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    required
                  />
                </div>

                {/* Response Structure Toggle (List vs Single Item) */}
                <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                  <div className="space-y-0.5">
                    <label className="text-xs text-slate-400 flex items-center gap-2 cursor-pointer">
                      <Layers className="w-4 h-4 text-amber-400" /> Toggle off if you only need a single item object schema.
                    </label>
                  </div>
                  <ToggleSwitch
                    checked={isList}
                    onChange={(e) => setIsList(e.target.checked)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" /> Endpoint Lifespan
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      min={timeUnit === 'minutes' ? 3 : 1}
                      max={timeUnit === 'minutes' ? 2880 : 48}
                      value={timeValue}
                      onChange={(e) => setTimeValue(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                      required
                    />
                    <select
                      value={timeUnit}
                      onChange={(e) => {
                        setTimeUnit(e.target.value as 'minutes' | 'hours');
                        setTimeValue(e.target.value === 'minutes' ? 30 : 24);
                      }}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors w-36"
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" /> Simulated Delay (ms)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10000}
                      step={100}
                      value={defaultDelay}
                      onChange={(e) => setDefaultDelay(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" /> Response Status Code
                    </label>
                    <select
                      value={defaultStatus}
                      onChange={(e) => setDefaultStatus(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value={200}>200 OK</option>
                      <option value={201}>201 Created</option>
                      <option value={400}>400 Bad Request</option>
                      <option value={401}>401 Unauthorized</option>
                      <option value={404}>404 Not Found</option>
                      <option value={500}>500 Internal Error</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Deploying Endpoint...' : 'Generate Live Mock API'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6">
                <Instructions />
              </div>
            </div>
          </div>

          <div>
            <JsonPreview
              prompt={prompt}
              defaultDelay={defaultDelay}
              defaultStatus={defaultStatus}
              isList={isList}
              result={result}
              copyToClipboard={copyToClipboard}
              copied={copied}
            />
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
