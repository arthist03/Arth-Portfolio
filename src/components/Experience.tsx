import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  image: string;
}

const Experience = () => {
  const experiences: ExperienceItem[] = [
    {
      title: 'AI/ML Engineering Intern',
      company: 'Sudhir Srivastava Innovations Pvt. Ltd.',
      period: 'March 2025 - July 2025',
      description: 'Researched and implemented computer vision and deep learning models for medical robotics tracking and simulation environments.',
      technologies: ['Python', 'PyTorch', 'Unity', 'Vuforia'],
      image: 'https://picknik.ai/assets/images/our-clients/SSInnovations.png',
    },
    {
      title: 'Full Stack Web Developer',
      company: 'IEEE Bombay',
      period: 'September 2023 - October 2023',
      description: 'Collaborated on the front-end architecture and module development for Developerstar.com, implementing responsive components and functional testing.',
      technologies: ['Svelte', 'JavaScript', 'HTML5', 'CSS3'],
      image: 'https://ieeebombay.org/wp-content/uploads/2023/02/IEEE_BS_New_Logo_with_Killa-removebg-preview.png',
    },
    {
      title: 'Biomedical Engineering Intern',
      company: 'Wockhardt Hospitals Ltd, Rajkot',
      period: 'June 2023 - July 2023',
      description: 'Conducted scheduled preventive maintenance, safety inspections, and functional troubleshooting on clinical equipment across critical care units.',
      technologies: ['Device Maintenance', 'Calibration', 'Troubleshooting', 'Clinical Support'],
      image: 'https://th.bing.com/th/id/OIP.cjdU01fCkHQEumd_XcAyzAHaCn?w=350&h=123&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    },
    {
      title: 'Biomedical Engineering Intern',
      company: 'Zydus Hospitals, Ahmedabad',
      period: 'April 2022 - July 2022',
      description: 'Assisted senior biomedical engineers with device performance verification, regulatory safety protocols, and operational upkeep of diagnostic instrumentation.',
      technologies: ['Diagnostic Systems', 'Safety Standards', 'Device Testing', 'Documentation'],
      image: 'https://zydushospitals.com/images/gallery/ahmedabad-gallery-19.jpg',
    },
  ];

  return (
    <section
      className="py-24 bg-[#fbfaf5] dark:bg-[#181818] border-t-[3px] border-slate-900 dark:border-neutral-800 transition-colors duration-300"
      id="experience"
    >
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400">
            [WORK]
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white uppercase mt-2">
            Professional Experience
          </h2>
          <div className="w-16 h-1.5 bg-slate-900 dark:bg-white mx-auto mt-4" />
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-[3px] border-slate-900 dark:border-neutral-400 ml-2.5 sm:ml-8 pl-4 sm:pl-10 space-y-10 sm:space-y-12">
          
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              {/* Timeline dot/badge node */}
              <div 
                className="absolute -left-[33px] sm:-left-[58px] top-5 sm:top-6 w-6 h-6 sm:w-8 sm:h-8 rounded-lg border-2 border-slate-900 dark:border-neutral-300 bg-amber-200 dark:bg-amber-400 text-slate-900 flex items-center justify-center font-mono-code font-bold text-xs sm:text-sm shadow-[1.5px_1.5px_0px_0px_#0f172a] shrink-0"
              >
                0{index + 1}
              </div>

              {/* Stark card container */}
              <div
                className="neobrutal-card p-4 sm:p-8 bg-white dark:bg-[#1f1f1f]"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  {/* Briefcase Icon Container */}
                  <div
                    className="p-3.5 rounded-lg border-2 border-slate-900 dark:border-neutral-300 bg-indigo-100 dark:bg-indigo-400 text-slate-900 shrink-0"
                  >
                    <Briefcase className="w-6 h-6" />
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white uppercase leading-snug">
                          {exp.title}
                        </h3>
                        <p className="text-indigo-700 dark:text-indigo-400 font-bold text-sm mt-0.5">
                          {exp.company}
                        </p>
                      </div>
                      
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-slate-900 dark:border-neutral-400 bg-slate-50 dark:bg-[#272727] text-xs font-mono-code font-bold uppercase text-slate-900 dark:text-white shadow-[1.5px_1.5px_0px_0px_#0f172a] shrink-0">
                        <Calendar className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                        <span>{exp.period}</span>
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-neutral-300 text-sm font-medium leading-relaxed mb-5">
                      {exp.description}
                    </p>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-2.5">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-md text-[10px] font-mono-code font-bold border-2 border-slate-900 dark:border-neutral-500 bg-white dark:bg-[#272727] text-slate-900 dark:text-white shadow-[1.5px_1.5px_0px_0px_#0f172a]"
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