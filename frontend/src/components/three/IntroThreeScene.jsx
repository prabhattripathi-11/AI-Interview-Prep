import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, Box } from '@react-three/drei';
import * as THREE from 'three';

function DataNode({ position, color, size, speed }) {
    const mesh = useRef();
    const wire = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        mesh.current.rotation.x = mesh.current.rotation.y += 0.01 * speed;
        wire.current.rotation.x = wire.current.rotation.y -= 0.015 * speed;
        mesh.current.position.y += Math.sin(time + position[0]) * 0.001;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group position={position}>
                {/* Core Node */}
                <Box ref={mesh} args={[size, size, size]}>
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={2}
                        transparent
                        opacity={0.6}
                    />
                </Box>
                {/* Outer Tech Wireframe */}
                <Box ref={wire} args={[size * 1.5, size * 1.5, size * 1.5]}>
                    <meshStandardMaterial
                        color={color}
                        wireframe
                        transparent
                        opacity={0.3}
                    />
                </Box>
            </group>
        </Float>
    );
}

function NeuralParticles({ count = 500 }) {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 20;
            p[i * 3 + 1] = (Math.random() - 0.5) * 20;
            p[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return p;
    }, [count]);

    const ref = useRef();
    useFrame((state) => {
        ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    });

    return (
        <Points ref={ref} positions={points} stride={3}>
            <pointsMaterial
                transparent
                color="#ffffff"
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.4}
            />
        </Points>
    );
}

function Grid() {
    return (
        <gridHelper
            args={[40, 40, '#1e293b', '#0f172a']}
            position={[0, -5, 0]}
            rotation={[Math.PI / 2.5, 0, 0]}
        />
    );
}

export default function IntroThreeScene() {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.8 }}>
            <Canvas camera={{ position: [0, 0, 12], fov: 60 }} gl={{ alpha: true }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
                <pointLight position={[-10, -10, 10]} intensity={1.5} color="#06b6d4" />

                <NeuralParticles />
                <Grid />

                {/* Floating Data Modules */}
                <DataNode
                    position={[6, 3, 0]}
                    color="#8b5cf6"
                    size={1.2}
                    speed={1}
                />

                <DataNode
                    position={[-7, -2, -2]}
                    color="#06b6d4"
                    size={0.8}
                    speed={0.8}
                />

                <DataNode
                    position={[3, -4, 2]}
                    color="#f472b6"
                    size={0.5}
                    speed={1.5}
                />

                <DataNode
                    position={[-4, 4, -3]}
                    color="#a3e635"
                    size={0.6}
                    speed={1.2}
                />

                {/* Central Core (Behind Text) */}
                <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Sphere args={[2, 64, 64]} position={[0, 0, -5]}>
                        <MeshDistortMaterial
                            color="#1e1b4b"
                            distort={0.4}
                            speed={2}
                            roughness={0}
                            metalness={1}
                            transparent
                            opacity={0.2}
                        />
                    </Sphere>
                </Float>
            </Canvas>
        </div>
    );
}
