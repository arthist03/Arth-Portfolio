import React, { Suspense, useEffect, useState, useMemo, useCallback, lazy } from 'react';
import { motion, useScroll } from 'framer-motion';
import Education from './components/Education';
import Experience from './components/Experience';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import Contact from './components/Contact';
import FaqSection from './components/FaqSection';
import Navbar from './components/Navbar';
import CursorEffect from './components/CursorEffect';
import BiosignalLab from './components/BiosignalLab';
import CommandPalette from './components/CommandPalette';
import ScrollRevealStatement from './components/ScrollRevealStatement';
import Footer from './components/Footer';
import { ThemeProvider } from './components/ThemeContext';
import {
  PROJECT_CATEGORIES,
  TECH_STACK,
  TECH_TO_CATEGORY,
  getFilteredProjects,
  ProjectCategory,
  ProjectItem,
} from './data/projects';
import {
  Brain,
  Cpu,
  Network,
  Github,
  Linkedin,
  ArrowUpRight,
  Award,
  GraduationCap,
  MapPin,
  Terminal,
  BarChart3,
  X,
} from 'lucide-react';
import ArthPP from '/Icon/pp.jpg';

// Lazy-load Three.js viewport so 2 GB RAM devices & initial paint never block on ~800 KB WebGL bundle
const Hero3D = lazy(() => import('./components/Hero3D'));

function App() {
  const { scrollYProgress } = useScroll();
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('ALL');
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Global Ctrl+K / Cmd+K shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const visibleProjects = useMemo(
    () => getFilteredProjects(activeFilter, activeTech),
    [activeFilter, activeTech]
  );

  const navigateToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const handleTechClick = useCallback(
    (tech: string) => {
      const lower = tech.toLowerCase();
      setActiveTech((prev) => (prev === tech ? null : tech));
      setActiveFilter(TECH_TO_CATEGORY.get(lower) ?? 'ALL');
      navigateToSection('projects');
    },
    [navigateToSection]
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#fbfaf5] dark:bg-[#181818] text-slate-900 dark:text-neutral-100 transition-colors duration-300 relative neo-grid-overlay">
        {/* Skip to Content Accessibility Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[120] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-slate-900 focus:text-white focus:font-mono-code focus:text-xs"
        >
          Skip to content
        </a>

        {/* GPU-only Top Reading Progress Bar */}
        <motion.div
          style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
          className="fixed top-0 left-0 right-0 h-[3px] bg-slate-900 dark:bg-amber-400 z-[60] pointer-events-none"
        />

        <Navbar onOpenCommandPalette={() => setIsPaletteOpen(true)} />

        {/* Bento Dashboard Container */}
        <main id="main-content" className="max-w-6xl mx-auto px-4 pt-24 sm:pt-28 pb-16">
          {/* Header Area: Editorial Visual System with Smooth Graceful Reveal */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 sm:mb-12 max-w-[680px]"
          >
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08] sm:leading-[1.06] bg-gradient-to-r from-[#000000] to-[#666666] dark:from-[#FFFFFF] dark:to-[#9B9B9B] bg-clip-text text-transparent"
              style={{ textWrap: 'balance' }}
            >
              Machine Learning &amp; Biomedical Engineering
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-slate-600 dark:text-[#9B9B9B] font-normal leading-relaxed mt-3 sm:mt-4 max-w-[620px]"
              style={{ textWrap: 'pretty' }}
            >
              Building intelligent diagnostic algorithms, computer vision pipelines, and surgical robotics hardware for clinical healthcare.
            </motion.p>
          </motion.header>

          {/* Bento Grid Layout (5 Rows total on Desktop) */}
          <div
            id="about"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 auto-rows-auto md:auto-rows-[235px]"
          >
            {/* ROW 1 & 2 (LEFT): Main Hero Profile Card */}
            <div className="neobrutal-card p-5 sm:p-6 md:p-8 flex flex-col justify-between col-span-1 md:col-span-2 row-span-1 md:row-span-2 bg-amber-50 dark:bg-[#1f1f1f] min-h-[280px] md:min-h-0 group transition-colors duration-300">
              <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 sm:gap-6 text-center sm:text-left">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0">
                  <div className="w-full h-full rounded-xl overflow-hidden border-[3px] border-slate-900 dark:border-neutral-300 bg-slate-900 shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000000] group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={ArthPP}
                      alt="Arth Kadiya"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-2 border-slate-900 dark:border-neutral-300 shadow-[2px_2px_0px_0px_#0f172a] z-10">
                    <Brain className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                    Arth Kadiya
                  </h2>
                  <p className="text-xs sm:text-sm font-mono-code font-bold uppercase text-indigo-700 dark:text-indigo-400 mt-1">
                    AI/ML &amp; Biomedical Engineer
                  </p>
                  <p className="text-xs font-semibold text-slate-600 dark:text-neutral-400 flex items-center justify-center sm:justify-start gap-1.5 mt-2.5">
                    <MapPin className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                    IIT Jodhpur &amp; AIIMS Jodhpur
                  </p>
                </div>
              </div>

              <div className="mt-5 mb-2">
                <p
                  className="text-slate-800 dark:text-neutral-200 leading-relaxed text-sm md:text-base font-medium"
                  style={{ textWrap: 'pretty' }}
                >
                  I work at the intersection of machine learning and biomedical engineering, developing diagnostic software, computer vision tools, and medical device hardware for clinical applications.
                </p>
              </div>

              <div className="pt-3 border-t-2 border-slate-900 dark:border-neutral-700 flex items-center justify-between text-[11px] font-mono-code font-bold text-slate-600 dark:text-neutral-400 uppercase">
                <span>// Open to engineering &amp; research roles</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
              </div>
            </div>

            {/* ROW 1 & 2 (RIGHT): Interactive Core Technologies Card */}
            <div className="neobrutal-card p-5 sm:p-6 flex flex-col justify-between col-span-1 md:col-span-2 row-span-1 md:row-span-2 bg-emerald-50 dark:bg-[#1f1f1f] min-h-[260px] md:min-h-0">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white uppercase">
                    Core Technologies
                  </h3>
                  <Network className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {TECH_STACK.map((tech) => {
                    const isSelected = activeTech === tech;
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => handleTechClick(tech)}
                        title={`Filter projects using ${tech}`}
                        className={`px-3 py-1.5 border-2 border-slate-900 dark:border-neutral-400 font-mono-code text-[11px] font-bold uppercase rounded-lg shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#000000] transition-transform active:scale-95 ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950'
                            : 'bg-white dark:bg-[#272727] text-slate-900 dark:text-white hover:bg-amber-100 dark:hover:bg-[#313131]'
                        }`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-slate-900 dark:border-neutral-700 font-mono-code text-[11px] text-slate-700 dark:text-neutral-400 flex items-center justify-between uppercase">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 border border-slate-900" />
                  Click any skill to filter projects
                </span>
              </div>
            </div>

            {/* ROW 3 (LEFT): Work Highlight Card */}
            <div className="neobrutal-card p-5 sm:p-6 flex flex-col justify-between col-span-1 md:col-span-2 row-span-1 bg-blue-50 dark:bg-[#1f1f1f]">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white uppercase">
                  Latest Experience
                </h3>
                <Award className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0" />
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  AI/ML Intern @ Sudhir Srivastava Innovations
                </p>
                <p className="text-xs font-mono-code text-slate-600 dark:text-neutral-400">
                  Developed AI algorithms for advanced Medical Robotics (2025)
                </p>
              </div>
            </div>

            {/* ROW 3 (RIGHT): Education Highlight Card */}
            <div className="neobrutal-card p-5 sm:p-6 flex flex-col justify-between col-span-1 md:col-span-2 row-span-1 bg-orange-50 dark:bg-[#1f1f1f]">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white uppercase">
                  Academic Credentials
                </h3>
                <GraduationCap className="w-5 h-5 text-orange-700 dark:text-orange-400 shrink-0" />
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Masters in Medical Technologies
                </p>
                <p className="text-xs font-mono-code text-slate-600 dark:text-neutral-400">
                  Joint Program by IIT Jodhpur and AIIMS Jodhpur (2025–2027)
                </p>
              </div>
            </div>

            {/* ROW 4 & 5 (LEFT): Interactive 3D CAD Viewport */}
            <div className="neobrutal-card relative col-span-1 md:col-span-2 row-span-1 md:row-span-2 overflow-hidden flex flex-col justify-between bg-slate-50 dark:bg-[#1f1f1f] min-h-[340px] md:min-h-0">
              <div className="absolute top-3.5 left-4 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-slate-900 dark:border-neutral-400 bg-white/95 dark:bg-[#272727] text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-900 dark:text-white shadow-[2px_2px_0px_0px_#0f172a]">
                  <Terminal className="w-3.5 h-3.5" />
                  CAD Viewport
                </span>
              </div>
              <div className="w-full h-full absolute inset-0">
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center text-xs font-mono-code text-slate-500">
                      Loading 3D viewport...
                    </div>
                  }
                >
                  <Hero3D />
                </Suspense>
              </div>
              <div className="absolute bottom-3.5 left-4 z-20 pointer-events-none">
                <p className="text-[10px] font-mono-code font-bold uppercase text-slate-600 dark:text-neutral-400">
                  // DRAG TO ORBIT • SWITCH SHADER ABOVE
                </p>
              </div>
            </div>

            {/* ROW 4 (RIGHT): Live Biosignal DSP Card */}
            <div className="neobrutal-card p-5 sm:p-6 flex flex-col justify-between col-span-1 md:col-span-2 row-span-1 bg-purple-50 dark:bg-[#1f1f1f]">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white uppercase">
                  Biosignal DSP Lab
                </h3>
                <Cpu className="w-5 h-5 text-purple-700 dark:text-purple-400 shrink-0" />
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-neutral-300 mt-1">
                Real-time O(1) ring-buffer ECG monitor with live bandpass smoothing:
              </p>
              <BiosignalLab />
            </div>

            {/* ROW 5 (RIGHT): Quick Stats & Connects Card */}
            <div className="neobrutal-card p-5 sm:p-6 flex flex-col justify-between col-span-1 md:col-span-2 row-span-1 bg-sky-50 dark:bg-[#1f1f1f]">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white uppercase">
                  Quick Stats &amp; Connects
                </h3>
                <BarChart3 className="w-5 h-5 text-sky-700 dark:text-sky-400 shrink-0" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center my-2">
                <div className="p-2 border-2 border-slate-900 dark:border-neutral-400 bg-white dark:bg-[#272727] rounded-lg shadow-[1.5px_1.5px_0px_0px_#0f172a]">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">4</p>
                  <p className="text-[9px] font-mono-code font-bold uppercase text-slate-500 dark:text-neutral-400">
                    Roles
                  </p>
                </div>
                <div className="p-2 border-2 border-slate-900 dark:border-neutral-400 bg-white dark:bg-[#272727] rounded-lg shadow-[1.5px_1.5px_0px_0px_#0f172a]">
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-400">30+</p>
                  <p className="text-[9px] font-mono-code font-bold uppercase text-slate-500 dark:text-neutral-400">
                    Projects
                  </p>
                </div>
                <div className="p-2 border-2 border-slate-900 dark:border-neutral-400 bg-white dark:bg-[#272727] rounded-lg shadow-[1.5px_1.5px_0px_0px_#0f172a]">
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Active</p>
                  <p className="text-[9px] font-mono-code font-bold uppercase text-slate-500 dark:text-neutral-400">
                    GitHub
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t-2 border-slate-900 dark:border-neutral-700">
                <div className="flex items-center space-x-2">
                  <a
                    href="https://github.com/arthist03"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    className="p-1.5 rounded-md bg-white dark:bg-[#272727] text-slate-900 dark:text-white border-2 border-slate-900 dark:border-neutral-400 shadow-[1.5px_1.5px_0px_0px_#0f172a] hover:bg-slate-100 dark:hover:bg-[#313131] transition-transform active:scale-95"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com/in/arthkadiya"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    className="p-1.5 rounded-md bg-white dark:bg-[#272727] text-slate-900 dark:text-white border-2 border-slate-900 dark:border-neutral-400 shadow-[1.5px_1.5px_0px_0px_#0f172a] hover:bg-slate-100 dark:hover:bg-[#313131] transition-transform active:scale-95"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => navigateToSection('contact')}
                  className="flex items-center gap-1 text-[10px] font-mono-code font-bold uppercase text-slate-900 dark:text-white hover:underline decoration-2"
                >
                  Contact Form
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Scroll-Reveal Engineering Statement */}
        <ScrollRevealStatement />

        {/* Education Timeline */}
        <Education />

        {/* Experience Timeline */}
        <Experience />

        {/* Projects Section with O(1)-Indexed Filter Controls */}
        <section
          className="py-24 px-4 bg-[#fbfaf5] dark:bg-[#181818] border-t-[3px] border-slate-900 dark:border-neutral-800"
          id="projects"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400">
                [PROJECTS]
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white uppercase mt-2">
                Featured Projects
              </h2>
              <div className="w-16 h-1.5 bg-slate-900 dark:bg-white mx-auto mt-4" />
            </div>

            {/* Category & Tech Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
              {PROJECT_CATEGORIES.map((category) => {
                const active = activeFilter === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setActiveFilter(category);
                      setActiveTech(null);
                    }}
                    className={`px-3.5 py-2 text-xs font-mono-code font-bold uppercase rounded-lg border-2 border-slate-900 dark:border-neutral-400 transition-transform active:scale-95 ${
                      active
                        ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-[3px_3px_0px_0px_#eab308] dark:shadow-[3px_3px_0px_0px_#000000]'
                        : 'bg-white dark:bg-[#272727] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#313131]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}

              {activeTech && (
                <button
                  type="button"
                  onClick={() => setActiveTech(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono-code font-bold uppercase rounded-lg border-2 border-slate-900 bg-amber-200 text-slate-900 active:scale-95 transition-transform"
                >
                  <span>Skill: {activeTech}</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {visibleProjects.length === 0 ? (
              <div className="neobrutal-card max-w-md mx-auto p-8 text-center">
                <p className="text-sm font-semibold text-slate-700 dark:text-neutral-300 mb-3">
                  No projects match the current filter combination.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('ALL');
                    setActiveTech(null);
                  }}
                  className="px-3 py-2 text-xs font-mono-code font-bold uppercase rounded-lg border-2 border-slate-900 bg-amber-200 text-slate-900"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSelect={setSelectedProject}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section (SEO + AEO) */}
        <FaqSection />

        {/* Contact Form */}
        <Contact />

        {/* Semantic Footer */}
        <Footer />

        {/* Project Case-Study Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

        {/* Ctrl+K Command Palette */}
        <CommandPalette
          isOpen={isPaletteOpen}
          onClose={() => setIsPaletteOpen(false)}
          onSelectProject={setSelectedProject}
          onNavigate={navigateToSection}
        />

        {/* Global High-Priority Custom Cursor (Untouched) */}
        <CursorEffect />
      </div>
    </ThemeProvider>
  );
}

export default App;
