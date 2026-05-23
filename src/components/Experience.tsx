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
      title: 'Intern - AI/ML Engineer',
      company: 'Sudhir Srivastava Innovations Pvt. Ltd.',
      period: 'March 2025 - July 2025',
      description: 'Developed an AI/ML Algorithm for Medical Robotics.',
      technologies: ['Python', 'Torch', 'Unity', 'Vuforia'],
      image: 'https://picknik.ai/assets/images/our-clients/SSInnovations.png',
    },
    {
      title: 'Full Stack Developer',
      company: 'IEEE Bombay',
      period: 'September 2023 - October 2023',
      description: 'Co-led a key module on Developerstar.com, managing coding, testing, and team collaboration. Focused on problem-solving and quality assurance.',
      technologies: ['HTML', 'CSS', 'JS', 'Svelte'],
      image: 'https://ieeebombay.org/wp-content/uploads/2023/02/IEEE_BS_New_Logo_with_Killa-removebg-preview.png',
    },
    {
      title: 'Intern - Biomedical Engineer',
      company: 'Wockhardt Hospitals Ltd, Rajkot',
      period: 'June 2023 - July 2023',
      description: 'Managed medical equipment development, leading testing, troubleshooting, and research. Provided technical support to healthcare professionals.',
      technologies: ['Equipment Mgmt', 'Safety Knowledge', 'Tech Support', 'Teamwork'],
      image: 'https://th.bing.com/th/id/OIP.cjdU01fCkHQEumd_XcAyzAHaCn?w=350&h=123&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    },
    {
      title: 'Intern - Biomedical Engineer',
      company: 'Zydus Hospitals, Ahmedabad',
      period: 'April 2022 - July 2022',
      description: 'Led testing, troubleshooting, and upkeep of medical devices, while conducting research and data analysis. Provided technical support to healthcare professionals.',
      technologies: ['Device Testing', 'Regulatory Rules', 'Troubleshooting', 'Data Analysis'],
      image: 'https://zydushospitals.com/images/gallery/ahmedabad-gallery-19.jpg',
    },
  ];

  return (
    <section
      className="py-24 bg-[#fbfaf5] dark:bg-[#0d0e12] border-t-3 border-slate-900 dark:border-slate-800 transition-colors duration-500"
      id="experience"
    >
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            [WORK]
          </span>
          <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white uppercase mt-2">
            Professional Experience
          </h2>
          <div className="w-16 h-1.5 bg-slate-900 dark:bg-white mx-auto mt-4" />
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-3 border-slate-900 dark:border-white ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="relative group"
            >
              {/* Timeline dot/badge node */}
              <div 
                className="absolute -left-[39px] sm:-left-[58px] top-6 w-6 h-6 sm:w-8 sm:h-8 rounded-lg border-2 border-slate-900 dark:border-white bg-yellow-250 dark:bg-yellow-400 text-slate-900 flex items-center justify-center font-mono-code font-bold text-xs sm:text-sm shadow-[1.5px_1.5px_0px_0px_#0f172a] dark:shadow-[1.5px_1.5px_0px_0px_#ffffff] shrink-0"
              >
                0{index + 1}
              </div>

              {/* Stark card container */}
              <div
                className="neobrutal-card p-6 sm:p-8 bg-white dark:bg-[#16171d]"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  {/* Briefcase Icon Container */}
                  <div
                    className="p-3.5 rounded-lg border-2 border-slate-900 dark:border-white bg-indigo-100 dark:bg-indigo-400 text-slate-900 shrink-0"
                  >
                    <Briefcase className="w-6 h-6" />
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-xl font-display font-black text-slate-900 dark:text-white uppercase leading-snug">
                          {exp.title}
                        </h3>
                        <p className="text-indigo-650 dark:text-indigo-400 font-bold text-sm mt-0.5">
                          {exp.company}
                        </p>
                      </div>
                      
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-slate-900 dark:border-white bg-slate-50 dark:bg-gray-900 text-xs font-mono-code font-bold uppercase text-slate-900 dark:text-white shadow-[1.5px_1.5px_0px_0px_#0f172a] dark:shadow-[1.5px_1.5px_0px_0px_#ffffff] shrink-0">
                        <Calendar className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                        <span>{exp.period}</span>
                      </div>
                    </div>

                    <p className="text-slate-750 dark:text-gray-250 text-sm font-semibold leading-relaxed mb-5">
                      {exp.description}
                    </p>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-2.5">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-md text-[10px] font-mono-code font-bold border-2 border-slate-900 dark:border-white bg-white dark:bg-gray-800 text-slate-900 dark:text-white shadow-[1.5px_1.5px_0px_0px_#0f172a] dark:shadow-[1.5px_1.5px_0px_0px_#ffffff]"
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