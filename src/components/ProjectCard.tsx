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
    if (tag.toLowerCase().includes('neural') || tag.toLowerCase().includes('ml') || tag.toLowerCase().includes('ai')) {
      return Brain;
    }
    if (tag.toLowerCase().includes('vision') || tag.toLowerCase().includes('opencv')) {
      return Eye;
    }
    if (tag.toLowerCase().includes('deep') || tag.toLowerCase().includes('tensorflow')) {
      return Cpu;
    }
    return Zap;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`rounded-xl overflow-hidden group transition-all duration-300 ai-hover ${
        theme === 'dark' 
          ? 'bg-slate-900/90 backdrop-blur-sm border border-slate-700/50' 
          : 'bg-slate-50/90 backdrop-blur-sm border border-slate-200/50'
      } shadow-lg hover:shadow-2xl`}
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        
        {/* Professional AI-themed overlay */}
        <div className="absolute top-4 right-4">
          <div className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-blue-gray-600/20' : 'bg-blue-gray-100/80'
          } backdrop-blur-sm border border-blue-gray-500/30`}>
            {React.createElement(getAIIcon(tags[0]), { 
              className: `w-5 h-5 ${theme === 'dark' ? 'text-blue-gray-400' : 'text-blue-gray-600'}` 
            })}
          </div>
        </div>

        {/* Floating professional particles */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${theme === 'dark' ? 'bg-blue-gray-400' : 'bg-blue-gray-600'} rounded-full data-particle`}
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 group-hover:ai-gradient-text transition-all duration-300">
            {title}
          </h3>
          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-lg transition-all duration-300 ${
              theme === 'dark' 
                ? 'text-blue-gray-400 hover:text-blue-gray-300 hover:bg-blue-gray-600/10' 
                : 'text-blue-gray-600 hover:text-blue-gray-700 hover:bg-blue-gray-100'
            }`}
          >
            <ExternalLink className="w-5 h-5" />
          </motion.a>
        </div>
        
        <p className={`mb-4 text-sm leading-relaxed ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-gray-600/20 to-slate-600/20 text-blue-gray-300 border border-blue-gray-600/30'
                  : 'bg-gradient-to-r from-blue-gray-100 to-slate-100 text-blue-gray-700 border border-blue-gray-200'
              } hover:shadow-lg`}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Professional progress indicator */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>AI/ML Project</span>
            <div className="flex space-x-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full neural-node ${
                    theme === 'dark' ? 'bg-blue-gray-400' : 'bg-blue-gray-600'
                  }`}
                  style={{ animationDelay: `${i * 0.3}s` }}
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