import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, Text, Stars, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const TECH_STACK = [
    { name: 'JavaScript', color: '#f7df1e', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg' },
    { name: 'React', color: '#61dafb', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg' },
    { name: 'Python', color: '#3776ab', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg' },
    { name: 'Node.js', color: '#339933', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg' },
    { name: 'C++', color: '#00599c', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg' },
    { name: 'Java', color: '#ed8b00', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg' },
    { name: 'Rust', color: '#e27151', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/rust/rust-original.svg' },
    { name: 'Go', color: '#00add8', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg' },
    { name: 'HTML5', color: '#e34f26', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg' },
    { name: 'CSS3', color: '#1572b6', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg' },
    { name: 'MySQL', color: '#4479a1', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg' },
    { name: 'TypeScript', color: '#3178c6', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg' }
];

const SYNTAX_FRAGS = ['{ }', '< >', '=>', 'fn()', 'const', 'git push', '++', 'class', 'import', 'export', 'await', 'async', 'try/catch'];

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
            fontSize={0.4}
            color={color}
            opacity={0.3}
            transparent
        >
            {text}
        </Text>
    );
}

function FloatingTechLogo({ icon, color, position, mouse }) {
    const groupRef = useRef();
    const meshRef = useRef();
    const texture = useLoader(THREE.TextureLoader, icon);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (groupRef.current) {
            const targetX = (mouse.current[0] * state.viewport.width) / 10;
            const targetY = (mouse.current[1] * state.viewport.height) / 10;
            const wave = Math.sin(time * 0.5 + position[0]) * 0.3;

            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, position[0] + targetX, 0.04);
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1] + targetY + wave, 0.04);
        }

        if (meshRef.current) {
            meshRef.current.rotation.y = time * 0.4;
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
                {/* Bigger Logo Plane */}
                <mesh ref={meshRef}>
                    <planeGeometry args={[2.2, 2.2]} />
                    <meshBasicMaterial
                        map={texture}
                        transparent
                        opacity={0.95}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Liquid Neon Glowing Outer Ring */}
                <mesh>
                    <ringGeometry args={[1.5, 1.6, 64]} />
                    <MeshWobbleMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={6}
                        transparent
                        opacity={0.6}
                        speed={2}
                        factor={0.4}
                        wireframe
                    />
                </mesh>

                {/* Secondary thick glow ring */}
                <mesh>
                    <ringGeometry args={[1.55, 1.58, 64]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={10}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            </Float>
        </group>
    );
}

function TechIconField({ mouse }) {
    const items = useMemo(() => {
        return TECH_STACK.map((tech, i) => ({
            ...tech,
            position: [
                (Math.random() - 0.5) * 45,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 15 - 5
            ]
        }));
    }, []);

    const syntaxItems = useMemo(() => {
        return Array.from({ length: 15 }).map((_, i) => ({
            text: SYNTAX_FRAGS[i % SYNTAX_FRAGS.length],
            position: [
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 25
            ],
            color: items[i % items.length].color
        }));
    }, [items]);

    return (
        <group>
            {items.map((item, i) => (
                <FloatingTechLogo key={i} {...item} mouse={mouse} />
            ))}
            {syntaxItems.map((item, i) => (
                <FloatingSyntax key={i} {...item} />
            ))}
        </group>
    );
}

export default function AuthThreeScene() {
    const mouse = useRef([0, 0]);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 0
            }}
            onMouseMove={(e) => {
                mouse.current = [
                    (e.clientX / window.innerWidth) * 2 - 1,
                    -(e.clientY / window.innerHeight) * 2 + 1
                ];
            }}
        >
            <Canvas camera={{ position: [0, 0, 25], fov: 55 }} gl={{ alpha: true }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={5} color="#8b5cf6" />
                <pointLight position={[-10, -10, -10]} intensity={4} color="#06b6d4" />
                <spotLight position={[0, 25, 0]} angle={0.8} penumbra={1} intensity={4} color="#f472b6" />

                <Stars radius={180} depth={100} count={5000} factor={6} saturation={0} fade speed={1.5} />
                <TechIconField mouse={mouse} />

                <fog attach="fog" args={['#010208', 20, 50]} />
            </Canvas>
        </div>
    );
}
