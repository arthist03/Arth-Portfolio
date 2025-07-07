import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

const CursorEffect = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const innerCursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const animationId = useRef<number>();
  const { theme } = useTheme();

  const aiElements = [
    '{ AI }', '< ML >', '[ NN ]', '( DL )', '=>', '∞', '∑', '∇', '∂', '∆',
    'fn', 'λ', 'α', 'β', 'γ', 'θ', 'σ', 'µ', 'π', '∈', '∋', '∀', '∃'
  ];

  const createParticle = useCallback((x: number, y: number) => {
    const particle = document.createElement('div');
    particle.className = `fixed pointer-events-none z-40 text-xs font-mono transition-all duration-2000 ${
      theme === 'dark' ? 'text-cyan-400/70' : 'text-blue-600/70'
    }`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.textShadow = theme === 'dark' 
      ? '0 0 8px rgba(34, 211, 238, 0.6)' 
      : '0 0 8px rgba(37, 99, 235, 0.6)';
    particle.textContent = aiElements[Math.floor(Math.random() * aiElements.length)];
    
    document.body.appendChild(particle);
    
    // Animate particle with floating effect
    setTimeout(() => {
      particle.style.opacity = '0';
      particle.style.transform = 'translate(-50%, -50%) translateY(-30px) scale(0.5) rotate(180deg)';
      particle.style.filter = 'blur(2px)';
    }, 100);
    
    setTimeout(() => {
      if (document.body.contains(particle)) {
        document.body.removeChild(particle);
      }
    }, 2000);
  }, [theme, aiElements]);

  const createRipple = useCallback((x: number, y: number) => {
    const ripple = document.createElement('div');
    ripple.className = 'fixed pointer-events-none z-30 rounded-full border-2 transition-all duration-1000';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.borderColor = theme === 'dark' 
      ? 'rgba(34, 211, 238, 0.6)' 
      : 'rgba(37, 99, 235, 0.6)';
    ripple.style.boxShadow = theme === 'dark'
      ? '0 0 20px rgba(34, 211, 238, 0.4)'
      : '0 0 20px rgba(37, 99, 235, 0.4)';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
      ripple.style.width = '80px';
      ripple.style.height = '80px';
      ripple.style.opacity = '0';
      ripple.style.borderColor = theme === 'dark' 
        ? 'rgba(34, 211, 238, 0.2)' 
        : 'rgba(37, 99, 235, 0.2)';
    }, 50);
    
    setTimeout(() => {
      if (document.body.contains(ripple)) {
        document.body.removeChild(ripple);
      }
    }, 1000);
  }, [theme]);

  const updateCursor = useCallback(() => {
    const dx = mousePos.current.x - cursorPos.current.x;
    const dy = mousePos.current.y - cursorPos.current.y;
    
    cursorPos.current.x += dx * 0.15;
    cursorPos.current.y += dy * 0.15;

    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${cursorPos.current.x - 25}px, ${cursorPos.current.y - 25}px)`;
    }

    if (innerCursorRef.current) {
      innerCursorRef.current.style.transform = `translate(${cursorPos.current.x - 3}px, ${cursorPos.current.y - 3}px)`;
    }

    if (trailRef.current) {
      trailRef.current.style.transform = `translate(${cursorPos.current.x - 15}px, ${cursorPos.current.y - 15}px)`;
    }

    animationId.current = requestAnimationFrame(updateCursor);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isNavbar = target.closest('nav');
      const isClickable = target.closest('a, button, input, textarea');

      mousePos.current = { x: e.clientX, y: e.clientY };

      if (cursorRef.current && trailRef.current && innerCursorRef.current) {
        if (isNavbar) {
          cursorRef.current.style.opacity = '0';
          trailRef.current.style.opacity = '0';
          innerCursorRef.current.style.opacity = '0';
          return;
        }

        cursorRef.current.style.opacity = '1';
        trailRef.current.style.opacity = '1';
        innerCursorRef.current.style.opacity = '1';

        // Enhanced hover effects
        if (isClickable) {
          cursorRef.current.style.transform += ' scale(1.5)';
          trailRef.current.style.transform += ' scale(1.8)';
          innerCursorRef.current.style.transform += ' scale(2)';
          
          // Add glow effect on hover
          cursorRef.current.style.boxShadow = theme === 'dark'
            ? '0 0 30px rgba(34, 211, 238, 0.8), 0 0 60px rgba(34, 211, 238, 0.4)'
            : '0 0 30px rgba(37, 99, 235, 0.8), 0 0 60px rgba(37, 99, 235, 0.4)';
        } else {
          cursorRef.current.style.transform = cursorRef.current.style.transform.replace(' scale(1.5)', '');
          trailRef.current.style.transform = trailRef.current.style.transform.replace(' scale(1.8)', '');
          innerCursorRef.current.style.transform = innerCursorRef.current.style.transform.replace(' scale(2)', '');
          
          // Reset glow effect
          cursorRef.current.style.boxShadow = theme === 'dark'
            ? '0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.3)'
            : '0 0 20px rgba(37, 99, 235, 0.6), 0 0 40px rgba(37, 99, 235, 0.3)';
        }
      }

      // Create particles more frequently for better visual effect
      if (Math.random() > 0.95 && !isNavbar) {
        createParticle(e.clientX, e.clientY);
      }
    };

    const handleMouseDown = () => {
      if (cursorRef.current && innerCursorRef.current) {
        cursorRef.current.style.transform += ' scale(0.8)';
        innerCursorRef.current.style.transform += ' scale(0.5)';
        
        // Create ripple effect on click
        createRipple(mousePos.current.x, mousePos.current.y);
      }
    };

    const handleMouseUp = () => {
      if (cursorRef.current && innerCursorRef.current) {
        cursorRef.current.style.transform = cursorRef.current.style.transform.replace(' scale(0.8)', '');
        innerCursorRef.current.style.transform = innerCursorRef.current.style.transform.replace(' scale(0.5)', '');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    animationId.current = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [updateCursor, createParticle, createRipple, theme]);

  return (
    <>
      {/* Outer cursor ring with neon glow */}
      <div
        ref={cursorRef}
        className="fixed w-12 h-12 pointer-events-none z-50 transition-all duration-200 ease-out rounded-full border-2"
        style={{
          borderColor: theme === 'dark' ? 'rgba(34, 211, 238, 0.8)' : 'rgba(37, 99, 235, 0.8)',
          backgroundColor: theme === 'dark' 
            ? 'rgba(34, 211, 238, 0.05)' 
            : 'rgba(37, 99, 235, 0.05)',
          boxShadow: theme === 'dark'
            ? '0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.3)'
            : '0 0 20px rgba(37, 99, 235, 0.6), 0 0 40px rgba(37, 99, 235, 0.3)',
          backdropFilter: 'blur(2px)',
        }}
      />
      
      {/* Inner cursor dot */}
      <div
        ref={innerCursorRef}
        className="fixed w-1.5 h-1.5 pointer-events-none z-50 transition-all duration-100 ease-out rounded-full"
        style={{
          backgroundColor: theme === 'dark' ? '#22d3ee' : '#2563eb',
          boxShadow: theme === 'dark'
            ? '0 0 10px rgba(34, 211, 238, 1)'
            : '0 0 10px rgba(37, 99, 235, 1)',
        }}
      />
      
      {/* Trail with gradient */}
      <div
        ref={trailRef}
        className="fixed w-8 h-8 pointer-events-none z-40 transition-all duration-300 ease-out rounded-full"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, rgba(34, 211, 238, 0.1) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0.1) 40%, transparent 70%)',
          filter: 'blur(1px)',
        }}
      />
    </>
  );
};

export default CursorEffect;