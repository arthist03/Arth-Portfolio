import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, Layers } from 'lucide-react';
import { ProjectItem } from '../data/projects';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="neobrutal-card w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-white dark:bg-[#1f1f1f] p-5 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-0.5 text-[10px] font-mono-code font-bold uppercase rounded-md border-2 border-slate-900 dark:border-neutral-400 bg-amber-100 dark:bg-neutral-800 text-slate-900 dark:text-white"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <h3
                  id="project-modal-title"
                  className="text-2xl font-display font-bold tracking-tight text-slate-900 dark:text-white"
                  style={{ textWrap: 'balance' }}
                >
                  {project.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close project case study"
                className="p-2 rounded-lg border-2 border-slate-900 dark:border-neutral-400 bg-white dark:bg-[#272727] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#313131] transition-transform active:scale-95 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-48 w-full rounded-xl overflow-hidden border-2 border-slate-900 dark:border-neutral-500 mb-5">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-5 text-sm text-slate-700 dark:text-neutral-300 leading-relaxed" style={{ textWrap: 'pretty' }}>
              <div>
                <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-1.5">
                  Clinical &amp; Engineering Context
                </h4>
                <p className="font-medium text-slate-800 dark:text-neutral-200">
                  {project.clinicalProblem}
                </p>
              </div>

              <div>
                <h4 className="flex items-center gap-1.5 text-xs font-mono-code font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  Pipeline Architecture
                </h4>
                <ul className="space-y-2">
                  {project.architecture.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="font-mono-code text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#272727] border border-slate-300 dark:border-neutral-600 text-slate-800 dark:text-neutral-200 shrink-0">
                        0{i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-2">
                  Key Outcomes
                </h4>
                <ul className="space-y-1.5">
                  {project.outcomes.map((out, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[11px] font-mono-code font-semibold uppercase rounded-md border-2 border-slate-900 dark:border-neutral-500 bg-slate-50 dark:bg-[#272727] text-slate-900 dark:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-slate-200 dark:border-neutral-700 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-mono-code font-bold uppercase rounded-lg border-2 border-slate-900 dark:border-neutral-400 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#272727] transition-transform active:scale-95"
              >
                Close
              </button>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono-code font-bold uppercase rounded-lg border-2 border-slate-900 dark:border-white bg-amber-200 dark:bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-amber-300 transition-transform active:scale-95"
                >
                  View Repository
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
