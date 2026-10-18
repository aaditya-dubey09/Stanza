"use client";
import React from 'react';

export const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="sr-only peer"
            />

            <div className="relative w-11 h-6 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 peer-checked:bg-amber-600 rounded-full transition-all duration-200 after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform after:duration-200 peer-checked:after:translate-x-5"></div>

            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {checked ? 'On' : 'Off'}
            </span>
        </label>
    );
};

export default ToggleSwitch;
