import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  Copy,
  Check,
  Sun,
  Moon,
  ExternalLink,
  X,
} from 'lucide-react';
import { PROJECTS, ProjectItem } from '../data/projects';
import { useTheme } from './ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectItem) => void;
  onNavigate: (sectionId: string) => void;
}

interface CommandEntry {
  id: string;
  label: string;
  group: string;
  keywords: string;
  action: () => void;
  icon: 'nav' | 'copy' | 'theme' | 'link' | 'project';
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onNavigate,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  const entries: CommandEntry[] = useMemo(() => {
    const base: CommandEntry[] = [
      {
        id: 'nav-about',
        label: 'Jump to Overview & Bio',
        group: 'Navigation',
        keywords: 'about overview profile stack',
        icon: 'nav',
        action: () => {
          onNavigate('about');
          onClose();
        },
      },
      {
        id: 'nav-education',
        label: 'Jump to Academic Background',
        group: 'Navigation',
        keywords: 'education iit aiims manipal degree',
        icon: 'nav',
        action: () => {
          onNavigate('education');
          onClose();
        },
      },
      {
        id: 'nav-experience',
        label: 'Jump to Experience Timeline',
        group: 'Navigation',
        keywords: 'experience work internship robotics',
        icon: 'nav',
        action: () => {
          onNavigate('experience');
          onClose();
        },
      },
      {
        id: 'nav-projects',
        label: 'Jump to Featured Projects',
        group: 'Navigation',
        keywords: 'projects portfolio ml ai vision',
        icon: 'nav',
        action: () => {
          onNavigate('projects');
          onClose();
        },
      },
      {
        id: 'nav-faq',
        label: 'Jump to Common Questions (FAQ)',
        group: 'Navigation',
        keywords: 'faq questions answers bio stack',
        icon: 'nav',
        action: () => {
          onNavigate('faq');
          onClose();
        },
      },
      {
        id: 'nav-contact',
        label: 'Jump to Contact Form',
        group: 'Navigation',
        keywords: 'contact email hire message',
        icon: 'nav',
        action: () => {
          onNavigate('contact');
          onClose();
        },
      },
      {
        id: 'action-theme',
        label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
        group: 'Preferences',
        keywords: 'theme dark light appearance mode',
        icon: 'theme',
        action: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: 'action-email',
        label: copied ? 'Copied arthpk09@gmail.com' : 'Copy Email (arthpk09@gmail.com)',
        group: 'Actions',
        keywords: 'copy email gmail contact address',
        icon: 'copy',
        action: () => {
          navigator.clipboard?.writeText('arthpk09@gmail.com');
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        },
      },
      {
        id: 'link-github',
        label: 'Open GitHub Profile',
        group: 'Links',
        keywords: 'github code repositories',
        icon: 'link',
        action: () => {
          window.open('https://github.com/arthist03', '_blank', 'noopener,noreferrer');
          onClose();
        },
      },
      {
        id: 'link-linkedin',
        label: 'Open LinkedIn Profile',
        group: 'Links',
        keywords: 'linkedin profile connect',
        icon: 'link',
        action: () => {
          window.open('https://linkedin.com/in/arthkadiya', '_blank', 'noopener,noreferrer');
          onClose();
        },
      },
    ];

    const projectEntries: CommandEntry[] = PROJECTS.map((p) => ({
      id: `proj-${p.id}`,
      label: `Case Study: ${p.title}`,
      group: 'Projects',
      keywords: `${p.title} ${p.tags.join(' ')} ${p.categories.join(' ')}`.toLowerCase(),
      icon: 'project',
      action: () => {
        onSelectProject(p);
        onClose();
      },
    }));

    return [...base, ...projectEntries];
  }, [theme, copied, toggleTheme, onNavigate, onClose, onSelectProject]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [entries, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (filtered.length ? (prev + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) =>
          filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0
        );
      } else if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault();
        filtered[activeIndex].action();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, filtered, activeIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[110] bg-black/55 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="neobrutal-card w-full max-w-lg overflow-hidden bg-white dark:bg-[#1f1f1f]"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b-2 border-slate-900 dark:border-neutral-700">
              <Search className="w-4 h-4 text-slate-500 dark:text-neutral-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections, projects, or actions..."
                className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close command palette"
                className="p-1 rounded border border-slate-300 dark:border-neutral-600 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-xs font-mono-code text-slate-500 dark:text-neutral-400">
                  No matching commands for "{query}"
                </p>
              ) : (
                filtered.map((item, idx) => {
                  const selected = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={item.action}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        selected
                          ? 'bg-amber-100 dark:bg-[#272727] text-slate-900 dark:text-white'
                          : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-[#272727]'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="block text-sm font-semibold truncate">{item.label}</span>
                        <span className="block text-[10px] font-mono-code uppercase text-slate-500 dark:text-neutral-400">
                          {item.group}
                        </span>
                      </div>

                      <span className="shrink-0 text-slate-500 dark:text-neutral-400">
                        {item.icon === 'copy' ? (
                          copied ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )
                        ) : item.icon === 'theme' ? (
                          theme === 'light' ? (
                            <Moon className="w-4 h-4" />
                          ) : (
                            <Sun className="w-4 h-4" />
                          )
                        ) : item.icon === 'link' ? (
                          <ExternalLink className="w-4 h-4" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2 border-t-2 border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-[#181818] flex items-center justify-between text-[10px] font-mono-code text-slate-500 dark:text-neutral-400">
              <span>↑↓ Navigate • Enter Select</span>
              <span>ESC Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
