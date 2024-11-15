import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

const CursorEffect = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const codeStrings = [
    'class', 'extends', 'super', 'new', 'try', 'catch', 'throw', 'finally',
    'if', 'else', 'switch', 'case', 'break', 'continue', 'for', 'while', 
    'do', 'async', 'await', 'yield', 'this', 'typeof', 'instanceof', 
    'void', 'delete', 'default', 'in', 'of', 'with', 'debugger'
  ];

  const throttleRef = useRef<number>();
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (throttleRef.current) return;

      throttleRef.current = window.setTimeout(() => {
        throttleRef.current = undefined;
      }, 16);

      if (cursorRef.current && cursorTextRef.current) {
        const target = e.target as HTMLElement;
        const isNavbar = target.closest('nav');

        // Show cursor everywhere except navbar
        if (isNavbar) {
          cursorRef.current.style.opacity = '0';
          cursorTextRef.current.style.opacity = '0';
          return;
        }

        cursorRef.current.style.opacity = '1';
        cursorRef.current.style.left = `${e.clientX -30}px`;
        cursorRef.current.style.top = `${e.clientY -30}px`;

        // Offset the text effect a bit to the right and below the main cursor
        if (Math.random() > 0.98) {
          const randomCode = codeStrings[Math.floor(Math.random() * codeStrings.length)];
          cursorTextRef.current.textContent = randomCode;
          cursorTextRef.current.style.left = `${e.clientX + 15}px`; // Offset X-axis by 15px
          cursorTextRef.current.style.top = `${e.clientY + 15}px`;  // Offset Y-axis by 15px
          cursorTextRef.current.style.opacity = '1';

          setTimeout(() => {
            if (cursorTextRef.current) {
              cursorTextRef.current.style.opacity = '0';
            }
          }, 10000);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (throttleRef.current) clearTimeout(throttleRef.current);
    };
  }, []);

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed w-20 h-20 pointer-events-none z-50 mix-blend-difference"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          background: theme === 'dark' 
            ? 'radial-gradient(circle, rgba(66,153,225,0.3) 0%, rgba(66,153,225,0) 70%)'
            : 'radial-gradient(circle, rgba(49,130,206,0.3) 0%, rgba(49,130,206,0) 70%)',
          transform: 'translate(-50%, -50%)',  // Center the cursor effect
          borderRadius: '50%',
          backdropFilter: 'blur(2px)',
        }}
      />
      <div
        ref={cursorTextRef}
        className={`fixed text-sm font-mono pointer-events-none z-50 opacity-0 transition-opacity duration-300 ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        }`}
        style={{
          transform: 'translate(-50%, -50%)'  // Center the text effect initially
        }}
      />
    </>
  );
};

export default CursorEffect;
