import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const ThreatGlobe = () => {
  const meshRef = useRef();

  // Using unpkg's three-globe demo realistic earth texture
  const colorMap = useTexture('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.1;
  });

  // Calculate position for Indore: Lat 22.7196, Lon 75.8577
  // Formula:
  // x = radius * cos(lat) * cos(lon)
  // y = radius * sin(lat)
  // z = radius * cos(lat) * sin(lon)
  // Note: ThreeJS coordinate system might require offset adjustments for prime meridian.
  // Standard globe radius is 1.5 in this component
  const latRads = (22.7196 * Math.PI) / 180;
  // Offset longitude slightly based on texture mapping orientation
  const lonRads = ((75.8577 - 90) * Math.PI) / 180; 

  const x = 1.5 * Math.cos(latRads) * Math.cos(lonRads);
  const y = 1.5 * Math.sin(latRads);
  const z = 1.5 * Math.cos(latRads) * Math.sin(lonRads);

  return (
    <group ref={meshRef}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 3, 5]} intensity={2.5} />
      
      {/* Realistic Earth */}
      <Sphere args={[1.5, 64, 64]}>
        <meshStandardMaterial
          map={colorMap}
          roughness={0.6}
          metalness={0.1}
        />
      </Sphere>

      {/* Indore Glowing Marker */}
      <mesh position={[x, y, z]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      
      {/* Pulsing ring around Indore */}
      <mesh position={[x, y, z]}>
        <ringGeometry args={[0.06, 0.12, 32]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Outer heat ring */}
      <mesh position={[x, y, z]}>
        <ringGeometry args={[0.12, 0.25, 32]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
