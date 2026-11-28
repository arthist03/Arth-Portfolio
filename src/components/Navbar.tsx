import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X, Search } from 'lucide-react';
import { useTheme } from './ThemeContext';
import AKimage from '/Icon/AK.jpg';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 30);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const navItems = ['About', 'Education', 'Experience', 'Projects', 'Contact'];

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId.toLowerCase());
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  }, []);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className={`fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-5xl rounded-xl border-[3px] border-slate-900 dark:border-neutral-300 backdrop-blur-md transition-[padding,box-shadow,background-color] duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#1f1f1f]/95 shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000000] py-2 px-4 sm:px-6'
            : 'bg-white/90 dark:bg-[#1f1f1f]/90 shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#000000] py-2.5 px-4 sm:px-6'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Logo Brand */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-2.5 cursor-pointer text-left active:scale-[0.98] transition-transform"
          >
            <img
              src={AKimage}
              alt="Arth Kadiya"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover border-2 border-slate-900 dark:border-neutral-300 shrink-0"
            />
            <span className="font-display font-bold text-sm sm:text-base tracking-wide text-slate-900 dark:text-white uppercase truncate">
              Arth Kadiya
            </span>
          </button>

          {/* Desktop Links & Utilities */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => scrollToSection(item)}
                className="text-slate-900 dark:text-neutral-100 hover:bg-amber-200 hover:text-slate-900 dark:hover:bg-amber-400 dark:hover:text-slate-950 px-3 py-2 text-xs font-mono-code font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-transparent hover:border-slate-900 rounded-lg"
              >
                {item}
              </button>
            ))}

            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open command palette"
              className="ml-1 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 border-slate-900 dark:border-neutral-400 bg-slate-50 dark:bg-[#272727] text-slate-800 dark:text-neutral-200 text-[11px] font-mono-code font-bold hover:bg-slate-100 dark:hover:bg-[#313131] transition-transform active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Ctrl K</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              className="p-2 rounded-lg border-2 border-slate-900 dark:border-neutral-400 bg-white dark:bg-[#272727] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#313131] transition-transform active:scale-95"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Search portfolio"
              className="p-2 rounded-lg bg-white dark:bg-[#272727] text-slate-900 dark:text-white border-2 border-slate-900 dark:border-neutral-400 active:scale-95 transition-transform"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg bg-white dark:bg-[#272727] text-slate-900 dark:text-white border-2 border-slate-900 dark:border-neutral-400 active:scale-95 transition-transform"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="p-2 rounded-lg bg-white dark:bg-[#272727] text-slate-900 dark:text-white border-2 border-slate-900 dark:border-neutral-400 active:scale-95 transition-transform"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop & Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -16, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -16, x: '-50%' }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-20 left-1/2 z-50 w-[94%] max-w-sm rounded-xl bg-white dark:bg-[#1f1f1f] border-[3px] border-slate-900 dark:border-neutral-300 shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#000000] p-3 md:hidden"
            >
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => scrollToSection(item)}
                    className="w-full text-left px-4 py-3 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#272727] rounded-lg font-mono-code font-bold text-xs uppercase tracking-wider transition-colors border-2 border-transparent hover:border-slate-900 dark:hover:border-neutral-400 active:scale-[0.98]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
