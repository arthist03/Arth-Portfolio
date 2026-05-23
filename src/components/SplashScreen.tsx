import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Brain, Activity } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    { text: "INITIALIZING CLINICAL SYSTEM DIAGNOSTICS...", delay: 0 },
    { text: "MOUNTING BIO-ASSISTIVE HARDWARE INTERFACES... [OK]", delay: 400 },
    { text: "CONNECTING EEG/EMG SIGNAL CONVERTERS... [OK]", delay: 800 },
    { text: "LAUNCHING NEURAL DECISION MESH (PYTORCH)... [OK]", delay: 1200 },
    { text: "CALIBRATING ROBOTIC COMPUTER VISION FILTERS... [OK]", delay: 1600 },
    { text: "SYNCHRONIZING CLINICAL DATA SYNAPSES... [OK]", delay: 2000 },
    { text: "SYSTEM COMPILED. WELCOME, VISITOR.", delay: 2400 },
  ];

  useEffect(() => {
    // Dynamic progress bar loader
    const duration = 2600;
    const intervalTime = 30;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, intervalTime);

    // Show logs sequentially based on delays
    const logTimers = logs.map((log, index) => {
      return setTimeout(() => {
        setLogIndex(index + 1);
      }, log.delay);
    });

    // Complete splash screen
    const finishTimer = setTimeout(() => {
      onComplete();
    }, duration + 600);

    return () => {
      clearInterval(timer);
      logTimers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden flex pointer-events-none">
      {/* Left Shutter Curtain */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ ease: [0.87, 0, 0.13, 1], duration: 1.1, delay: 2.8 }}
        className="w-1/2 h-full bg-[#0d0e12] border-r-[3px] border-yellow-400 flex justify-end items-center relative overflow-hidden pointer-events-auto"
      >
        {/* Retro Grid Background inside the shutter */}
        <div className="absolute inset-0 neo-grid-overlay opacity-15 pointer-events-none" />
        
        {/* Giant Logo Text Split Left */}
        <div className="text-[12vw] font-display font-black text-transparent stroke-text-yellow absolute right-[-6vw] whitespace-nowrap select-none uppercase tracking-tighter opacity-10">
          ARTH
        </div>
      </motion.div>

      {/* Right Shutter Curtain */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ ease: [0.87, 0, 0.13, 1], duration: 1.1, delay: 2.8 }}
        className="w-1/2 h-full bg-[#0d0e12] border-l-[3px] border-yellow-400 flex justify-start items-center relative overflow-hidden pointer-events-auto"
      >
        <div className="absolute inset-0 neo-grid-overlay opacity-15 pointer-events-none" />
        
        {/* Giant Logo Text Split Right */}
        <div className="text-[12vw] font-display font-black text-transparent stroke-text-yellow absolute left-[-6vw] whitespace-nowrap select-none uppercase tracking-tighter opacity-10">
          KADIYA
        </div>
      </motion.div>

      {/* Center Console Content Container */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.95 }}
        transition={{ ease: "easeInOut", duration: 0.4, delay: 2.6 }}
        className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-auto z-10"
      >
        <div className="w-full max-w-xl p-8 rounded-2xl border-[3px] border-yellow-400 bg-slate-950 text-yellow-400 shadow-[8px_8px_0px_0px_#f59e0b] relative overflow-hidden font-mono-code">
          
          {/* Neon Header */}
          <div className="flex items-center justify-between border-b-2 border-yellow-400 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 animate-pulse text-yellow-400" />
              <span className="text-xs font-black uppercase tracking-widest text-white">
                AK_OS // HARDWARE_ENG_SYS
              </span>
            </div>
            <span className="text-[10px] font-black border border-yellow-400 px-2 py-0.5 rounded text-white animate-pulse">
              BOOTING...
            </span>
          </div>

          {/* Hologram Grid Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-yellow-400/2 to-transparent bg-[length:100%_4px]" />

          {/* Terminal Console Logs */}
          <div className="space-y-2 text-[10px] md:text-xs h-40 overflow-y-auto mb-6 pr-2 scrollbar-chunky text-slate-350">
            {logs.slice(0, logIndex).map((log, index) => {
              const isWelcome = log.text.includes("WELCOME");
              const isSys = log.text.includes("INITIALIZING");
              return (
                <div key={index} className="flex gap-2 items-start leading-relaxed">
                  <span className="text-yellow-400 shrink-0 select-none">
                    {isWelcome ? "★" : ">"}
                  </span>
                  <span className={`${isWelcome ? "text-yellow-300 font-bold" : isSys ? "text-white font-semibold" : "text-slate-300"}`}>
                    {log.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Loader bar UI */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase">
              <span className="text-white flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> Core Diagnostic Status
              </span>
              <span>{Math.round(progress)}%</span>
            </div>

            {/* Custom Neo-Brutalist Segmented Progress Bar */}
            <div className="h-6 w-full border-2 border-yellow-400 bg-slate-900 rounded overflow-hidden p-0.5 flex gap-0.5">
              {Array.from({ length: 20 }).map((_, i) => {
                const filled = progress >= ((i + 1) / 20) * 100;
                return (
                  <motion.div
                    key={i}
                    className="h-full flex-1"
                    style={{
                      backgroundColor: filled ? "#f59e0b" : "transparent"
                    }}
                    animate={{
                      opacity: filled ? [0.6, 1] : 0.3
                    }}
                    transition={{
                      repeat: filled ? 0 : Infinity,
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Footer message */}
          <div className="mt-6 pt-4 border-t-2 border-yellow-400/20 text-center text-[10px] text-slate-500 uppercase">
            // ALL INTEGRATIONS ACTIVE. DEPLOYING WORKSPACE...
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
