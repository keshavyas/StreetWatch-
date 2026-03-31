import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, MeshWobbleMaterial } from '@react-three/drei';

export const ScanningCylinder = () => {
    const meshRef = useRef();
    
    useFrame((state, delta) => {
        meshRef.current.rotation.y += delta * 1.5;
        // Bobbing motion up and down
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    });

    return (
        <group>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 0, 0]} intensity={2} color="#00f2fe" distance={5} />
            <Cylinder ref={meshRef} args={[1, 1, 2, 32]} position={[0, 0, 0]}>
                <MeshWobbleMaterial
                    color="cyan"
                    wireframe={true}
                    factor={1}
                    speed={2}
                    transparent={true}
                    opacity={0.6}
                />
            </Cylinder>
            {/* Inner scanning beam */}
            <Cylinder args={[0.9, 0.9, 2.1, 32]} position={[0, 0, 0]}>
                <meshBasicMaterial color="#00f2fe" transparent={true} opacity={0.2} />
            </Cylinder>
        </group>
    );
};
