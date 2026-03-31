import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AREA_PINS = [
    { name: 'Vijay Nagar',    lat: 22.7533, lon: 75.8937, color: '#ef4444' },
    { name: 'Sarafa',         lat: 22.7196, lon: 75.8577, color: '#eab308' },
    { name: 'Palasia',        lat: 22.7230, lon: 75.8760, color: '#3b82f6' },
    { name: 'AB Road',        lat: 22.6950, lon: 75.8700, color: '#f97316' },
    { name: 'Rajwada',        lat: 22.7186, lon: 75.8567, color: '#a855f7' },
    { name: 'Sapna Sangeeta', lat: 22.7250, lon: 75.8810, color: '#14b8a6' },
    { name: 'Super Corridor', lat: 22.6700, lon: 75.8400, color: '#06b6d4' },
    { name: 'Bhawarkuan',     lat: 22.7412, lon: 75.8698, color: '#ec4899' },
];

const latLonToVec3 = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
};

export const AreaPins = ({ globeRadius = 1.5 }) => {
    const groupRef = useRef();
    const timeRef = useRef(0);

    useFrame((_, delta) => {
        timeRef.current += delta;
    });

    const pins = useMemo(() => 
        AREA_PINS.map(pin => ({
            ...pin,
            position: latLonToVec3(pin.lat, pin.lon, globeRadius + 0.01),
        }))
    , [globeRadius]);

    return (
        <group ref={groupRef}>
            {pins.map((pin) => {
                const pulse = 1 + Math.sin(timeRef.current * 3 + pin.lat) * 0.3;
                return (
                    <group key={pin.name}>
                        {/* Core marker */}
                        <mesh position={pin.position}>
                            <sphereGeometry args={[0.03, 16, 16]} />
                            <meshBasicMaterial color={pin.color} />
                        </mesh>
                        {/* Pulse ring */}
                        <mesh position={pin.position} lookAt={[0, 0, 0]}>
                            <ringGeometry args={[0.04, 0.08, 32]} />
                            <meshBasicMaterial 
                                color={pin.color} 
                                transparent 
                                opacity={0.5} 
                                side={THREE.DoubleSide} 
                            />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
};
