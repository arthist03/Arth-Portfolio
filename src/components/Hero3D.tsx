import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import DeskScene from './DeskScene';
import LoadingSpinner from './LoadingSpinner';

const Hero3D = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md z-0"
        style={{
          backgroundImage: "url('/path-to-your-image.jpg')", // Replace with your image path
        }}
      ></div>

      {/* 3D Canvas */}
      <div className="relative h-full w-full z-10">
        <Suspense fallback={<LoadingSpinner />}>
          <Canvas
            camera={{ position: [0, 2, 5], fov: 75 }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <OrbitControls 
              enableZoom
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Text Overlay */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center z-20">
        <p className="text-gray-400 animate-bounce">Scroll to explore</p>
      </div>
    </div>
  );
};

export default Hero3D;
