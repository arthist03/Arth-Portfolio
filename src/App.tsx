import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Education from "./components/Education";
import Experience from "./components/Experience";
import ProjectCard from "./components/ProjectCard";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";
import Hero3D from "./components/Hero3D";
import CursorEffect from "./components/CursorEffect";
import { ThemeProvider } from "./components/ThemeContext";
import ByteRun from "./components/ByteRun";
import { 
  Brain, Cpu, Network, Zap, Database, 
  Github, Linkedin, Mail, ArrowUpRight, 
  Award, GraduationCap, MapPin, Terminal,
  ExternalLink, BarChart3
} from "lucide-react";
import ArthPP from '/Icon/pp.jpg';

function App() {
  const { scrollYProgress } = useScroll();
  const [activeFilter, setActiveFilter] = useState("ALL");

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#fbfaf5] dark:bg-[#0d0e12] text-slate-900 dark:text-slate-100 transition-all duration-300 relative neo-grid-overlay">
        
        <Navbar />

        {/* Bento Dashboard Container */}
        <main className="max-w-6xl mx-auto px-4 pt-28 pb-16">
          
          {/* Header Area: Professional Editorial Visual System */}
          <header className="mb-8 sm:mb-12 max-w-[680px]">
            {/* Canonical Heading 1 with Left-to-Right Neutral Gradient */}
            <motion.h1 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08] sm:leading-[1.06] bg-gradient-to-r from-[#000000] to-[#666666] dark:from-[#FFFFFF] dark:to-[#9B9B9B] bg-clip-text text-transparent"
              style={{ textWrap: "balance" }}
            >
              Machine Learning &amp; Biomedical Engineering
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-slate-600 dark:text-[#9B9B9B] font-normal leading-relaxed mt-3 sm:mt-4 max-w-[620px]"
              style={{ textWrap: "pretty" }}
            >
              Building intelligent diagnostic algorithms, computer vision pipelines, and surgical robotics hardware for clinical healthcare.
            </motion.p>
          </header>

          {/* Grid Layout (5 Rows total on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 auto-rows-auto md:auto-rows-[225px]">
            
            {/* ROW 1 & 2 (LEFT): Main Hero Profile Card */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="neobrutal-card p-5 sm:p-6 md:p-8 flex flex-col justify-between col-span-1 md:col-span-2 row-span-1 md:row-span-2 bg-amber-50 dark:bg-[#1a1c24] min-h-[280px] md:min-h-0 group hover:bg-amber-100/50 dark:hover:bg-[#1f212c] transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 sm:gap-6 text-center sm:text-left">
                {/* Profile Picture */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0">
                  <div className="w-full h-full rounded-xl overflow-hidden border-[3px] border-slate-900 dark:border-white bg-slate-900 dark:bg-white shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#ffffff] group-hover:scale-105 group-hover:rotate-[-2deg] transition-all duration-300">
                    <img 
                      src={ArthPP} 
                      alt="Arth Kadiya" 
                      className="w-full h-full object-cover scale-102"
                    />
                  </div>
                  {/* Embedded Icon */}
                  <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#ffffff] z-10 group-hover:rotate-[15deg] transition-all duration-300">
                    <Brain className="w-4 h-4" />
                  </div>
                </div>
                {/* Title */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">
                    Arth Kadiya
                  </h2>
                  <p className="text-xs sm:text-sm font-mono-code font-bold uppercase text-indigo-650 dark:text-indigo-400 mt-1">
                    AI/ML & Biomedical Engineer
                  </p>
                  <p className="text-xs font-bold text-slate-650 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 mt-2.5">
                    <MapPin className="w-4 h-4 text-slate-900 dark:text-white shrink-0 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    IIT Jodhpur & AIIMS Jodhpur
                  </p>
                </div>
              </div>

              <div className="mt-5 mb-2">
                <p className="text-slate-800 dark:text-gray-250 leading-relaxed text-sm md:text-base font-semibold">
                  I work at the intersection of machine learning and biomedical engineering, developing diagnostic software, computer vision tools, and medical device hardware for clinical applications.
                </p>
              </div>

              <div className="pt-3 border-t-2 border-slate-900 dark:border-slate-850 flex items-center justify-between text-[11px] font-mono-code font-bold text-slate-500 uppercase">
                <span>// Open to engineering & research roles</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-slate-900" />
              </div>
            </motion.div>

            {/* ROW 1 & 2 (RIGHT): Core Technologies Card */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="neobrutal-card p-5 sm:p-6 flex flex-col justify-between col-span-1 md:col-span-2 row-span-1 md:row-span-2 bg-emerald-50 dark:bg-[#13221a] min-h-[260px] md:min-h-0"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase">
                    Core Technologies
                  </h3>
                  <Network className="w-5 h-5 text-emerald-650 dark:text-emerald-450 shrink-0" />
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { name: "Python" },
                    { name: "PyTorch" },
                    { name: "TensorFlow" },
                    { name: "OpenCV" },
                    { name: "MediaPipe" },
                    { name: "Unity & Vuforia" },
                    { name: "Kotlin" },
                    { name: "Firebase" },
                    { name: "React / Vite" },
                    { name: "Tailwind" }
                  ].map((tech) => (
                    <span 
                      key={tech.name} 
                      className="px-3.5 py-1.5 border-2 border-slate-900 dark:border-white bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-mono-code text-[11px] font-bold uppercase rounded-lg shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#0f172a] dark:hover:shadow-[1px_1px_0px_0px_#ffffff] transition-all"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t-2 border-slate-900 dark:border-slate-800 font-mono-code text-[11px] text-slate-700 dark:text-slate-400 flex items-center gap-2 uppercase">
                <span className="w-2.5 h-2.5 bg-emerald-500 border border-slate-900 dark:border-white" />
                // Primary Developer Stack
              </div>
            </motion.div>

            {/* ROW 3 (LEFT): Work Highlight Card */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="neobrutal-card p-5 sm:p-6 flex flex-col justify-between col-span-1 md:col-span-2 row-span-1 bg-blue-50 dark:bg-[#151c2a]"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-base text-slate-900 dark:text-white uppercase">
                  Latest Experience
                </h3>
                <Award className="w-5 h-5 text-blue-650 dark:text-blue-400 shrink-0" />
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  AI/ML Intern @ Sudhir Srivastava Innovations
                </p>
                <p className="text-xs font-mono-code text-slate-650 dark:text-slate-400">
                  Developed AI algorithms for advanced Medical Robotics (2025)
                </p>
              </div>
            </motion.div>

            {/* ROW 3 (RIGHT): Education Highlight Card */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="neobrutal-card p-5 sm:p-6 flex flex-col justify-between col-span-1 md:col-span-2 row-span-1 bg-orange-50 dark:bg-[#241a15]"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-base text-slate-900 dark:text-white uppercase">
                  Academic Credentials
                </h3>
                <GraduationCap className="w-5 h-5 text-orange-650 dark:text-orange-400 shrink-0" />
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Masters in Medical Technologies
                </p>
                <p className="text-xs font-mono-code text-slate-650 dark:text-slate-400">
                  Joint Program by IIT Jodhpur and AIIMS Jodhpur (2025-27)
                </p>
              </div>
            </motion.div>

            {/* ROW 4 & 5 (LEFT): 3D Interactive desk Scene */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="neobrutal-card relative col-span-1 md:col-span-2 row-span-1 md:row-span-2 overflow-hidden flex flex-col justify-between bg-slate-50 dark:bg-[#13141a] min-h-[350px] md:min-h-0"
            >
              <div className="absolute top-4 left-6 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 border-2 border-slate-900 dark:border-white bg-white dark:bg-gray-900 text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-900 dark:text-white shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#ffffff]">
                  <Terminal className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                  [3D Viewport]
                </span>
              </div>
              <div className="w-full h-full absolute inset-0">
                <Hero3D />
              </div>
              <div className="absolute bottom-4 left-6 z-20 pointer-events-none">
                <p className="text-[10px] font-mono-code font-bold uppercase text-slate-600 dark:text-slate-400">
                  // DRAG TO ROTATE SCENE
                </p>
              </div>
            </motion.div>

            {/* ROW 4 (RIGHT): Bio-Engineering Mission Card */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="neobrutal-card p-5 sm:p-6 flex flex-col justify-between col-span-1 md:col-span-2 row-span-1 bg-purple-50 dark:bg-[#20182c]"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-base text-slate-900 dark:text-white uppercase">
                  Technical Focus
                </h3>
                <Cpu className="w-5 h-5 text-purple-650 dark:text-purple-400 shrink-0" />
              </div>
              <p className="text-sm font-semibold text-slate-805 dark:text-gray-250 leading-relaxed mt-2">
                Developing reliable medical hardware, assistive diagnostics, and practical machine learning systems for clinical settings. My work centers on medical robotics, image classification, and embedded biosignal processing.
              </p>
            </motion.div>

            {/* ROW 5 (RIGHT): New Dedicated Bento Stats & Quick Links Card */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="neobrutal-card p-5 sm:p-6 flex flex-col justify-between col-span-1 md:col-span-2 row-span-1 bg-sky-50 dark:bg-[#1a2333]"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-base text-slate-900 dark:text-white uppercase">
                  Quick Stats & Connects
                </h3>
                <BarChart3 className="w-5 h-5 text-sky-650 dark:text-sky-400 shrink-0" />
              </div>

              {/* Mini Stats Table */}
              <div className="grid grid-cols-3 gap-2 text-center my-2">
                <div className="p-2 border-2 border-slate-900 bg-white dark:bg-gray-800 rounded-lg shadow-[1.5px_1.5px_0px_0px_#0f172a]">
                  <p className="text-sm font-black text-indigo-600">4</p>
                  <p className="text-[9px] font-mono-code font-bold uppercase text-slate-500">Roles</p>
                </div>
                <div className="p-2 border-2 border-slate-900 bg-white dark:bg-gray-800 rounded-lg shadow-[1.5px_1.5px_0px_0px_#0f172a]">
                  <p className="text-sm font-black text-purple-650">30+</p>
                  <p className="text-[9px] font-mono-code font-bold uppercase text-slate-500">Projects</p>
                </div>
                <div className="p-2 border-2 border-slate-900 bg-white dark:bg-gray-800 rounded-lg shadow-[1.5px_1.5px_0px_0px_#0f172a]">
                  <p className="text-sm font-black text-emerald-650">Active</p>
                  <p className="text-[9px] font-mono-code font-bold uppercase text-slate-500">GitHub</p>
                </div>
              </div>

              {/* Social Quick Launch */}
              <div className="flex items-center justify-between pt-2 border-t-2 border-slate-900 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <a 
                    href="https://github.com/arthist03" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-1.5 rounded-md bg-white dark:bg-gray-800 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white shadow-[1.5px_1.5px_0px_0px_#0f172a] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[0.5px_0.5px_0px_0px_#0f172a] transition-all"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://linkedin.com/in/arthkadiya" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-1.5 rounded-md bg-white dark:bg-gray-800 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white shadow-[1.5px_1.5px_0px_0px_#0f172a] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[0.5px_0.5px_0px_0px_#0f172a] transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
                <button 
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-1 text-[10px] font-mono-code font-bold uppercase text-slate-900 dark:text-white hover:underline decoration-2"
                >
                  Contact Form
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

          </div>
        </main>

        {/* Detailed Timeline Sections */}
        
        {/* Education Timeline */}
        <Education />

        {/* Experience Timeline */}
        <Experience />

        {/* Projects Section */}
        <section className="py-24 px-4 bg-[#fbfaf5] dark:bg-[#0d0e12] border-t-3 border-slate-900 dark:border-slate-800" id="projects">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                [PROJECTS]
              </span>
              <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white uppercase mt-2">
                Featured Projects
              </h2>
              <div className="w-16 h-1.5 bg-slate-900 dark:bg-white mx-auto mt-4" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <Contact />

        {/* Floating Mini Arcade Game Widget */}
        <ByteRun />

        {/* Global High-Priority Custom Cursor */}
        <CursorEffect />

      </div>
    </ThemeProvider>
  );
}

const projects = [
  {
    title: "Preterm Pregnancy Risk Prediction",
    description:
      "A clinical risk assessment model evaluating maternal physiological parameters with Random Forest and Support Vector Machine classifiers, incorporating structured feature engineering to identify key risk indicators.",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
    tags: ["Python", "Scikit-learn", "Random Forest", "SVM"],
    link: "#",
    categories: ["MEDICAL AI"]
  },
  {
    title: "Real-Time Hand Gesture Classification",
    description:
      "A computer vision pipeline combining MediaPipe skeletal hand tracking with OpenCV and a convolutional neural network for responsive real-time gesture identification.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop",
    tags: ["Python", "OpenCV", "MediaPipe", "CNN"],
    link: "#",
    categories: ["COMPUTER VISION", "DEEP LEARNING"]
  },
  {
    title: "Customer Churn Prediction Network",
    description:
      "A deep neural network implemented in TensorFlow for customer retention modeling, featuring categorical feature pipelines, training diagnostic curves, and performance evaluation metrics.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    tags: ["Python", "TensorFlow", "Neural Networks", "Data Science"],
    link: "https://github.com/arthist03/Predict-Customer-Churn",
    categories: ["DEEP LEARNING"]
  },
  {
    title: "AI-Assisted Ophthalmic Care App",
    description:
      "An Android application built with Kotlin and Firebase integrating TensorFlow Lite on-device models for automated retinal image screening and patient record management.",
    image:
      "https://plus.unsplash.com/premium_photo-1722653260560-f96ad79df08b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG9waHRoYWxtb3xlbnwwfHwwfHx8MA%3D%3D",
    tags: ["Kotlin", "Firebase", "TensorFlow Lite", "Medical AI"],
    link: "https://github.com/arthist03/Eye-Care-For-You",
    categories: ["MEDICAL AI", "DEEP LEARNING"]
  },
  {
    title: "Magic ML Model Visualization",
    description:
      "An educational Python dashboard for visualizing machine learning training dynamics, decision surfaces, and evaluation metrics across fundamental algorithms.",
    image:
      "https://images.unsplash.com/photo-1672922310200-fff31138251e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fE1MfGVufDB8fDB8fHww&fit=crop",
    tags: ["Python", "Machine Learning", "EDA", "Visualization"],
    link: "https://github.com/arthist03/Magic-ML",
    categories: ["DEEP LEARNING"]
  },
  {
    title: "Additional Engineering Repositories",
    description:
      "Explore open-source implementations on GitHub covering biomedical signal analysis, embedded firmware, computer vision, and applied machine learning research.",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop",
    tags: ["AI/ML", "Computer Vision", "Biomedical Systems", "Firmware"],
    link: "https://github.com/arthist03",
    categories: ["MEDICAL AI", "COMPUTER VISION", "DEEP LEARNING"]
  },
];

export default App;
