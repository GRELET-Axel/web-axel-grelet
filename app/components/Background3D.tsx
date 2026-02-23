"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function RotatingModel() {
  const fbx = useFBX("/model.fbx");
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.02;
  });

  return <primitive ref={ref} object={fbx} scale={1} />;
}

export default function Background3D() {
  return (
    <div style={{
      position: "fixed",
      top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      width: "100vw", height: "100vh",
      zIndex: -1,
      pointerEvents: "none",
    }}>
      <Canvas camera={{ position: [0, 0, 300], fov: 75 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <RotatingModel />
      </Canvas>
    </div>
  );
}