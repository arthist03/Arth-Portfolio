import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Calendar, ExternalLink } from 'lucide-react';

const Education = () => {
  const [hoveredSchool, setHoveredSchool] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const education = [
    {
      degree: 'Masters in Medical Technologies',
      institution: 'Indian Institute of Technology Jodhpur, Rajasthan, India',
      year: '2025–2027',
      description:
        'Joint program between IIT Jodhpur and AIIMS Jodhpur focusing on medical device development, clinical diagnostics, and the application of machine learning to healthcare challenges.',
      image:
        'https://tse1.mm.bing.net/th/id/OIP.vIyTNgAeQ7rEqDqLAWt0LgHaEi?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      link: 'https://iitj.ac.in/',
      gridClass: 'md:col-span-2 bg-amber-50 dark:bg-[#1f1f1f]',
      accentColor: 'bg-yellow-200 text-slate-900',
    },
    {
      degree: 'B.Tech in Biomedical Engineering',
      institution: 'Manipal Institute of Technology, Manipal, Karnataka, India',
      year: '2022–2025',
      description:
        'Undergraduate engineering curriculum emphasizing medical instrumentation, biosignal acquisition, biomechanics, and clinical engineering systems.',
      image:
        'https://media.getmyuni.com/azure/college-image/big/manipal-institute-of-technology-mit-manipal.jpg',
      link: 'https://www.manipal.edu/mit.html',
      gridClass: 'md:col-span-1 bg-blue-50 dark:bg-[#1f1f1f]',
      accentColor: 'bg-blue-200 text-slate-900',
    },
    {
      degree: 'Diploma in Biomedical Engineering',
      institution: 'Ganpat University, Mehsana, Gujarat, India',
      year: '2019–2022',
      description:
        'Foundational studies in analog and digital electronics, biomedical equipment maintenance, circuit analysis, and diagnostic hardware testing.',
      image: 'https://i.ytimg.com/vi/OsoXEo1wpYI/maxresdefault.jpg',
      link: 'https://www.ganpatuniversity.ac.in/',
      gridClass: 'md:col-span-1 bg-emerald-50 dark:bg-[#1f1f1f]',
      accentColor: 'bg-emerald-200 text-slate-900',
    },
  ];

  const handleHover = useCallback((index: number | null) => {
    setHoveredSchool(index);
  }, []);

  return (
    <section
      className="py-24 bg-[#fbfaf5] dark:bg-[#181818] border-t-[3px] border-slate-900 dark:border-neutral-800 transition-colors duration-300"
      id="education"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400">
            [JOURNEY]
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white uppercase mt-2">
            Academic Background
          </h2>
          <div className="w-16 h-1.5 bg-slate-900 dark:bg-white mx-auto mt-4" />
        </div>

        {/* Bento Grid layout for Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((edu, index) => {
            const hasImageOverlay = hoveredSchool === index && !failedImages[index];
            return (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={`relative group neobrutal-card p-5 sm:p-8 flex flex-col justify-between ${edu.gridClass}`}
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={() => handleHover(null)}
              >
                {/* Institution Image Hover Reveal */}
                <AnimatePresence>
                  {hasImageOverlay && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 z-0 overflow-hidden rounded-xl border-2 border-transparent"
                    >
                      <img
                        src={edu.image}
                        alt={edu.institution}
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [index]: true }))
                        }
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className="absolute inset-0 z-10"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="w-full relative z-20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <div
                        className={`p-3 rounded-lg border-2 border-slate-900 shrink-0 ${edu.accentColor}`}
                      >
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-display font-bold uppercase leading-snug transition-colors duration-300 ${
                            hasImageOverlay
                              ? 'text-white'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {edu.degree}
                        </h3>
                        <p
                          className={`font-semibold text-sm mt-1 transition-colors duration-300 ${
                            hasImageOverlay
                              ? 'text-slate-200'
                              : 'text-slate-700 dark:text-neutral-300'
                          }`}
                        >
                          {edu.institution}
                        </p>
                      </div>
                    </div>

                    <a
                      href={edu.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg border-2 border-slate-900 dark:border-neutral-400 bg-white dark:bg-[#272727] text-slate-900 dark:text-white shadow-[2px_2px_0px_0px_#0f172a] hover:bg-slate-100 dark:hover:bg-[#313131] transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shrink-0"
                      aria-label={`Visit webpage of ${edu.institution}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-slate-900 dark:border-neutral-400 bg-white dark:bg-[#272727] text-xs font-mono-code font-bold uppercase text-slate-900 dark:text-white shadow-[1.5px_1.5px_0px_0px_#0f172a] mt-5 mb-4">
                    <Calendar className="w-3.5 h-3.5 mr-0.5" />
                    <span>{edu.year}</span>
                  </div>

                  <p
                    className={`text-sm font-medium leading-relaxed transition-colors duration-300 ${
                      hasImageOverlay
                        ? 'text-slate-100'
                        : 'text-slate-700 dark:text-neutral-300'
                    }`}
                  >
                    {edu.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Education;
