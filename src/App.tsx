import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero3D from './components/Hero3D';
import Education from './components/Education';
import Experience from './components/Experience';
import ProjectCard from './components/ProjectCard';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import CursorEffect from './components/CursorEffect';
import { ThemeProvider } from './components/ThemeContext';

function App() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.hero-content');
      if (heroSection) {
        if (window.scrollY > window.innerHeight) {
          document.body.classList.remove('hero-section');
        } else {
          document.body.classList.add('hero-section');
        }
      }
    };

    document.body.classList.add('hero-section');
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-colors duration-300">
        <CursorEffect />
        <Navbar />
        
        <div className="relative">
          <motion.div style={{ opacity }}>
            <Hero3D />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center z-10 hero-content">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-6xl font-bold mb-4"
              >
                Arth Kadiya
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-2xl text-gray-700 dark:text-gray-300"
              >
                Biomedical Engineer
              </motion.p>
            </div>
          </div>
        </div>

        <section className="py-20 px-4" id="about">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-8">About Me</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              I'm Arth Kadiya, a passionate Biomedical Engineer and Coder dedicated to bridging the gap 
              between healthcare and technology. With expertise in both medical sciences and software 
              development, I create innovative solutions that enhance patient care and medical research.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Medical Imaging', 'AI/ML', 'Full Stack', 'Signal Processing'].map((skill) => (
                <div 
                  key={skill} 
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg transform hover:scale-105 transition-transform"
                >
                  <p className="font-semibold">{skill}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <Education />
        <Experience />

        <section className="py-20 px-4" id="projects">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-12 text-center"
            >
              Featured Projects
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
    title: 'Prediction of preterm pregnancy using machine learning ',
    description: 'I developed a machine learning system to predict preterm pregnancy by preprocessing maternal health data, extracting key risk features, and training models—including Decision Trees, Random Forest, SVM, Logistic Regression, and KNN—to achieve accurate predictions for early intervention in maternal care.',
    image: 'https://th.bing.com/th/id/OIP.n8eerRAxo7i2qcXjlBCKlgHaEK?rs=1&pid=ImgDetMain',
    tags: ['Python', 'Machine Learning', 'Medical Signals', 'EHG', 'Data Pre-Processing'],
    link: '#'
  },
  {
    title: 'Different HAND Gesture recognition with Machine learning',
    description: 'I developed a hand gesture recognition system using Mediapipe and OpenCV to detect and classify real-time hand gestures based on key hand landmarks for interactive control.',
    image: 'https://miro.medium.com/max/1104/1*8WQmdgQvgttTLt0oHlzj1g.jpeg',
    tags: ['Python', 'OpenCV', 'Image Processing', 'Mediapipe', 'scikit-learn'],
    link: '#'
  },
  {
    title: 'Customer Churn Prediction',
    description: 'I developed a customer churn prediction model using IBMs Telcom Customer Churn Dataset and Logistic Regression, achieving 80% accuracy, with interactive visualizations to highlight key churn factors and insights for businesses.',
    image: 'https://user-images.githubusercontent.com/58620359/174948746-5dc3418a-8296-4cc8-9561-f8f12ca9a0a4.png',
    tags: ['Python', 'TensorFlow', 'scikit-learn', 'Machine Learning'],
    link: 'https://github.com/arthist03/Predict-Customer-Churn'
  },
  {
    title: 'Eye Care For You',
    description: '"Eye Care for You" is a Kotlin-based app that enhances ophthalmology workflow by managing patient data, appointments, and documents, with Firebase Firestore for efficient storage and accessibility.',
    image: 'https://static.vecteezy.com/system/resources/previews/000/585/008/non_2x/eye-care-vector-logo-design-template.jpg',
    tags: ['Kotlin', 'Firebase', 'XML', 'Machine Learning'],
    link: 'https://github.com/arthist03/Eye-Care-For-You'
  },
  {
    title: 'More Projects',
    description: 'You can check out more projects by visiting my GitHub profile: arthist03.',
    image: 'https://th.bing.com/th/id/OIP.sV7tva-728oySeOUL0-vOwHaHa?rs=1&pid=ImgDetMain',
    tags: ['Python', 'Web - Sites', 'Kotlin', 'Machine Learning'],
    link: 'https://github.com/arthist03'
  }
];

export default App;