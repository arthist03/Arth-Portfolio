import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Brain, Cpu, Eye, Zap } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  tags,
  link,
}) => {
  const { theme } = useTheme();

  const getAIIcon = (tag: string) => {
    const text = tag.toLowerCase();
    if (text.includes('neural') || text.includes('ml') || text.includes('ai')) {
      return Brain;
    }
    if (text.includes('vision') || text.includes('opencv') || text.includes('gesture')) {
      return Eye;
    }
    if (text.includes('deep') || text.includes('tensorflow') || text.includes('cnn')) {
      return Cpu;
    }
    return Zap;
  };

  const IconComponent = getAIIcon(tags[0] || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="neobrutal-card overflow-hidden group flex flex-col justify-between"
    >
      {/* Top Banner Image */}
      <div className="relative h-48 overflow-hidden border-b-3 border-slate-900 dark:border-white shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Floating icon badge */}
        <div className="absolute top-4 right-4">
          <div className="p-2 rounded-lg bg-yellow-200 dark:bg-yellow-400 border-2 border-slate-900 dark:border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
            <IconComponent className="w-4 h-4 shrink-0" />
          </div>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">
              {title}
            </h3>
            {link !== "#" && (
              <motion.a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#0f172a] dark:hover:shadow-[1px_1px_0px_0px_#ffffff]"
                aria-label={`View GitHub source code for ${title}`}
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
              </motion.a>
            )}
          </div>
          
          <p className="text-sm font-semibold text-slate-700 dark:text-gray-300 leading-relaxed mb-5">
            {description}
          </p>
        </div>
        
        <div className="mt-auto">
          {/* Tags cloud */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[10px] font-mono-code font-bold uppercase rounded-md border-2 border-slate-900 dark:border-white bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white shadow-[1px_1px_0px_0px_#0f172a] dark:shadow-[1px_1px_0px_0px_#ffffff]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Sparkles / progress node lines */}
          <div className="pt-4 border-t-2 border-slate-900 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono-code font-bold text-slate-500 dark:text-slate-400 uppercase">
            <span>[Clinical AI / ML]</span>
            <div className="flex space-x-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 border border-slate-900 dark:border-white bg-slate-900 dark:bg-white"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;