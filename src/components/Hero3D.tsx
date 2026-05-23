import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { useTheme } from './ThemeContext';
import LoadingSpinner from './LoadingSpinner';
import DeskScene from './DeskScene';

const Hero3D = () => {
  const { theme } = useTheme();

  const canvasConfig = useMemo(() => ({
    camera: { position: [0, 2, 5], fov: 75 },
    gl: { 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance" as const,
      stencil: false,
      depth: true
    },
    dpr: Math.min(window.devicePixelRatio, 2),
    performance: { min: 0.5 }
  }), []);

  const starsConfig = useMemo(() => ({
    radius: 50,
    depth: 30,
    count: theme === 'dark' ? 1200 : 500,
    factor: theme === 'dark' ? 3 : 1.5,
    saturation: 0,
    fade: true,
    speed: 0.3
  }), [theme]);

  return (
    <div className="relative w-full h-full min-h-[320px] md:min-h-[450px] overflow-hidden">
      {/* 3D Canvas */}
      <div className="relative h-full w-full z-10">
        <Suspense fallback={<LoadingSpinner />}>
          <Canvas {...canvasConfig}>
            
            {/* Optimized lighting */}
            <ambientLight intensity={theme === 'dark' ? 0.4 : 0.7} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={theme === 'dark' ? 1.0 : 1.4}
              color={theme === 'dark' ? '#818cf8' : '#4f46e5'}
              castShadow
              shadow-mapSize-width={512}
              shadow-mapSize-height={512}
            />
            <pointLight 
              position={[-10, -10, -5]} 
              intensity={0.4}
              color={theme === 'dark' ? '#c084fc' : '#9333ea'}
            />

            {/* Stars background */}
            <Stars {...starsConfig} />

            {/* Floating 3D elements */}
            <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.4}>
              <DeskScene />
            </Float>

            {/* Optimized controls */}
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
              autoRotate
              autoRotateSpeed={0.6}
              dampingFactor={0.05}
              enableDamping
            />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
};

export default Hero3D;