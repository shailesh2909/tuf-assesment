import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { useRef } from 'react';

// A single floating 3D "Node" (represents DSA concepts)
function FloatingNode({ position, color, speed, wireframe }) {
    const mesh = useRef();

    useFrame((state) => {
        mesh.current.rotation.x += speed * 0.01;
        mesh.current.rotation.y += speed * 0.01;
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh position={position} ref={mesh}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color={color}
                    wireframe={wireframe}
                    transparent
                    opacity={wireframe ? 0.3 : 0.8}
                />
            </mesh>
        </Float>
    );
}

export function TUFBackground3D() {
    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#f97316" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22c55e" />

                {/* Subtle Starfield */}
                <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

                {/* Floating DSA "Nodes" */}
                <FloatingNode position={[-8, 4, -5]} color="#f97316" speed={1.2} wireframe={true} />
                <FloatingNode position={[7, -5, -8]} color="#374151" speed={0.8} wireframe={false} />
                <FloatingNode position={[-6, -6, -4]} color="#f97316" speed={1.5} wireframe={false} />
                <FloatingNode position={[8, 5, -6]} color="#2a2a2a" speed={1.0} wireframe={true} />
                <FloatingNode position={[0, 8, -10]} color="#f97316" speed={0.5} wireframe={false} />
            </Canvas>
        </div>
    );
}