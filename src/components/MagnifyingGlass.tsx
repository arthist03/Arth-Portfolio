import React, { useRef, useMemo } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { STLLoader } from 'three-stdlib';
import * as THREE from 'three';
import { useTheme } from './ThemeContext';

export const MagnifyingGlass: React.FC = () => {
  const { theme } = useTheme();
  const groupRef = useRef<THREE.Group>(null);
  const rawGeometry = useLoader(STLLoader, '/magfy.stl');

  const geometry = useMemo(() => {
    const geo = rawGeometry.clone();
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [rawGeometry]);

  // Gentle idle wobble / floating animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.08 - 0.2;
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.05;
  });

  const isDark = theme === 'dark';

  return (
    <group ref={groupRef} dispose={null} scale={[14, 14, 14]} rotation={[-0.25, 0.35, -0.2]}>
      {/* Precision CAD Model rendered from exact magfy.stl */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={isDark ? '#e2e8f0' : '#475569'}
          metalness={0.88}
          roughness={0.22}
          envMapIntensity={1.3}
        />
      </mesh>

      {/* Optical Glass Lens Insert */}
      <mesh position={[0, 0.0448, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.0365, 0.0365, 0.0035, 32]} />
        <meshPhysicalMaterial
          color={isDark ? '#a5b4fc' : '#bfdbfe'}
          transmission={0.88}
          opacity={0.65}
          transparent={true}
          roughness={0.05}
          ior={1.52}
          thickness={0.5}
          reflectivity={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.03}
        />
      </mesh>
    </group>
  );
};

export default MagnifyingGlass;
