import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Brain, Cpu, Eye, Zap, ArrowUpRight } from 'lucide-react';
import { ProjectItem } from '../data/projects';

interface ProjectCardProps {
  project: ProjectItem;
  onSelect: (project: ProjectItem) => void;
}

const getAIIcon = (tag: string) => {
  const text = tag.toLowerCase();
  if (text.includes('neural') || text.includes('ml') || text.includes('ai')) return Brain;
  if (text.includes('vision') || text.includes('opencv') || text.includes('gesture')) return Eye;
  if (text.includes('deep') || text.includes('tensorflow') || text.includes('cnn')) return Cpu;
  return Zap;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const { title, description, image, tags, link } = project;
  const IconComponent = getAIIcon(tags[0] || '');

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onSelect(project)}
      className="neobrutal-card overflow-hidden group flex flex-col justify-between cursor-pointer"
    >
      {/* Top Banner Image */}
      <div className="relative h-48 overflow-hidden border-b-[3px] border-slate-900 dark:border-neutral-300 shrink-0 bg-slate-100 dark:bg-[#181818]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          decoding="async"
        />

        {/* Floating icon badge */}
        <div className="absolute top-3.5 right-3.5">
          <div className="p-2 rounded-lg bg-amber-200 dark:bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
            <IconComponent className="w-4 h-4 shrink-0" />
          </div>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h3
              className="text-xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-snug"
              style={{ textWrap: 'balance' }}
            >
              {title}
            </h3>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-lg bg-white dark:bg-[#272727] text-slate-900 dark:text-white border-2 border-slate-900 dark:border-neutral-400 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#000000] hover:bg-slate-100 dark:hover:bg-[#313131] transition-transform active:scale-95 shrink-0"
                aria-label={`View GitHub repository for ${title}`}
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>
            )}
          </div>

          <p
            className="text-sm font-medium text-slate-700 dark:text-neutral-300 leading-relaxed mb-5"
            style={{ textWrap: 'pretty' }}
          >
            {description}
          </p>
        </div>

        <div className="mt-auto">
          {/* Tags cloud */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[10px] font-mono-code font-bold uppercase rounded-md border-2 border-slate-900 dark:border-neutral-500 bg-slate-50 dark:bg-[#272727] text-slate-900 dark:text-white"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-3.5 border-t-2 border-slate-900 dark:border-neutral-700 flex items-center justify-between text-[11px] font-mono-code font-bold text-slate-700 dark:text-neutral-300 uppercase">
            <span className="inline-flex items-center gap-1 group-hover:underline">
              Inspect Case Study
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
            <span>{project.categories[0]}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
