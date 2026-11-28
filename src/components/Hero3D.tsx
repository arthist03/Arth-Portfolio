import React, { Suspense, useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { RotateCcw, Box } from 'lucide-react';
import { useTheme } from './ThemeContext';
import MagnifyingGlass, { CadViewMode } from './MagnifyingGlass';
import { getDeviceProfile } from '../utils/deviceTier';

const CAD_MODES: { id: CadViewMode; label: string }[] = [
  { id: 'solid', label: 'Solid' },
  { id: 'wireframe', label: 'Mesh' },
  { id: 'xray', label: 'X-Ray' },
];

const Hero3DSkeleton: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100/70 dark:bg-[#161616]">
    <div className="w-24 h-24 rounded-2xl border-2 border-slate-300 dark:border-neutral-700 animate-pulse bg-slate-200 dark:bg-neutral-800 mb-3" />
    <span className="text-[11px] font-mono-code font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
      Initializing CAD Viewport...
    </span>
  </div>
);

const Hero3D: React.FC = () => {
  const { theme } = useTheme();
  const profile = useMemo(() => getDeviceProfile(), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const [mode, setMode] = useState<CadViewMode>('solid');
  const [isLoaded, setIsLoaded] = useState<boolean>(profile.autoMount3D);
  const [isInView, setIsInView] = useState<boolean>(true);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(
    typeof document !== 'undefined' ? !document.hidden : true
  );

  // Pause WebGL render loop completely when offscreen or tab is hidden (0% idle GPU/battery)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    const onVisibility = () => setIsTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const handleReset = useCallback(() => {
    controlsRef.current?.reset();
    setMode('solid');
  }, []);

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [0, 0, 3.6] as [number, number, number], fov: profile.isTouch ? 54 : 50 },
      gl: {
        antialias: profile.tier !== 'low',
        alpha: true,
        powerPreference: profile.tier === 'low' ? ('low-power' as const) : ('high-performance' as const),
        stencil: false,
        depth: true,
      },
      dpr: profile.dpr,
      performance: { min: 0.5 },
    }),
    [profile]
  );

  const shouldRenderLoop = isInView && isTabVisible && !profile.reducedMotion;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[300px] md:min-h-[450px] overflow-hidden"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Interactive CAD Mode Controls (top-right) */}
      <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 flex-wrap justify-end">
        {isLoaded &&
          CAD_MODES.map((item) => {
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`px-2.5 py-1 text-[10px] font-mono-code font-bold uppercase rounded-md border-2 transition-transform duration-200 active:scale-95 ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                    : 'bg-white/90 dark:bg-[#1f1f1f]/90 text-slate-800 dark:text-neutral-200 border-slate-900 dark:border-neutral-600 hover:bg-slate-100 dark:hover:bg-[#272727]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

        {isLoaded && (
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset 3D camera"
            title="Reset camera"
            className="p-1.5 rounded-md border-2 border-slate-900 dark:border-neutral-600 bg-white/90 dark:bg-[#1f1f1f]/90 text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-[#272727] transition-transform active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Low-memory / legacy device fallback: zero WebGL RAM allocated until tapped */}
      {!isLoaded ? (
        <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-[#161616]">
          <img
            src="/magfy_preview.png"
            alt="3D Optical Magnifier CAD Model Preview"
            className="w-40 h-40 object-contain mb-3 select-none"
            loading="lazy"
          />
          <p className="text-xs font-mono-code text-slate-600 dark:text-neutral-400 mb-3 max-w-[230px]">
            Lightweight preview active for low-memory device mode.
          </p>
          {profile.webglSupported && (
            <button
              type="button"
              onClick={() => setIsLoaded(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono-code font-bold uppercase rounded-lg border-2 border-slate-900 dark:border-white bg-amber-200 dark:bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:scale-95 transition-transform"
            >
              <Box className="w-3.5 h-3.5" />
              Launch 3D CAD
            </button>
          )}
        </div>
      ) : (
        <div className="relative h-full w-full z-10" style={{ touchAction: 'pan-y' }}>
          <Suspense fallback={<Hero3DSkeleton />}>
            <Canvas
              {...canvasConfig}
              frameloop={shouldRenderLoop ? 'always' : 'demand'}
              style={{ touchAction: 'pan-y' }}
            >
              <ambientLight intensity={theme === 'dark' ? 0.75 : 1.0} />
              <directionalLight
                position={[5, 8, 5]}
                intensity={theme === 'dark' ? 1.35 : 1.75}
                color={theme === 'dark' ? '#c7d2fe' : '#ffffff'}
                castShadow={profile.tier === 'high'}
              />
              <pointLight
                position={[-6, -6, -3]}
                intensity={0.6}
                color={theme === 'dark' ? '#818cf8' : '#38bdf8'}
              />
              <pointLight position={[3, 3, 4]} intensity={0.75} color="#ffffff" />

              {profile.starCount > 0 && (
                <Stars
                  radius={50}
                  depth={30}
                  count={profile.starCount}
                  factor={theme === 'dark' ? 2.5 : 1.5}
                  saturation={0}
                  fade
                  speed={profile.reducedMotion ? 0 : 0.25}
                />
              )}

              <Float
                speed={profile.reducedMotion ? 0 : 1.3}
                rotationIntensity={profile.reducedMotion ? 0 : 0.35}
                floatIntensity={profile.reducedMotion ? 0 : 0.4}
              >
                <MagnifyingGlass mode={mode} reducedMotion={profile.reducedMotion} />
              </Float>

              <OrbitControls
                ref={controlsRef}
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
                autoRotate={!profile.reducedMotion}
                autoRotateSpeed={0.9}
                dampingFactor={0.06}
                enableDamping
                touches={{
                  ONE: 1,
                  TWO: 0,
                }}
              />
            </Canvas>
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default Hero3D;
