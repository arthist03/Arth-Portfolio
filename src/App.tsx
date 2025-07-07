import React, { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Education from "./components/Education";
import Experience from "./components/Experience";
import ProjectCard from "./components/ProjectCard";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";
import CursorEffect from "./components/CursorEffect";
import { ThemeProvider } from "./components/ThemeContext";
import { Brain, Cpu, Network, Zap, Database } from "lucide-react";

function App() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector(".hero-content");
      if (heroSection) {
        if (window.scrollY > window.innerHeight) {
          document.body.classList.remove("hero-section");
        } else {
          document.body.classList.add("hero-section");
        }
      }
    };

    document.body.classList.add("hero-section");
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-gray-50 to-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-blue-gray-900 text-slate-800 dark:text-slate-100 transition-all duration-500">
        <CursorEffect />
        <Navbar />

        {/* Hero Section with Modern Professional Design */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-blue-gray-100 to-slate-200 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-gray-900 dark:to-slate-800">
          {/* Subtle Geometric Patterns */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute opacity-5 dark:opacity-10"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  rotate: 0,
                  scale: 0.5,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  rotate: 360,
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 25 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div
                  className={`w-20 h-20 ${
                    i % 3 === 0
                      ? "bg-blue-gray-600"
                      : i % 3 === 1
                      ? "bg-slate-600"
                      : "bg-blue-gray-500"
                  } ${
                    i % 4 === 0
                      ? "rounded-full"
                      : i % 4 === 1
                      ? "rounded-lg rotate-45"
                      : i % 4 === 2
                      ? "rounded-none"
                      : "rounded-xl"
                  } blur-sm`}
                />
              </motion.div>
            ))}
          </div>

          {/* Professional Grid Overlay */}
          <div className="absolute inset-0 opacity-3 dark:opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(44, 62, 80, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(44, 62, 80, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          {/* Main Content */}
          <motion.div
            style={{ opacity }}
            className="relative z-10 text-center space-y-8 px-4"
          >
            {/* Professional Profile Picture */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
              className="relative mx-auto w-32 h-32 mb-8"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-gray-600 via-slate-600 to-blue-gray-700 animate-spin-slow"></div>
              <div className="absolute inset-1 rounded-full bg-slate-50 dark:bg-slate-900"></div>
              <a
                href="https://your-link-here.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="Icon/pp.png"
                  alt="Arth Kadiya"
                  className="absolute inset-2 w-28 h-28 rounded-full object-cover shadow-2xl"
                />
              </a>

              {/* Professional AI/ML icons */}
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity },
                }}
                className="absolute -inset-8"
              >
                <Brain className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 text-blue-gray-600 dark:text-blue-gray-400" />
                <Cpu className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-600 dark:text-slate-400" />
                <Network className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-6 text-blue-gray-700 dark:text-blue-gray-300" />
                <Zap className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-700 dark:text-slate-300" />
              </motion.div>
            </motion.div>

            {/* Professional Name Styling */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-6xl md:text-8xl font-bold"
            >
              <span className="bg-gradient-to-r from-blue-gray-700 via-slate-700 to-blue-gray-800 dark:from-blue-gray-200 dark:via-slate-100 dark:to-blue-gray-100 bg-clip-text text-transparent">
                Arth Kadiya
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="space-y-4"
            >
              <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-300 typing-effect font-light">
                AI/ML Engineer & Biomedical Innovator
              </p>
              <div className="flex justify-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>Neural Networks</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4" />
                  <span>Deep Learning</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Network className="w-4 h-4" />
                  <span>Computer Vision</span>
                </span>
              </div>
            </motion.div>

            {/* Professional Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="pt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-gradient-to-r from-blue-gray-600 to-slate-700 text-slate-50 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-gray-500"
              >
                Explore My Work
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Professional Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center z-20">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-slate-500 dark:text-slate-400"
            >
              <div className="w-6 h-10 border-2 border-current rounded-full mx-auto mb-2">
                <div className="w-1 h-3 bg-current rounded-full mx-auto animate-pulse" />
              </div>
              <p className="text-sm font-medium">Scroll to explore</p>
            </motion.div>
          </div>
        </section>

        {/* About Section with Professional Cards */}
        <section
          className="py-20 px-4 bg-gradient-to-r from-slate-100 via-blue-gray-100 to-slate-200 dark:bg-gradient-to-r dark:from-slate-800 dark:via-blue-gray-800 dark:to-slate-700 transition-colors duration-500"
          id="about"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-gray-700 via-slate-700 to-blue-gray-800 dark:from-blue-gray-200 dark:via-slate-100 dark:to-blue-gray-100 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              I'm Arth Kadiya, a passionate AI/ML Engineer and Biomedical
              Innovator dedicated to bridging the gap between artificial
              intelligence and healthcare. With expertise in neural networks,
              computer vision, and medical technology, I create intelligent
              solutions that enhance patient care and advance medical research.
            </p>

            {/* Professional Skills Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: Brain,
                  label: "Neural Networks",
                  color: "from-blue-gray-500 to-blue-gray-600",
                  description: "Deep learning architectures",
                },
                {
                  icon: Cpu,
                  label: "Deep Learning",
                  color: "from-slate-500 to-slate-600",
                  description: "Advanced AI models",
                },
                {
                  icon: Network,
                  label: "Computer Vision",
                  color: "from-blue-gray-600 to-slate-600",
                  description: "Image processing & analysis",
                },
                {
                  icon: Database,
                  label: "Medical AI",
                  color: "from-slate-600 to-blue-gray-700",
                  description: "Healthcare applications",
                },
              ].map((skill, index) => (
                <motion.div
                  key={skill.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group bg-slate-50 dark:bg-slate-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
                >
                  <div
                    className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r ${skill.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <skill.icon className="w-6 h-6 text-slate-50" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    {skill.label}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {skill.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <Education />
        <Experience />

        <section
          className="py-20 px-4 bg-gradient-to-l from-slate-50 via-blue-gray-50 to-slate-100 dark:bg-gradient-to-l dark:from-slate-900 dark:via-blue-gray-900 dark:to-slate-800 transition-colors duration-500"
          id="projects"
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-gray-700 via-slate-700 to-blue-gray-800 dark:from-blue-gray-200 dark:via-slate-100 dark:to-blue-gray-100 bg-clip-text text-transparent"
            >
              AI/ML Projects
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </div>
    </ThemeProvider>
  );
}

const projects = [
  {
    title: "Preterm Pregnancy Prediction using ML",
    description:
      "Developed an advanced machine learning system using ensemble methods to predict preterm pregnancy risk. Implemented feature engineering on maternal health data and achieved 94% accuracy using Random Forest and SVM models.",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
    tags: ["Python", "Scikit-learn", "Random Forest", "SVM", "Medical AI"],
    link: "#",
  },
  {
    title: "Real-time Hand Gesture Recognition",
    description:
      "Built a computer vision system using MediaPipe and OpenCV for real-time hand gesture classification. Implemented custom CNN architecture achieving 98% accuracy on gesture recognition tasks.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop",
    tags: ["Python", "OpenCV", "MediaPipe", "CNN", "Computer Vision"],
    link: "#",
  },
  {
    title: "Customer Churn Prediction with Deep Learning",
    description:
      "Developed a neural network model for customer churn prediction using TensorFlow. Implemented feature engineering and achieved 85% accuracy with interactive visualizations for business insights.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    tags: ["Python", "TensorFlow", "Neural Networks", "Data Science"],
    link: "https://github.com/arthist03/Predict-Customer-Churn",
  },
  {
    title: "AI-Powered Eye Care Application",
    description:
      "Created an intelligent mobile application for ophthalmology workflow optimization. Integrated machine learning models for automated diagnosis assistance and patient data management.",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=300&fit=crop",
    tags: ["Kotlin", "Firebase", "TensorFlow Lite", "Medical AI"],
    link: "https://github.com/arthist03/Eye-Care-For-You",
  },
  {
    title: "Neural Network Playground",
    description:
      "Interactive web application for visualizing neural network architectures and training processes. Built with React and D3.js for educational purposes in AI/ML learning.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop",
    tags: ["React", "D3.js", "Neural Networks", "Visualization"],
    link: "https://github.com/arthist03",
  },
  {
    title: "More AI/ML Projects",
    description:
      "Explore my complete portfolio of artificial intelligence and machine learning projects on GitHub, including computer vision, NLP, and medical AI applications.",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop",
    tags: ["AI/ML", "Deep Learning", "Computer Vision", "Medical AI"],
    link: "https://github.com/arthist03",
  },
];

export default App;
