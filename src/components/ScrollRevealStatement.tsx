import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { getDeviceProfile } from '../utils/deviceTier';

const STATEMENT_WORDS =
  'Bridging clinical medicine, surgical robotics hardware, and reliable machine learning from lab bench to bedside.'.split(
    ' '
  );

const WordReveal: React.FC<{
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}> = ({ word, index, total, progress, reducedMotion }) => {
  const start = (index / total) * 0.72;
  const end = Math.min(1, start + 0.24);
  const opacity = useTransform(progress, [start, end], [0.25, 1]);

  return (
    <motion.span
      style={{ opacity: reducedMotion ? 1 : opacity }}
      className="inline-block mr-[0.28em]"
    >
      {word}
    </motion.span>
  );
};

const ScrollRevealStatement: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const profile = useMemo(() => getDeviceProfile(), []);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'end 0.45'],
  });

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 px-4 border-t-[3px] border-slate-900 dark:border-neutral-800 bg-[#fbfaf5] dark:bg-[#181818]"
      aria-label="Engineering mission"
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-xs font-mono-code font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400 mb-4">
          // Clinical Engineering Principle
        </p>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] text-slate-900 dark:text-white"
          style={{ textWrap: 'balance' }}
        >
          {STATEMENT_WORDS.map((word, idx) => (
            <WordReveal
              key={`${word}-${idx}`}
              word={word}
              index={idx}
              total={STATEMENT_WORDS.length}
              progress={scrollYProgress}
              reducedMotion={profile.reducedMotion}
            />
          ))}
        </h2>
      </div>
    </section>
  );
};

export default ScrollRevealStatement;
