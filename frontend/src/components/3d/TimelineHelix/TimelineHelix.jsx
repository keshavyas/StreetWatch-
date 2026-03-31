import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const TimelineHelix = ({ progress = 100 }) => {
    const groupRef = useRef();

    useFrame((state, delta) => {
        groupRef.current.rotation.y += delta * 0.5;
    });

    const numPoints = 60;
    const geometryArgs = [0.1, 16, 16];

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 10, 5]} intensity={1} color="#00f2fe" />
            
            {Array.from({ length: numPoints }).map((_, i) => {
                const isActive = (i / numPoints) * 100 <= progress;
                const angle = i * 0.4;
                const height = (i - numPoints / 2) * 0.1;
                const radius = 2;
                
                return (
                    <mesh 
                        key={i} 
                        position={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}
                    >
                        <sphereGeometry args={geometryArgs} />
                        <meshStandardMaterial 
                            color={isActive ? "#00f2fe" : "#334155"} 
                            emissive={isActive ? "#00f2fe" : "#000000"}
                            emissiveIntensity={isActive ? 2 : 0}
                        />
                    </mesh>
                );
            })}
        </group>
    );
};
