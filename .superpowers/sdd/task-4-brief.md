### Task 4: Hero 3D Score Orb

**Files:**
- Create: `src/components/hero/ScoreOrb.tsx`
- Create: `src/components/hero/ThreeScene.tsx`

- [ ] **Step 1: Create ThreeScene.tsx**

A wrapper that provides the Three.js Canvas with proper camera, lighting, and responsive sizing:

```tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

export function ThreeScene({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#D4A853" />
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Create ScoreOrb.tsx**

A 3D sphere with gold segments representing the audit score (34 by default). Segments light up in gold proportionally to the score. Slow auto-rotation, mouse-responsive.

```tsx
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
```

This is a simplified v1. We can enhance with per-segment coloring later.

- [ ] **Step 3: Commit**

---

