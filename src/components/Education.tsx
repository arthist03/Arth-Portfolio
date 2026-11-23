import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Calendar, ExternalLink } from "lucide-react";
import { useTheme } from "./ThemeContext";

const Education = () => {
  const [hoveredSchool, setHoveredSchool] = useState<number | null>(null);
  const { theme } = useTheme();

  const education = [
    {
      degree: "Masters in Medical Technologies",
      institution: "Indian Institute of Technology Jodhpur, Rajasthan, India",
      year: "2025–2027",
      description:
        "Joint program between IIT Jodhpur and AIIMS Jodhpur focusing on medical device development, clinical diagnostics, and the application of machine learning to healthcare challenges.",
      image:
        "https://tse1.mm.bing.net/th/id/OIP.vIyTNgAeQ7rEqDqLAWt0LgHaEi?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      link: "https://iitj.ac.in/",
      gridClass: "md:col-span-2 bg-amber-50 dark:bg-[#1a1c24]",
      accentColor: "bg-yellow-200 text-slate-900"
    },
    {
      degree: "B.Tech in Biomedical Engineering",
      institution: "Manipal Institute of Technology, Manipal, Karnataka, India",
      year: "2022-2025",
      description:
        "Undergraduate engineering curriculum emphasizing medical instrumentation, biosignal acquisition, biomechanics, and clinical engineering systems.",
      image:
        "https://media.getmyuni.com/azure/college-image/big/manipal-institute-of-technology-mit-manipal.jpg",
      link: "https://www.manipal.edu/mit.html",
      gridClass: "md:col-span-1 bg-blue-50 dark:bg-[#151c2a]",
      accentColor: "bg-blue-200 text-slate-900"
    },
    {
      degree: "Diploma in Biomedical Engineering",
      institution: "Ganpat University, Mehsana, Gujarat, India",
      year: "2019-2022",
      description:
        "Foundational studies in analog and digital electronics, biomedical equipment maintenance, circuit analysis, and diagnostic hardware testing.",
      image: "https://i.ytimg.com/vi/OsoXEo1wpYI/maxresdefault.jpg",
      link: "https://www.ganpatuniversity.ac.in/",
      gridClass: "md:col-span-1 bg-emerald-50 dark:bg-[#13221a]",
      accentColor: "bg-emerald-200 text-slate-900"
    },
  ];

  const handleHover = useCallback((index: number | null) => {
    setHoveredSchool(index);
  }, []);

  return (
    <section
      className="py-24 bg-[#fbfaf5] dark:bg-[#0d0e12] border-t-3 border-slate-900 dark:border-slate-800 transition-colors duration-300"
      id="education"
    >
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            [JOURNEY]
          </span>
          <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white uppercase mt-2">
            Academic Background
          </h2>
          <div className="w-16 h-1.5 bg-slate-900 dark:bg-white mx-auto mt-4" />
        </div>

        {/* Bento Grid layout for Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={`relative group neobrutal-card p-5 sm:p-8 flex flex-col justify-between ${edu.gridClass}`}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={() => handleHover(null)}
            >
              {/* Institution Image Hover Reveal */}
              <AnimatePresence>
                {hoveredSchool === index && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-0 overflow-hidden rounded-xl border-2 border-transparent"
                  >
                    <img
                      src={edu.image}
                      alt={edu.institution}
                      className="absolute inset-0 w-full h-full object-cover transform scale-102 z-0"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 z-10 transition-all duration-300"
                      style={{ backgroundColor: "rgba(15, 23, 42, 0.85)" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="w-full relative z-20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    {/* Grad Icon Wrapper */}
                    <div
                      className={`p-3 rounded-lg border-2 border-slate-900 dark:border-white shrink-0 ${edu.accentColor}`}
                    >
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-black text-slate-900 dark:text-white group-hover:text-white transition-colors duration-300 uppercase leading-snug">
                        {edu.degree}
                      </h3>
                      <p className="text-slate-700 dark:text-slate-350 group-hover:text-slate-200 transition-colors duration-300 font-bold text-sm mt-1">
                        {edu.institution}
                      </p>
                    </div>
                  </div>

                  <a
                    href={edu.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border-2 border-slate-900 dark:border-white bg-white dark:bg-gray-800 text-slate-900 dark:text-white shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#0f172a] dark:hover:shadow-[1px_1px_0px_0px_#ffffff] transition-all opacity-0 group-hover:opacity-100 shrink-0"
                    aria-label={`Visit webpage of ${edu.institution}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-slate-900 dark:border-white bg-white dark:bg-gray-900 text-xs font-mono-code font-bold uppercase text-slate-900 dark:text-white shadow-[1.5px_1.5px_0px_0px_#0f172a] dark:shadow-[1.5px_1.5px_0px_0px_#ffffff] mt-5 mb-4">
                  <Calendar className="w-3.5 h-3.5 mr-0.5" />
                  <span>{edu.year}</span>
                </div>

                <p className="text-slate-750 dark:text-gray-250 group-hover:text-slate-100 transition-colors duration-300 text-sm font-semibold leading-relaxed">
                  {edu.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
