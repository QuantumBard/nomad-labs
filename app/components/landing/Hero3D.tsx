"use client";

import React, { useRef, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  PerspectiveCamera,
  Float,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Placeholder for the "Floating Luxury Villa"
const VillaModel = (props: any) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating rotation
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={meshRef} {...props}>
      {/* Abstract Modern Villa Shape */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Gold Accents */}
      <mesh position={[0, 0.5, 1.55]}>
        <boxGeometry args={[2.5, 0.5, 0.1]} />
        <meshStandardMaterial color="#C5A059" roughness={0.1} metalness={1} />
      </mesh>

      <mesh position={[1.2, -0.5, 1.2]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#C5A059" roughness={0.1} metalness={1} />
      </mesh>
    </group>
  );
};

const Scene = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useLayoutEffect(() => {
    // We can hook GSAP to the camera here if needed,
    // but the main scroll trigger logic is on the DOM section
  }, []);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 1, 6]}
        fov={50}
        ref={cameraRef}
      />
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={10}
        color="#C5A059"
      />

      <Float
        speed={1.5}
        rotationIntensity={0.5}
        floatIntensity={0.5}
        floatingRange={[-0.2, 0.2]}
      >
        <VillaModel />
      </Float>

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.5}
        scale={10}
        blur={2.5}
        far={4}
        color="#000000"
      />
      <Environment preset="city" />
    </>
  );
};

const Hero3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Entrance Animation
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5,
      });

      // Scroll interaction hints
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 100, // Parallax effect
        opacity: 0,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-[#0D0D0D] overflow-hidden flex items-center justify-center"
    >
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div
        ref={textRef}
        className="relative z-10 text-center pointer-events-none"
      >
        <h1 className="font-serif text-5xl md:text-8xl text-white mb-6 tracking-tight">
          Book Your <span className="text-[#C5A059] italic">Comfort</span>
        </h1>
        <div className="flex gap-4 justify-center mt-8 pointer-events-auto">
          <button className="px-8 py-3 bg-[#C5A059] text-black font-semibold rounded-full hover:bg-white transition-colors duration-300">
            Search Rooms
          </button>
          <button className="px-8 py-3 border border-white/20 text-white rounded-full hover:bg-white/10 backdrop-blur-sm transition-colors duration-300">
            Host Dashboard
          </button>
        </div>
      </div>

      {/* Gradient Overlay for blending */}
      <div className="absolute active pointer-events-none inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80" />
    </section>
  );
};

export default Hero3D;
