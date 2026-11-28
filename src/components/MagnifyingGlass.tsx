import React, { useRef, useMemo, useEffect } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { STLLoader } from 'three-stdlib';
import * as THREE from 'three';
import { useTheme } from './ThemeContext';

export type CadViewMode = 'solid' | 'wireframe' | 'xray';

interface MagnifyingGlassProps {
  mode?: CadViewMode;
  reducedMotion?: boolean;
}

export const MagnifyingGlass: React.FC<MagnifyingGlassProps> = ({
  mode = 'solid',
  reducedMotion = false,
}) => {
  const { theme } = useTheme();
  const groupRef = useRef<THREE.Group>(null);
  const rawGeometry = useLoader(STLLoader, '/magfy.stl');

  const geometry = useMemo(() => {
    const geo = rawGeometry.clone();
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [rawGeometry]);

  // Free GPU geometry buffers cleanly on unmount (critical on 2 GB RAM devices)
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.08 - 0.2;
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.04;
  });

  const isDark = theme === 'dark';

  return (
    <group ref={groupRef} dispose={null} scale={[14, 14, 14]} rotation={[-0.25, 0.35, -0.2]}>
      {/* Precision CAD Body rendered from magfy.stl */}
      <mesh geometry={geometry} castShadow={mode === 'solid'} receiveShadow={mode === 'solid'}>
        {mode === 'wireframe' ? (
          <meshBasicMaterial
            color={isDark ? '#38bdf8' : '#0f172a'}
            wireframe
          />
        ) : mode === 'xray' ? (
          <meshStandardMaterial
            color={isDark ? '#818cf8' : '#2563eb'}
            transparent
            opacity={0.34}
            roughness={0.2}
            metalness={0.1}
            depthWrite={false}
          />
        ) : (
          <meshStandardMaterial
            color={isDark ? '#e2e8f0' : '#475569'}
            metalness={0.86}
            roughness={0.24}
            envMapIntensity={1.2}
          />
        )}
      </mesh>

      {/* Optical Glass Lens Insert */}
      <mesh position={[0, 0.0448, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.0365, 0.0365, 0.0035, 28]} />
        {mode === 'wireframe' ? (
          <meshBasicMaterial color="#06b6d4" wireframe />
        ) : (
          <meshPhysicalMaterial
            color={isDark ? '#a5b4fc' : '#bfdbfe'}
            transmission={mode === 'xray' ? 0.92 : 0.85}
            opacity={mode === 'xray' ? 0.45 : 0.65}
            transparent
            roughness={0.05}
            ior={1.52}
            thickness={0.45}
            reflectivity={0.85}
          />
        )}
      </mesh>
    </group>
  );
};

export default MagnifyingGlass;
