import React, { useState } from 'react';
import { Github, Linkedin, Mail, Copy, Check } from 'lucide-react';

const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard?.writeText('arthpk09@gmail.com');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer className="border-t-[3px] border-slate-900 dark:border-neutral-800 bg-[#fbfaf5] dark:bg-[#181818] py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <p className="font-display font-bold text-base text-slate-900 dark:text-white">
            Arth Kadiya
          </p>
          <p className="text-xs font-mono-code text-slate-600 dark:text-neutral-400 mt-1">
            AI/ML &amp; Biomedical Engineering • IIT Jodhpur &amp; AIIMS Jodhpur
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono-code font-bold uppercase text-slate-700 dark:text-neutral-300">
          <a href="#about" className="hover:underline">Overview</a>
          <a href="#education" className="hover:underline">Education</a>
          <a href="#experience" className="hover:underline">Experience</a>
          <a href="#projects" className="hover:underline">Projects</a>
          <a href="#faq" className="hover:underline">FAQ</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-slate-900 dark:border-neutral-400 bg-white dark:bg-[#272727] text-slate-900 dark:text-white text-xs font-mono-code font-bold hover:bg-slate-100 dark:hover:bg-[#313131] transition-transform active:scale-95"
            aria-label="Copy email address"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Email'}
          </button>

          <a
            href="https://github.com/arthist03"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="p-2 rounded-lg border-2 border-slate-900 dark:border-neutral-400 bg-white dark:bg-[#272727] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#313131] transition-transform active:scale-95"
          >
            <Github className="w-4 h-4" />
          </a>

          <a
            href="https://linkedin.com/in/arthkadiya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="p-2 rounded-lg border-2 border-slate-900 dark:border-neutral-400 bg-white dark:bg-[#272727] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#313131] transition-transform active:scale-95"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          <a
            href="mailto:arthpk09@gmail.com"
            aria-label="Send direct email"
            className="p-2 rounded-lg border-2 border-slate-900 dark:border-neutral-400 bg-white dark:bg-[#272727] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#313131] transition-transform active:scale-95"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-5 border-t border-slate-300 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono-code text-slate-500 dark:text-neutral-500">
        <span>© 2026 Arth Kadiya. Built with React, Vite &amp; Three.js.</span>
        <span>Hosted at arthkadiya.me</span>
      </div>
    </footer>
  );
};

export default Footer;
