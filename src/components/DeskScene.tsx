  import React, { useRef, useEffect, useMemo } from 'react';
  import { useFrame, useThree } from '@react-three/fiber';
  import { useSpring, animated } from '@react-spring/three';
  import * as THREE from 'three';
  import { useTheme } from './ThemeContext';

  const DeskScene = () => {
    const { theme } = useTheme();
    const characterRef = useRef<THREE.Group>();
    const headRef = useRef<THREE.Mesh>();
    const coffeeRef = useRef<THREE.Mesh>();
    const monitorRef = useRef<THREE.Group>();
    const keyboardRef = useRef<THREE.Mesh>();
    const mouseRef = useRef<THREE.Mesh>();
    const { viewport } = useThree();

    //Responsive scaling based on viewport
    const scale = useMemo(() => {
      const baseScale = Math.min(viewport.width / 8, viewport.height / 6);
      return Math.max(0.5, Math.min(1.2, baseScale));
    }, [viewport]);

//    Optimized materials with memoization
    const materials = useMemo(() => {
      const createMaterial = (color: string, metalness = 0.3, roughness = 0.5, emissive?: string) => {
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          metalness,
          roughness,
          transparent: true,
          opacity: 0.9,
        });
        
        if (emissive) {
          material.emissive = new THREE.Color(emissive);
          material.emissiveIntensity = 0.2;
        }
        
        return material;
      };

      return {
        desk: createMaterial(theme === 'dark' ? '#4a5568' : '#718096', 0.8, 0.2),
        monitor: createMaterial(theme === 'dark' ? '#2d3748' : '#e2e8f0', 0.9, 0.1),
        screen: createMaterial(theme === 'dark' ? '#3182ce' : '#2b6cb0', 0.1, 0.9, theme === 'dark' ? '#4299e1' : '#3182ce'),
        keyboard: createMaterial(theme === 'dark' ? '#1a202c' : '#cbd5e0', 0.7, 0.3),
        coffee: createMaterial(theme === 'dark' ? '#d69e2e' : '#b7791f', 0.8, 0.2),
        character: createMaterial(theme === 'dark' ? '#4299e1' : '#3182ce', 0.2, 0.8),
        head: createMaterial(theme === 'dark' ? '#f6e05e' : '#ecc94b', 0.1, 0.9),
        mouse: createMaterial(theme === 'dark' ? '#2d3748' : '#a0aec0', 0.6, 0.4),
      };
    }, [theme]);

  //  Animated springs for smooth interactions
    const [characterSpring, setCharacterSpring] = useSpring(() => ({
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      config: { tension: 300, friction: 30 }
    }));

    const [monitorSpring, setMonitorSpring] = useSpring(() => ({
      rotation: [0, 0, 0],
      position: [0, 0, 0],
      config: { tension: 200, friction: 25 }
    }));

    //Optimized animation loop
    useFrame((state) => {
      const time = state.clock.getElapsedTime();
      
      //Subtle floating animation for monitor
      if (monitorRef.current) {
        monitorRef.current.position.y = 0.9 + Math.sin(time * 0.5) * 0.02;
        monitorRef.current.rotation.y = Math.sin(time * 0.3) * 0.05;
      }

//      Gentle head movement
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 0.4) * 0.1;
        headRef.current.rotation.x = Math.sin(time * 0.6) * 0.05;
      }

  //    Coffee steam effect (rotation)
      if (coffeeRef.current) {
        coffeeRef.current.rotation.y = time * 0.5;
      }
    });

    const handleInteraction = (object: string) => {
      switch (object) {
        case 'character':
          setCharacterSpring({
            position: [0, 0.1, 0],
            rotation: [0, Math.PI * 0.1, 0],
            onRest: () => setCharacterSpring({ position: [0, 0, 0], rotation: [0, 0, 0] })
          });
          break;
        case 'monitor':
          setMonitorSpring({
            rotation: [0, 0.2, 0],
            onRest: () => setMonitorSpring({ rotation: [0, 0, 0] })
          });
          break;
      }
    };

    return (
      <group scale={[scale, scale, scale]} position={[0, -1, 0]}>
        {/* Desk with improved geometry */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.15, 1.5]} />
          <primitive object={materials.desk} />
        </mesh>

        {/* Monitor setup */}
        <animated.group 
          ref={monitorRef} 
          position={monitorSpring.position}
          rotation={monitorSpring.rotation}
          onClick={() => handleInteraction('monitor')}
        >
          <group position={[0, 0.9, -0.4]}>
            {/* Monitor base */}
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.1, 0.15, 0.05]} />
              <primitive object={materials.monitor} />
            </mesh>
            
            {/* Monitor stand */}
            <mesh position={[0, -0.15, 0]}>
              <boxGeometry args={[0.05, 0.3, 0.05]} />
              <primitive object={materials.monitor} />
            </mesh>
            
            {/* Monitor screen */}
            <mesh castShadow>
              <boxGeometry args={[1.2, 0.7, 0.08]} />
              <primitive object={materials.monitor} />
            </mesh>
            
            {/* Screen display */}
            <mesh position={[0, 0, 0.041]}>
              <planeGeometry args={[1.1, 0.6]} />
              <primitive object={materials.screen} />
            </mesh>
          </group>
        </animated.group>

        {/* Keyboard with keys */}
        <group position={[0, 0.45, 0.2]} rotation={[-0.1, 0, 0]}>
          <mesh ref={keyboardRef}>
            <boxGeometry args={[0.6, 0.03, 0.2]} />
            <primitive object={materials.keyboard} />
          </mesh>
          
          {/* Individual keys */}
          {Array.from({ length: 15 }).map((_, i) => (
            <mesh 
              key={i}
              position={[
                (i % 5 - 2) * 0.08,
                0.02,
                (Math.floor(i / 5) - 1) * 0.05
              ]}
            >
              <boxGeometry args={[0.06, 0.01, 0.04]} />
              <primitive object={materials.keyboard} />
            </mesh>
          ))}
        </group>

        {/* Mouse */}
        <mesh 
          ref={mouseRef}
          position={[0.4, 0.46, 0.1]} 
          rotation={[0, -0.3, 0]}
        >
          <boxGeometry args={[0.08, 0.02, 0.12]} />
          <primitive object={materials.mouse} />
        </mesh>

        {/* Coffee cup with steam effect */}
        <group position={[0.6, 0.45, 0]}>
          <mesh ref={coffeeRef} castShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.12]} />
            <primitive object={materials.coffee} />
          </mesh>
          
          {/* Coffee handle */}
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.04, 0.008, 8, 16]} />
            <primitive object={materials.coffee} />
          </mesh>
          
          {/* Steam particles */}
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh 
              key={i}
              position={[0, 0.1 + i * 0.05, 0]}
              scale={[0.01, 0.01, 0.01]}
            >
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial 
                color={theme === 'dark' ? '#ffffff' : '#f7fafc'} 
                transparent 
                opacity={0.3 - i * 0.1} 
              />
            </mesh>
          ))}
        </group>

        {/* Character */}
        <animated.group 
          ref={characterRef}
          position={characterSpring.position}
          rotation={characterSpring.rotation}
          onClick={() => handleInteraction('character')}
        >
          <group position={[0, 0.7, 0.6]} rotation={[0, Math.PI, 0]}>
            {/* Body */}
            <mesh castShadow>
              <capsuleGeometry args={[0.18, 0.4, 8, 16]} />
              <primitive object={materials.character} />
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 0.35, 0]} castShadow>
              <sphereGeometry args={[0.15, 32, 32]} />
              <primitive object={materials.head} />
            </mesh>
            
            {/* Arms */}
            <mesh position={[-0.25, 0.1, 0]} rotation={[0, 0, -0.3]}>
              <capsuleGeometry args={[0.05, 0.25, 8, 16]} />
              <primitive object={materials.character} />
            </mesh>
            <mesh position={[0.25, 0.1, 0]} rotation={[0, 0, 0.3]}>
              <capsuleGeometry args={[0.05, 0.25, 8, 16]} />
              <primitive object={materials.character} />
            </mesh>
          </group>
        </animated.group>

        {/* Enhanced lighting */}
        <pointLight 
          position={[2, 3, 2]} 
          intensity={0.5}
          color={theme === 'dark' ? '#4299e1' : '#3182ce'}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
        <spotLight
          position={[0, 5, 0]}
          angle={0.3}
          penumbra={0.5}
          intensity={0.3}
          castShadow
        />
      </group>
    );
  };

  export default DeskScene;