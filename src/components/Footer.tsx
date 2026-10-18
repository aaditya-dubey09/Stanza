"use client";

export const Footer = () => {
    return (
        <footer className="w-full mt-8 py-6 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
            <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
                <div>&copy; 2026 Stanza • Instant mock endpoints for testing and demos.</div>
                <div className="text-xs">
                    <a className="hover:text-amber-500" href="https://github.com/aaditya-dubey09/stanza" target="_blank" rel="noreferrer noopener">
                        &nbsp;GitHub
                    </a> |
                    Docs:&nbsp;
                    <a className="hover:text-amber-500" href="https://github.com/aaditya-dubey09/stanza/README.md" target="_blank" rel="noreferrer noopener">
                        Readme •
                    </a>
                    <a className="hover:text-amber-500" href="https://github.com/aaditya-dubey09/stanza/LICENSE" target="_blank" rel="noreferrer noopener">
                        &nbsp;License
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
