import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useTheme } from './ThemeContext';

const DeskScene = () => {
  const { theme } = useTheme();
  const characterRef = useRef<THREE.Group>();
  const headRef = useRef<THREE.Mesh>();
  const coffeeRef = useRef<THREE.Mesh>();
  const monitorRef = useRef<THREE.Group>();
  const keyboardRef = useRef<THREE.Mesh>();
  const isAnimating = useRef(false);
  const timeline = useRef<gsap.core.Timeline>();
  const { camera } = useThree();

  // Theme-based colors using useMemo to prevent unnecessary recalculations
  const colors = useMemo(() => ({
    monitor: new THREE.Color(theme === 'dark' ? '#1a202c' : '#e2e8f0'),
    screen: new THREE.Color(theme === 'dark' ? '#3182ce' : '#2b6cb0'),
    keyboard: new THREE.Color(theme === 'dark' ? '#2d3748' : '#cbd5e0'),
    coffee: new THREE.Color(theme === 'dark' ? '#718096' : '#4a5568'),
    character: new THREE.Color(theme === 'dark' ? '#4299e1' : '#3182ce'),
    head: new THREE.Color(theme === 'dark' ? '#f6e05e' : '#ecc94b'),
    desk: new THREE.Color(theme === 'dark' ? '#4a5568' : '#718096'),
  }), [theme]);

  // Create materials using useMemo
  const materials = useMemo(() => ({
    desk: new THREE.MeshStandardMaterial({ 
      color: colors.desk,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.1, // Set opacity to 50%
    }),
    monitor: new THREE.MeshStandardMaterial({ 
      color: colors.monitor,
      roughness: 0.5,
      metalness: 0.8,
      transparent: true,
      opacity: 0.1,
    }),
    screen: new THREE.MeshBasicMaterial({ 
      color: colors.screen,
      emissive: colors.screen,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.1,
    }),
    keyboard: new THREE.MeshStandardMaterial({ 
      color: colors.keyboard,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.1,
    }),
    coffee: new THREE.MeshStandardMaterial({ 
      color: colors.coffee,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.1,
    }),
    character: new THREE.MeshStandardMaterial({ 
      color: colors.character,
      roughness: 0.3,
      transparent: true,
      opacity: 0.1,
    }),
    head: new THREE.MeshStandardMaterial({ 
      color: colors.head,
      roughness: 0.3,
      transparent: true,
      opacity: 0.1,
    })
  }), [colors]);

  useEffect(() => {
    // Update all material colors and opacity when theme changes
    Object.entries(materials).forEach(([key, material]) => {
      material.color.copy(colors[key as keyof typeof colors]);
      if ('emissive' in material) {
        (material as THREE.MeshBasicMaterial).emissive.copy(colors[key as keyof typeof colors]);
      }
      material.opacity = 0.5;  // Ensure opacity is set
    });
  }, [colors, materials]);

  useEffect(() => {
    timeline.current = gsap.timeline({ paused: true });
    
    if (headRef.current && characterRef.current) {
      timeline.current
        .to(headRef.current.rotation, {
          x: -0.3,
          duration: 0.5,
          ease: "power2.out"
        })
        .to(headRef.current.rotation, {
          y: 0.2,
          duration: 0.2,
          repeat: 3,
          yoyo: true,
          ease: "power1.inOut"
        })
        .to(characterRef.current.position, {
          y: characterRef.current.position.y + 0.1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        })
        .to(headRef.current.rotation, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power2.inOut"
        });
    }
  }, []);

  useFrame((state) => {
    if (monitorRef.current && !isAnimating.current) {
      monitorRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.03;
      monitorRef.current.position.y = 0.9 + Math.sin(state.clock.getElapsedTime()) * 0.01;
    }
  });

  const handleClick = (object: string) => {
    if (isAnimating.current) return;

    switch (object) {
      case 'character':
        if (timeline.current) {
          isAnimating.current = true;
          timeline.current.play(0).then(() => {
            isAnimating.current = false;
          });
        }
        break;
      case 'coffee':
        gsap.to(coffeeRef.current.position, {
          y: coffeeRef.current.position.y + 0.2,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "bounce.out"
        });
        break;
      case 'keyboard':
        gsap.to(keyboardRef.current.position, {
          y: keyboardRef.current.position.y - 0.02,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut"
        });
        break;
    }
  };

  return (
    <group position={[0, -1, 0]}>
      {/* Desk */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <primitive object={materials.desk} />
      </mesh>

      {/* Monitor */}
      <group ref={monitorRef} position={[0, 0.9, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.5, 0.05]} />
          <primitive object={materials.monitor} />
        </mesh>
        <mesh position={[0, 0, 0.026]}>
          <planeGeometry args={[0.7, 0.4]} />
          <primitive object={materials.screen} />
        </mesh>
      </group>

      {/* Keyboard */}
      <mesh 
        ref={keyboardRef}
        position={[0, 0.45, 0]} 
        rotation={[-0.2, 0, 0]}
        onClick={() => handleClick('keyboard')}
      >
        <boxGeometry args={[0.4, 0.02, 0.15]} />
        <primitive object={materials.keyboard} />
      </mesh>

      {/* Coffee Cup */}
      <mesh 
        ref={coffeeRef}
        position={[0.5, 0.45, 0]}
        castShadow
        onClick={() => handleClick('coffee')}
      >
        <cylinderGeometry args={[0.05, 0.04, 0.1]} />
        <primitive object={materials.coffee} />
      </mesh>

      {/* Character */}
      <group 
        ref={characterRef}
        position={[0, 0.7, 0.5]} 
        rotation={[0, Math.PI, 0]}
        onClick={() => handleClick('character')}
      >
        <mesh castShadow>
          <capsuleGeometry args={[0.15, 0.3, 8, 16]} />
          <primitive object={materials.character} />
        </mesh>
        <mesh 
          ref={headRef}
          position={[0, 0.3, 0]} 
          castShadow
        >
          <sphereGeometry args={[0.12, 32, 32]} />
          <primitive object={materials.head} />
        </mesh>
      </group>

      {/* Lights */}
      <ambientLight intensity={theme === 'dark' ? 0.5 : 0.7} />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={theme === 'dark' ? 0.8 : 1}
        color={theme === 'dark' ? '#4299e1' : '#3182ce'}
      />
    </group>
  );
};

export default DeskScene;
