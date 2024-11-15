import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Calendar, ExternalLink } from 'lucide-react';
import { useTheme } from './ThemeContext';

const Education = () => {
  const [hoveredSchool, setHoveredSchool] = useState<number | null>(null);
  const { theme } = useTheme();

  const education = [
    {
      degree: 'B.Tech in Biomedical Engineering',
      institution: 'Manipal Institute of Technology, Manipal, Karnataka, India',
      year: '2022-2025',
      description: 'As a B.Tech biomedical engineering student at MIT Manipal, Karnataka, I benefit from top-tier education, cutting-edge research facilities, and strong industry connections in India’s tech hub, equipping me to make a meaningful impact in biomedical engineering.',
      image: 'https://media.getmyuni.com/azure/college-image/big/manipal-institute-of-technology-mit-manipal.jpg',
      link: 'https://www.manipal.edu/mit.html',
    },
    {
      degree: 'Diploma in Biomedical Engineering',
      institution: 'Ganpat University, Mehsana, Gujarat, India',
      year: '2019-2022',
      description: 'My diploma in biomedical engineering from Ganpat University gave me a strong foundation in engineering, biology, and medicine, preparing me to enhance patient care, develop assistive tech, and evaluate medical therapies.',
      image: 'https://i.ytimg.com/vi/OsoXEo1wpYI/maxresdefault.jpg',
      link: 'https://www.ganpatuniversity.ac.in/',
    },
  ];

  const handleHover = useCallback((index: number | null) => {
    setHoveredSchool(index);
  }, []);

  return (
    <section
      className="py-20 bg-gray-100 dark:bg-gray-800 transition-colors duration-300"
      id="education"
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12 text-center"
        >
          Education
        </motion.h2>
        <div className="space-y-8">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={() => handleHover(null)}
            >
              <AnimatePresence>
                {hoveredSchool === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 -z-10 overflow-hidden rounded-lg"
                  >
                    <div
                      className={`absolute inset-0 ${
                        theme === 'dark' ? 'bg-black/60' : 'bg-white/60'
                      } backdrop-blur-sm`}
                    />
                    <img
                      src={edu.image}
                      alt={edu.institution}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className={`rounded-lg p-6 shadow-xl transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-900/80 backdrop-blur-sm hover:bg-gray-900/90'
                    : 'bg-white/80 backdrop-blur-sm hover:bg-white/90'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full transition-colors ${
                      theme === 'dark'
                        ? 'bg-blue-500/20 group-hover:bg-blue-500/30'
                        : 'bg-blue-100 group-hover:bg-blue-200'
                    }`}
                  >
                    <GraduationCap
                      className={`w-6 h-6 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
                      <a
                        href={edu.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">{edu.institution}</p>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{edu.year}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{edu.description}</p>
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

export default Education;
