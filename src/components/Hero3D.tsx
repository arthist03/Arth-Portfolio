import React, { Suspense, useMemo, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { useTheme } from './ThemeContext';
import LoadingSpinner from './LoadingSpinner';
import MagnifyingGlass from './MagnifyingGlass';

const Hero3D = () => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const canvasConfig = useMemo(() => ({
    camera: { position: [0, 0, 3.6], fov: isMobile ? 54 : 50 },
    gl: { 
      antialias: !isMobile, 
      alpha: true,
      powerPreference: "high-performance" as const,
      stencil: false,
      depth: true
    },
    dpr: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, isMobile ? 1.5 : 2),
    performance: { min: 0.5 }
  }), [isMobile]);

  const starsConfig = useMemo(() => ({
    radius: 50,
    depth: 30,
    count: isMobile ? (theme === 'dark' ? 600 : 300) : (theme === 'dark' ? 1200 : 500),
    factor: theme === 'dark' ? 3 : 1.5,
    saturation: 0,
    fade: true,
    speed: 0.3
  }), [theme, isMobile]);

  return (
    <div 
      className="relative w-full h-full min-h-[300px] md:min-h-[450px] overflow-hidden"
      style={{ touchAction: 'pan-y' }}
    >
      {/* 3D Canvas with passthrough for vertical mobile scrolling */}
      <div className="relative h-full w-full z-10" style={{ touchAction: 'pan-y' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Canvas {...canvasConfig} style={{ touchAction: 'pan-y' }}>
            
            {/* Optimized studio lighting */}
            <ambientLight intensity={theme === 'dark' ? 0.7 : 1.0} />
            <directionalLight 
              position={[5, 8, 5]} 
              intensity={theme === 'dark' ? 1.4 : 1.8}
              color={theme === 'dark' ? '#c7d2fe' : '#ffffff'}
              castShadow={!isMobile}
            />
            <pointLight 
              position={[-6, -6, -3]} 
              intensity={0.6}
              color={theme === 'dark' ? '#818cf8' : '#38bdf8'}
            />
            <pointLight 
              position={[3, 3, 4]} 
              intensity={0.8}
              color="#ffffff"
            />

            {/* Stars background */}
            <Stars {...starsConfig} />

            {/* Floating 3D Magnifying Glass */}
            <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.5}>
              <MagnifyingGlass />
            </Float>

            {/* Orbit Controls with mobile touch consideration */}
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
              autoRotate
              autoRotateSpeed={1.0}
              dampingFactor={0.05}
              enableDamping
              touches={{
                ONE: 1, // ROTATE
                TWO: 0  // Ignore pinch-zoom
              }}
            />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
};

export default Hero3D;
