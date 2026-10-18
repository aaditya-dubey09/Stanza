"use client";
import React from 'react';
import { Terminal } from 'lucide-react';

export const Navbar = () => {
    return (
        <nav className="flex w-full items-center justify-between mb-6 px-4 py-3 bg-white dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
                <div className="p-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    <Terminal className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Stanza</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Instant Mock APIs</div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <a
                    href="https://github.com/aaditya-dubey09/stanza"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm px-3 py-1 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                >
                    Source
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
