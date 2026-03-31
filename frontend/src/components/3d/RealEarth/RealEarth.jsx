import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Indore area coordinates with display info
const AREA_PINS = [
    { name: 'Vijay Nagar',      lat: 22.7533, lon: 75.8937, color: '#ef4444', pulseColor: '#f87171', scale: 1.2 },
    { name: 'Sarafa',           lat: 22.7196, lon: 75.8577, color: '#eab308', pulseColor: '#facc15', scale: 1.0 },
    { name: 'Palasia',          lat: 22.7230, lon: 75.8760, color: '#3b82f6', pulseColor: '#60a5fa', scale: 0.9 },
    { name: 'AB Road',          lat: 22.6950, lon: 75.8700, color: '#f97316', pulseColor: '#fb923c', scale: 0.9 },
    { name: 'Rajwada',          lat: 22.7186, lon: 75.8567, color: '#a855f7', pulseColor: '#c084fc', scale: 0.85 },
    { name: 'Sapna Sangeeta',   lat: 22.7250, lon: 75.8810, color: '#14b8a6', pulseColor: '#2dd4bf', scale: 0.85 },
    { name: 'Super Corridor',   lat: 22.6700, lon: 75.8400, color: '#06b6d4', pulseColor: '#22d3ee', scale: 0.8 },
    { name: 'Bhawarkuan',       lat: 22.7412, lon: 75.8698, color: '#ec4899', pulseColor: '#f472b6', scale: 0.8 },
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

const AreaPin = ({ pin, globeRadius, time }) => {
    const pos = useMemo(() => latLonToVec3(pin.lat, pin.lon, globeRadius + 0.01), [pin, globeRadius]);
    const outerPos = useMemo(() => latLonToVec3(pin.lat, pin.lon, globeRadius + 0.005), [pin, globeRadius]);
    const pulseScale = 1 + Math.sin(time * 3) * 0.3;

    return (
        <group>
            {/* Core dot */}
            <mesh position={pos}>
                <sphereGeometry args={[0.025 * pin.scale, 16, 16]} />
                <meshBasicMaterial color={pin.color} />
            </mesh>
            {/* Pulsing ring */}
            <mesh position={outerPos} scale={[pulseScale, pulseScale, 1]} lookAt={[0, 0, 0]}>
                <ringGeometry args={[0.03 * pin.scale, 0.06 * pin.scale, 32]} />
                <meshBasicMaterial color={pin.pulseColor} transparent opacity={0.6 - pulseScale * 0.15} side={THREE.DoubleSide} />
            </mesh>
            {/* Outer glow */}
            <mesh position={outerPos} scale={[pulseScale * 1.3, pulseScale * 1.3, 1]} lookAt={[0, 0, 0]}>
                <ringGeometry args={[0.06 * pin.scale, 0.12 * pin.scale, 32]} />
                <meshBasicMaterial color={pin.color} transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

export const RealEarth = () => {
    const groupRef = useRef();
    const timeRef = useRef(0);

    const earthTexture = useTexture('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');

    useFrame((state, delta) => {
        groupRef.current.rotation.y += delta * 0.08;
        timeRef.current += delta;
    });

    return (
        <group ref={groupRef}>
            <ambientLight intensity={1.0} />
            <directionalLight position={[5, 3, 5]} intensity={2.2} />
            <pointLight position={[-5, -3, -5]} intensity={0.5} color="#06b6d4" />

            {/* Earth Sphere */}
            <Sphere args={[1.5, 64, 64]}>
                <meshStandardMaterial
                    map={earthTexture}
                    roughness={0.55}
                    metalness={0.1}
                />
            </Sphere>

            {/* Atmosphere glow */}
            <Sphere args={[1.54, 64, 64]}>
                <meshBasicMaterial color="#06b6d4" transparent opacity={0.05} side={THREE.BackSide} />
            </Sphere>

            {/* Area Pins */}
            {AREA_PINS.map((pin) => (
                <AreaPin 
                    key={pin.name} 
                    pin={pin} 
                    globeRadius={1.5} 
                    time={timeRef.current}
                />
            ))}
        </group>
    );
};

export { AREA_PINS };
