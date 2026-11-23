import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeContext";
import AKimage from "/Icon/AK.jpg";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, isTransitioning } = useTheme();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 30);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const navItems = ["About", "Education", "Experience", "Projects", "Contact"];

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId.toLowerCase());
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  }, []);

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl rounded-xl transition-all duration-300 border-[3px] border-slate-900 dark:border-white ${
          isScrolled
            ? "bg-white dark:bg-gray-900 shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#ffffff] py-2 px-6"
            : "bg-white/90 dark:bg-gray-900/90 shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#ffffff] py-3 px-6"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="relative w-9 h-9">
              <img
                src={AKimage}
                alt="Arth Kadiya"
                className="w-full h-full rounded-lg object-cover border-2 border-slate-900 dark:border-white"
              />
            </div>
            <span className="font-display font-black text-base tracking-wide text-slate-900 dark:text-white uppercase">
              Arth Kadiya
            </span>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-slate-900 dark:text-gray-100 hover:bg-yellow-250 hover:text-slate-900 dark:hover:bg-yellow-400 dark:hover:text-slate-950 px-4 py-2 text-xs font-mono-code font-bold uppercase tracking-wider transition-colors duration-250 border-2 border-transparent hover:border-slate-900 dark:hover:border-white rounded-lg"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center space-x-2">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </motion.button>
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
              className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-[2px] z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-1/2 z-50 w-[92%] max-w-sm rounded-xl bg-white dark:bg-gray-900 border-[3px] border-slate-900 dark:border-white shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#ffffff] p-4 md:hidden"
            >
              <div className="flex flex-col space-y-1">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full text-left px-5 py-3 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-mono-code font-bold uppercase tracking-wider transition-colors border-2 border-transparent hover:border-slate-900 dark:hover:border-white touch-manipulation active:scale-[0.98]"
                  >
                    {item}
                  </motion.button>
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
