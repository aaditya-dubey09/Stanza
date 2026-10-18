"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { Check, Copy } from 'lucide-react';

export const JsonPreview = ({
    prompt,
    defaultDelay,
    defaultStatus,
    isList,
    result,
    copied,
    copyToClipboard,
}: {
    prompt: string;
    defaultDelay: number;
    defaultStatus: number;
    isList: boolean;
    result: { endpointId: string; url: string; expiresAt: string } | null;
    copied: boolean;
    copyToClipboard: (text: string) => void;
}) => {
    const payload = useMemo(() => {
        return {
            prompt,
            isList,
            defaultDelay,
            defaultStatus,
        };
    }, [prompt, isList, defaultDelay, defaultStatus]);

    const [fetched, setFetched] = useState<unknown | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const fullUrl = result ? `${typeof window !== 'undefined' ? window.location.origin : ''}${result.url}` : '';

    useEffect(() => {
        let mounted = true;

        if (!result) return;

        const fetcher = async () => {
            setFetched(null);
            setFetchError(null);
            setLoading(true);

            try {
                const res = await fetch(fullUrl, { cache: 'no-store' });
                const data = await res.json();
                if (!mounted) return;
                setFetched(data);
            } catch (err) {
                if (!mounted) return;
                setFetchError(err instanceof Error ? err.message : 'Failed to fetch generated JSON');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetcher();

        return () => {
            mounted = false;
        };
    }, [fullUrl, result]);

    // 1. Convert data to a raw JSON string
    const rawJsonString = useMemo(() => {
        return result ? JSON.stringify(fetched ?? payload, null, 2) : JSON.stringify(payload, null, 2);
    }, [result, fetched, payload]);

    // 2. Pure lightweight highlighter function
    const highlightedJsonHtml = useMemo(() => {
        if (!rawJsonString) return "";

        // Safely escape HTML characters to prevent rendering breakdown on user strings containing < or >
        const safeJson = rawJsonString
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Advanced regex cleanly distinguishing keys vs string values even with internal slashes/colons
        return safeJson.replace(
            /("\((\\u\)[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
            (match) => {
                let cls = "text-amber-500 dark:text-amber-400"; // Numbers/Constants (VS Code Orange/Yellow)

                if (/^"/.test(match)) {
                    if (/:\$/.test(match)) {
                        cls = "text-sky-600 dark:text-sky-400"; // Keys (VS Code Light Blue)
                    } else {
                        cls = "text-emerald-600 dark:text-emerald-400"; // Strings (VS Code Green)
                    }
                } else if (/true|false/.test(match)) {
                    cls = "text-blue-600 dark:text-blue-400"; // Booleans (VS Code Blue)
                } else if (/null/.test(match)) {
                    cls = "text-rose-500 dark:text-rose-400"; // Null values
                }

                return `<span class="${cls}">${match}</span>`;
            }
        );
    }, [rawJsonString]);

    return (
        <aside className="w-full md:w-[480px] lg:w-[600px] max-w-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-sm">
            <div className="flex flex-col items-start justify-between mb-2 gap-2">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Preview</div>
                <div className="flex items-center justify-between w-full gap-2">
                    {result ? (
                        <>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => copyToClipboard(result.url)}
                                    className="text-xs bg-slate-50 dark:bg-slate-700 hover:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-600 hover:border-slate-700 flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200 transition-all duration-200"
                                >
                                    {copied ? <Check className="text-green-500 w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>
                            <div className="text-xs text-slate-700 dark:text-slate-200 bg-slate-950/40 p-1 rounded break-all hover:text-amber-500 hover:underline cursor-pointer max-w-[70%] truncate transition-colors">{fullUrl}</div>
                        </>
                    ) : (
                        <div className="text-xs text-slate-400">No endpoint yet</div>
                    )}
                </div>
            </div>

            <div className="h-auto min-h-[14rem] max-h-[32rem] overflow-auto bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-700 rounded-md p-3 text-xs font-mono text-slate-800 dark:text-slate-300">
                {loading && <div className="text-sm text-slate-500 animate-pulse">Loading generated JSON…</div>}
                {fetchError && <div className="text-sm text-red-500">{fetchError}</div>}
                {!loading && !fetchError && (
                    <pre className="whitespace-pre overflow-x-auto leading-relaxed select-text">
                        <code dangerouslySetInnerHTML={{ __html: highlightedJsonHtml }} />
                    </pre>
                )}
            </div>

            <div className="mt-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">Tip: append <span className="font-mono bg-slate-950/40 px-1 rounded text-amber-500">?delay=ms</span> and <span className="font-mono bg-slate-950/40 px-1 rounded text-amber-500">?status=code</span></div>
            </div>
        </aside>
    );
};

export default JsonPreview;
