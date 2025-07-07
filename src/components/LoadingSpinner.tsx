import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

const LoadingSpinner = () => {
  const { theme } = useTheme();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        {/* Animated logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className={`w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full mx-auto`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`} />
            </div>
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-2"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Loading Experience
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing your 3D portfolio...
          </p>
        </motion.div>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center space-x-2 mt-6"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'}`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;