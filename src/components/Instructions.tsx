"use client";
import React from 'react';

export const Instructions = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-sm text-slate-700 dark:text-slate-300">
            <h3 className="font-semibold mb-2">How it works</h3>
            <ul className="list-disc pl-5 space-y-1">
                <li>Describe the response structure you want in the prompt box.</li>
                <li>Choose lifespan (minutes or hours) endpoints auto-expire.</li>
                <li>Use <span className="font-mono bg-slate-500/40 px-1 rounded text-slate-200">?delay=ms</span> to simulate latency and <span className="font-mono bg-slate-500/40 px-1 rounded text-slate-200">?status=code</span> to override HTTP status.</li>
                <li>The JSON preview on the right shows the request payload. Click <strong>Copy URL</strong> to copy the live endpoint.</li>
                <li>Endpoints are stateful and can be used for CRUD-style experiments from your client or API tests.</li>
            </ul>
        </div>
    );
};

export default Instructions;
