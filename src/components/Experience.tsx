import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  image: string;
}

const Experience = () => {
  const [hoveredExp, setHoveredExp] = useState<number | null>(null);
  const { theme } = useTheme();

  const experiences: ExperienceItem[] = [
    {
      title: 'Intern – Computer Vision Engineer',
      company: 'Sudhir Srivastava Innovations Pvt. Ltd.',
      period: 'March 2025 - Present',
      description: 'Developing an AI/ML Algorithm for Medical Robotics',
      technologies: ['Python', 'Torch', 'Unity', 'Vuforia'],
      image: 'https://picknik.ai/assets/images/our-clients/SSInnovations.png',
    },
    {
      title: 'FULL STACK DEVELOPER',
      company: 'IEEE BOMBAY',
      period: 'September 2023 - October 2023',
      description: 'Co-led a key module on Developerstar.com, managing coding, testing, and team collaboration. Focused on problem-solving and quality assurance.',
      technologies: ['HTML', 'CSS', 'JS', 'Svelte'],
      image: 'https://ieeebombay.org/wp-content/uploads/2023/02/IEEE_BS_New_Logo_with_Killa-removebg-preview.png',
    },
    {
      title: 'BIOMEDICAL ENGINEER',
      company: 'Wockhardt Hospitals Ltd, Rajkot',
      period: 'June 2023 - July 2023',
      description: 'Managed medical equipment development, leading testing, troubleshooting, and research. Provided technical support to healthcare professionals.',
      technologies: ['Medical Equipment Management', 'Regulatory and Safety Knowledge', 'Communication', 'Teamwork'],
      image: 'https://th.bing.com/th/id/OIP.cjdU01fCkHQEumd_XcAyzAHaCn?w=350&h=123&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    },
    {
      title: 'BIOMEDICAL ENGINEER',
      company: 'Zydus Hospitals, Ahmedabad',
      period: 'April 2022 - July 2022',
      description: 'Led testing, troubleshooting, and upkeep of medical devices, while conducting research and data analysis. Provided technical support to healthcare professionals.',
      technologies: ['Medical Equipment Management', 'Regulatory and Safety Knowledge', 'Communication', 'Teamwork'],
      image: 'https://zydushospitals.com/images/gallery/ahmedabad-gallery-19.jpg',
    },
  ];

  return (
    <section
      className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
      id="experience"
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-gray-700 via-slate-700 to-blue-gray-800 dark:from-blue-gray-200 dark:via-slate-100 dark:to-blue-gray-100 bg-clip-text text-transparent"
        >
          Experience
        </motion.h2>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
              onMouseEnter={() => setHoveredExp(index)}
              onMouseLeave={() => setHoveredExp(null)}
            >
              <AnimatePresence>
                {hoveredExp === index && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 -z-10 overflow-hidden rounded-lg"
                  >
                    <div
                      className={`absolute inset-0 ${
                        theme === 'dark' ? 'bg-slate-900/80' : 'bg-slate-100/90'
                      } backdrop-blur-sm`}
                    />
                    <img
                      src={exp.image}
                      alt={exp.company}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className={`rounded-lg p-6 shadow-xl transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-slate-900/90 backdrop-blur-sm hover:bg-slate-900/95 border border-slate-700'
                    : 'bg-slate-100/90 backdrop-blur-sm hover:bg-slate-100/95 border border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-600/20 group-hover:bg-slate-600/30'
                        : 'bg-slate-200 group-hover:bg-slate-300'
                    }`}
                  >
                    <Briefcase
                      className={`w-6 h-6 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">{exp.title}</h3>
                      <div className="flex items-center text-slate-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                    <p
                      className={`mb-3 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {exp.company}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-full text-sm ${
                            theme === 'dark'
                              ? 'bg-slate-600/20 text-slate-300 border border-slate-600/30'
                              : 'bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;