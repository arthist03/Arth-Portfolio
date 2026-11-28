import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Activity, SlidersHorizontal } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { getDeviceProfile } from '../utils/deviceTier';

const BUFFER_SIZE = 160;

/**
 * Pure O(1) synthetic PQRST cardiac waveform generator at phase u in [0, 1).
 */
function samplePqrst(u: number): number {
  const p = 0.14 * Math.exp(-Math.pow((u - 0.16) / 0.032, 2));
  const q = -0.16 * Math.exp(-Math.pow((u - 0.31) / 0.014, 2));
  const r = 1.0 * Math.exp(-Math.pow((u - 0.345) / 0.015, 2));
  const s = -0.26 * Math.exp(-Math.pow((u - 0.38) / 0.016, 2));
  const t = 0.26 * Math.exp(-Math.pow((u - 0.62) / 0.055, 2));
  return p + q + r + s + t;
}

const BiosignalLab: React.FC = () => {
  const { theme } = useTheme();
  const profile = useMemo(() => getDeviceProfile(), []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [filtered, setFiltered] = useState(true);
  const [bpm, setBpm] = useState(72);

  // Pre-allocated typed ring buffer: zero heap allocations during animation
  const ringRef = useRef<Float32Array>(new Float32Array(BUFFER_SIZE));
  const writeIdxRef = useRef(0);
  const phaseRef = useRef(0);
  const emaRef = useRef(0);
  const baselinePhaseRef = useRef(0);
  const isInViewRef = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Seed buffer once so first paint renders a complete waveform immediately
    const ring = ringRef.current;
    for (let i = 0; i < BUFFER_SIZE; i++) {
      const u = (i / 64) % 1;
      ring[i] = samplePqrst(u);
    }

    const dpr = Math.min(window.devicePixelRatio || 1, profile.tier === 'low' ? 1 : 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };
    resize();

    const frameInterval = 1000 / profile.targetFps;
    let lastTime = performance.now();
    let rafId = 0;

    const drawFrame = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      ctx.clearRect(0, 0, w, h);

      // Baseline grid line
      ctx.strokeStyle = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.09)';
      ctx.lineWidth = Math.max(1, dpr);
      ctx.beginPath();
      const midY = h * 0.58;
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();

      // Waveform stroke
      ctx.strokeStyle = filtered
        ? theme === 'dark'
          ? '#34d399'
          : '#059669'
        : theme === 'dark'
        ? '#fbbf24'
        : '#d97706';
      ctx.lineWidth = Math.max(1.5, 1.8 * dpr);
      ctx.lineJoin = 'round';
      ctx.beginPath();

      const stepX = w / (BUFFER_SIZE - 1);
      const amp = h * 0.42;
      const head = writeIdxRef.current;

      for (let i = 0; i < BUFFER_SIZE; i++) {
        const idx = (head + i) % BUFFER_SIZE;
        const x = i * stepX;
        const y = midY - ring[idx] * amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (document.hidden || !isInViewRef.current) return;
      const delta = now - lastTime;
      if (delta < frameInterval) return;
      lastTime = now - (delta % frameInterval);

      if (!profile.reducedMotion) {
        const dtSec = Math.min(delta / 1000, 0.05);
        phaseRef.current = (phaseRef.current + (bpm / 60) * dtSec) % 1;
        baselinePhaseRef.current += dtSec * 3.1;

        const cleanSample = samplePqrst(phaseRef.current);
        const artifact =
          0.14 * Math.sin(baselinePhaseRef.current) +
          0.11 * Math.sin(baselinePhaseRef.current * 9.7);

        let value: number;
        if (filtered) {
          // Single-pole EMA smoothing keeps QRS crisp while rejecting high-freq drift
          emaRef.current = emaRef.current * 0.25 + cleanSample * 0.75;
          value = emaRef.current;
        } else {
          value = cleanSample + artifact;
        }

        ring[writeIdxRef.current] = value;
        writeIdxRef.current = (writeIdxRef.current + 1) % BUFFER_SIZE;
      }

      drawFrame();
    };

    drawFrame();
    if (!profile.reducedMotion) {
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [filtered, bpm, theme, profile]);

  return (
    <div ref={containerRef} className="mt-2 flex flex-col gap-2">
      <div className="relative w-full h-[68px] rounded-lg border-2 border-slate-900 dark:border-neutral-600 bg-white dark:bg-[#141414] overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute top-1.5 left-2 flex items-center gap-1.5 text-[10px] font-mono-code font-bold uppercase text-slate-700 dark:text-neutral-300 pointer-events-none">
          <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>{bpm} BPM</span>
          <span className="text-slate-400 dark:text-neutral-500">•</span>
          <span>{filtered ? 'Bandpass Clean' : 'Raw + 60Hz Noise'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-[10px] font-mono-code font-bold uppercase">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFiltered((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border-2 border-slate-900 dark:border-neutral-400 bg-white dark:bg-[#272727] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#313131] transition-transform active:scale-95"
          >
            <SlidersHorizontal className="w-3 h-3" />
            {filtered ? 'Show Raw Noise' : 'Apply DSP Filter'}
          </button>
        </div>

        <label className="flex items-center gap-1.5 text-slate-700 dark:text-neutral-300">
          <span>Rate</span>
          <input
            type="range"
            min={55}
            max={120}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            aria-label="Simulated heart rate BPM"
            className="w-16 sm:w-20 accent-slate-900 dark:accent-white cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};

export default BiosignalLab;
