"use client";
import { useRef } from "react";
import { Mesh, SphereGeometry } from "three";
import { useFrame } from "@react-three/fiber";

const TOTAL_SEGMENTS = 20;
const SCORE = 34;
const ACTIVE_SEGMENTS = Math.round((SCORE / 100) * TOTAL_SEGMENTS);

export function ScoreOrb() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial
        color="#D4A853"
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}
