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
    { name: 'Java', color: '#ed8b00', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg' },
    { name: 'TypeScript', color: '#3178c6', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg' },
    { name: 'Go', color: '#00add8', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg' }
];

const SYNTAX_FRAGS = ['{ }', '< >', '=>', 'fn()', 'const', 'git push', '++', 'await', 'async', 'try/catch'];

function FloatingSyntax({ text, position, color }) {
    const ref = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        ref.current.position.y = position[1] + Math.sin(time * 0.5 + position[0]) * 1.5;
        ref.current.rotation.z = Math.sin(time * 0.3) * 0.5;
    });

    return (
        <Text
            ref={ref}
            position={position}
            fontSize={0.5}
            color={color}
            opacity={0.2}
            transparent
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
            const targetX = (mouse.current[0] * state.viewport.width) / 15;
            const targetY = (mouse.current[1] * state.viewport.height) / 15;
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, position[0] + targetX, 0.05);
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1] + targetY, 0.05);
        }
        if (meshRef.current) {
            meshRef.current.rotation.y = time * 0.5;
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh ref={meshRef}>
                    <planeGeometry args={[2, 2]} />
                    <meshBasicMaterial map={texture} transparent opacity={0.8} side={THREE.DoubleSide} />
                </mesh>
                <mesh>
                    <ringGeometry args={[1.3, 1.4, 64]} />
                    <MeshWobbleMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.4} speed={2} factor={0.3} />
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
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 10 - 5
            ]
        }));
    }, []);

    const syntax = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => ({
            text: SYNTAX_FRAGS[i % SYNTAX_FRAGS.length],
            position: [
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 15
            ],
            color: logos[i % logos.length].color
        }));
    }, [logos]);

    return (
        <group>
            <Stars radius={150} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
            {logos.map((logo, i) => (
                <FloatingLogo key={i} {...logo} mouse={mouse} />
            ))}
            {syntax.map((item, i) => (
                <FloatingSyntax key={i} {...item} />
            ))}
            <fog attach="fog" args={['#010208', 20, 70]} />
        </group>
    );
}

export default function QuizThreeScene() {
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
            background: 'radial-gradient(circle at 50% 50%, #030712 0%, #000 100%)'
        }}
            onMouseMove={(e) => {
                mouse.current = [
                    (e.clientX / window.innerWidth) * 2 - 1,
                    -(e.clientY / window.innerHeight) * 2 + 1
                ];
            }}>
            <Canvas camera={{ position: [0, 0, 30], fov: 55 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#8b5cf6" />
                <pointLight position={[-10, -10, -10]} intensity={2} color="#06b6d4" />
                <SceneContent mouse={mouse} />
            </Canvas>
        </div>
    );
}
