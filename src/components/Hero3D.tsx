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
    radius: 100,
    depth: 50,
    count: theme === 'dark' ? 5000 : 2000,
    factor: theme === 'dark' ? 4 : 2,
    saturation: 0,
    fade: true,
    speed: 0.5
  }), [theme]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Gradient Background */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/30' 
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        }`}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-20 animate-pulse ${
              theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
            }`}
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 4 + 3 + 's'
            }}
          />
        ))}
      </div>

      {/* 3D Canvas */}
      <div className="relative h-full w-full z-10">
        <Suspense fallback={<LoadingSpinner />}>
          <Canvas {...canvasConfig}>
            <color attach="background" args={['transparent']} />
            
            {/* Optimized lighting */}
            <ambientLight intensity={theme === 'dark' ? 0.3 : 0.6} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={theme === 'dark' ? 0.8 : 1.2}
              color={theme === 'dark' ? '#4299e1' : '#3182ce'}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <pointLight 
              position={[-10, -10, -5]} 
              intensity={0.3}
              color={theme === 'dark' ? '#9f7aea' : '#805ad5'}
            />

            {/* Stars background */}
            <Stars {...starsConfig} />

            {/* Floating 3D elements */}
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
              <DeskScene />
            </Float>

            {/* Optimized controls */}
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
              autoRotate
              autoRotateSpeed={0.5}
              dampingFactor={0.05}
              enableDamping
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center z-20">
        <div className={`animate-bounce ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          <div className="w-6 h-10 border-2 border-current rounded-full mx-auto mb-2">
            <div className={`w-1 h-3 ${theme === 'dark' ? 'bg-gray-300' : 'bg-gray-600'} rounded-full mx-auto animate-pulse`} />
          </div>
          <p className="text-sm font-medium">Scroll to explore</p>
        </div>
      </div>
    </div>
  );
};

export default Hero3D;