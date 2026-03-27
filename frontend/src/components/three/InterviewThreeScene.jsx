import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, Text, Stars, MeshWobbleMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const TECH_STACK = [
    { name: 'JavaScript', color: '#f7df1e', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg' },
    { name: 'React', color: '#61dafb', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg' },
    { name: 'Python', color: '#3776ab', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg' },
    { name: 'Node.js', color: '#339933', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg' },
    { name: 'C++', color: '#00599c', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg' },
    { name: 'TypeScript', color: '#3178c6', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg' }
];

const INTERVIEW_KEYS = ['COMMUNICATION', 'SYSTEM DESIGN', 'CULTURE FIT', 'BEHAVIORAL', 'SOLVING', '=> fn()', '{ auth }'];

function FloatingKey({ text, position, color }) {
    const ref = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        ref.current.position.y = position[1] + Math.sin(time * 0.4 + position[0]) * 1.5;
        ref.current.rotation.y = Math.sin(time * 0.2) * 0.4;
    });

    return (
        <Text
            ref={ref}
            position={position}
            fontSize={0.6}
            color={color}
            opacity={0.2}
            transparent
            font="https://fonts.gstatic.com/s/outfit/v11/Q_399S_X9dyat8Gmm9S-Q7SsmDeZ107p.woff"
        >
            {text}
        </Text>
    );
}

function FloatingLogo({ icon, color, position, mouse }) {
    const groupRef = useRef();
    const meshRef = useRef();
    const texture = useLoader(THREE.TextureLoader, icon);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (groupRef.current) {
            const targetX = (mouse.current[0] * state.viewport.width) / 12;
            const targetY = (mouse.current[1] * state.viewport.height) / 12;
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, position[0] + targetX, 0.04);
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1] + targetY, 0.04);
        }
        if (meshRef.current) {
            meshRef.current.rotation.y = time * 0.6;
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
                <mesh ref={meshRef}>
                    <planeGeometry args={[2.5, 2.5]} />
                    <meshBasicMaterial map={texture} transparent opacity={0.9} side={THREE.DoubleSide} />
                </mesh>
                <mesh>
                    <ringGeometry args={[1.6, 1.7, 64]} />
                    <MeshWobbleMaterial color={color} emissive={color} emissiveIntensity={5} transparent opacity={0.5} speed={2} factor={0.4} />
                </mesh>
            </Float>
        </group>
    );
}

function SceneContent({ mouse }) {
    const logos = useMemo(() => {
        return TECH_STACK.map((tech, i) => ({
            ...tech,
            position: [
                (Math.random() - 0.5) * 45,
                (Math.random() - 0.5) * 35,
                (Math.random() - 0.5) * 10 - 5
            ]
        }));
    }, []);

    const keys = useMemo(() => {
        return Array.from({ length: 10 }).map((_, i) => ({
            text: INTERVIEW_KEYS[i % INTERVIEW_KEYS.length],
            position: [
                (Math.random() - 0.5) * 55,
                (Math.random() - 0.5) * 45,
                (Math.random() - 0.5) * 15
            ],
            color: logos[i % logos.length]?.color || '#8b5cf6'
        }));
    }, [logos]);

    return (
        <group>
            <Stars radius={150} depth={50} count={4000} factor={6} saturation={0} fade speed={1.5} />
            {logos.map((logo, i) => (
                <FloatingLogo key={i} {...logo} mouse={mouse} />
            ))}
            {keys.map((item, i) => (
                <FloatingKey key={i} {...item} />
            ))}
            <fog attach="fog" args={['#010208', 25, 80]} />
        </group>
    );
}

export default function InterviewThreeScene() {
    const mouse = useRef([0, 0]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 0,
            background: 'radial-gradient(circle at 50% 50%, #020617 0%, #000 100%)'
        }}
            onMouseMove={(e) => {
                mouse.current = [
                    (e.clientX / window.innerWidth) * 2 - 1,
                    -(e.clientY / window.innerHeight) * 2 + 1
                ];
            }}>
            <Canvas camera={{ position: [0, 0, 35], fov: 50 }}>
                <ambientLight intensity={0.7} />
                <pointLight position={[20, 20, 20]} intensity={3} color="#8b5cf6" />
                <pointLight position={[-20, -20, -20]} intensity={2} color="#06b6d4" />
                <SceneContent mouse={mouse} />
            </Canvas>
        </div>
    );
}
