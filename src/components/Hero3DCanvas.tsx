"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Hero3DCanvasProps {
  level: number;
  equippedItems?: Array<{
    item: {
      category: string;
      visualKey: string;
      rarity: string;
    };
  }>;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ level, equippedItems = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseXRef = useRef(0);
  const rotationYRef = useRef(0);

  // Derive which gear slots are active
  const activeVisualKeys = new Set(
    equippedItems.map((entry) => entry.item.visualKey).filter(Boolean)
  );

  const hasWeapon =
    activeVisualKeys.has("cyber_katana") || activeVisualKeys.has("plasma_blade");
  const isEpicWeapon = activeVisualKeys.has("plasma_blade");

  const hasShield =
    activeVisualKeys.has("quantum_shield") || activeVisualKeys.has("void_aegis");
  const isLegendaryShield = activeVisualKeys.has("void_aegis");

  const hasWings =
    activeVisualKeys.has("cyber_wings") || activeVisualKeys.has("archangel_wings");
  const isArchangelWings = activeVisualKeys.has("archangel_wings");

  const hasCrown =
    activeVisualKeys.has("neural_crown") || activeVisualKeys.has("sovereign_crown");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 420;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.2);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x223355, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00f2ff, 3.5);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 3.0);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const underGlow = new THREE.PointLight(0x06b6d4, 2.5, 10);
    underGlow.position.set(0, -1, 0);
    scene.add(underGlow);

    // 5. Hero Root Group
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // Color Palette
    const armorDarkMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.3,
      metalness: 0.8,
    });
    const neonCyanMat = new THREE.MeshStandardMaterial({
      color: 0x00f5ff,
      emissive: 0x00d8f6,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.5,
    });
    const purpleMat = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.6,
    });

    // --- Body Construction ---
    // Torso
    const torsoGeo = new THREE.BoxGeometry(0.9, 1.1, 0.55);
    const torsoMesh = new THREE.Mesh(torsoGeo, armorDarkMat);
    torsoMesh.position.y = 1.05;
    heroGroup.add(torsoMesh);

    // Core Reactor / Chest Emblem
    const coreGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16);
    coreGeo.rotateX(Math.PI / 2);
    const coreMesh = new THREE.Mesh(coreGeo, neonCyanMat);
    coreMesh.position.set(0, 1.15, 0.26);
    heroGroup.add(coreMesh);

    // Head
    const headGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    const headMesh = new THREE.Mesh(headGeo, armorDarkMat);
    headMesh.position.y = 1.85;
    heroGroup.add(headMesh);

    // Cyber Visor
    const visorGeo = new THREE.BoxGeometry(0.48, 0.14, 0.25);
    const visorMesh = new THREE.Mesh(visorGeo, neonCyanMat);
    visorMesh.position.set(0, 1.88, 0.22);
    heroGroup.add(visorMesh);

    // Shoulders
    const shoulderGeo = new THREE.BoxGeometry(0.38, 0.38, 0.45);
    const leftShoulder = new THREE.Mesh(shoulderGeo, purpleMat);
    leftShoulder.position.set(-0.68, 1.42, 0);
    heroGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, purpleMat);
    rightShoulder.position.set(0.68, 1.42, 0);
    heroGroup.add(rightShoulder);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.24, 0.75, 0.26);
    const leftArm = new THREE.Mesh(armGeo, armorDarkMat);
    leftArm.position.set(-0.68, 0.88, 0);
    heroGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armorDarkMat);
    rightArm.position.set(0.68, 0.88, 0);
    heroGroup.add(rightArm);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.3, 0.95, 0.32);
    const leftLeg = new THREE.Mesh(legGeo, armorDarkMat);
    leftLeg.position.set(-0.25, 0.05, 0);
    heroGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorDarkMat);
    rightLeg.position.set(0.25, 0.05, 0);
    heroGroup.add(rightLeg);

    // --- Dynamic Equipment Meshes ---

    // 1. Weapon (Right Hand)
    if (hasWeapon) {
      const weaponBladeColor = isEpicWeapon ? 0xf59e0b : 0x00f5ff;
      const bladeMat = new THREE.MeshStandardMaterial({
        color: weaponBladeColor,
        emissive: weaponBladeColor,
        emissiveIntensity: 1.4,
      });

      const hiltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35);
      const hiltMesh = new THREE.Mesh(hiltGeo, armorDarkMat);
      hiltMesh.position.set(0.85, 0.55, 0.15);

      const bladeGeo = new THREE.BoxGeometry(
        isEpicWeapon ? 0.16 : 0.08,
        1.4,
        0.04
      );
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      bladeMesh.position.set(0.85, 1.25, 0.15);

      heroGroup.add(hiltMesh);
      heroGroup.add(bladeMesh);
    }

    // 2. Shield (Left Arm)
    if (hasShield) {
      const shieldColor = isLegendaryShield ? 0xa855f7 : 0x06b6d4;
      const shieldMat = new THREE.MeshPhysicalMaterial({
        color: shieldColor,
        emissive: shieldColor,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        transmission: 0.6,
        thickness: 0.2,
        transparent: true,
        opacity: 0.85,
      });

      const shieldGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.08, 6);
      shieldGeo.rotateX(Math.PI / 2);
      shieldGeo.rotateY(Math.PI / 2);
      const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
      shieldMesh.position.set(-0.88, 0.95, 0.2);
      heroGroup.add(shieldMesh);
    }

    // 3. Cyber Wings (Back)
    if (hasWings) {
      const wingColor = isArchangelWings ? 0xf59e0b : 0x06b6d4;
      const wingMat = new THREE.MeshStandardMaterial({
        color: wingColor,
        emissive: wingColor,
        emissiveIntensity: 1.2,
        roughness: 0.3,
        side: THREE.DoubleSide,
      });

      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0);
      wingShape.lineTo(1.2, 0.7);
      wingShape.lineTo(1.6, 0.2);
      wingShape.lineTo(0.9, -0.4);
      wingShape.closePath();

      const wingGeo = new THREE.ShapeGeometry(wingShape);

      const rightWing = new THREE.Mesh(wingGeo, wingMat);
      rightWing.position.set(0.3, 1.2, -0.32);
      rightWing.rotation.y = -0.3;
      heroGroup.add(rightWing);

      const leftWing = new THREE.Mesh(wingGeo, wingMat);
      leftWing.position.set(-0.3, 1.2, -0.32);
      leftWing.rotation.y = Math.PI + 0.3;
      heroGroup.add(leftWing);
    }

    // 4. Floating Crown / Halo
    if (hasCrown) {
      const crownMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xfbbf24,
        emissiveIntensity: 1.5,
      });
      const torusGeo = new THREE.TorusGeometry(0.36, 0.04, 16, 32);
      torusGeo.rotateX(Math.PI / 2);
      const crownMesh = new THREE.Mesh(torusGeo, crownMat);
      crownMesh.position.set(0, 2.32, 0);
      heroGroup.add(crownMesh);
    }

    // --- Floating Magical Runes & Particles ---
    const particleCount = Math.min(60, 25 + level * 5);
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.0 + Math.random() * 1.2;
      particlePos[i] = Math.cos(angle) * radius;
      particlePos[i + 1] = Math.random() * 2.8 - 0.5;
      particlePos[i + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f5ff,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Pedestal Hologram Platform ---
    const ringGeo = new THREE.RingGeometry(0.9, 1.4, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = -0.45;
    scene.add(ringMesh);

    // --- Interaction / Drag Rotation Handlers ---
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseXRef.current = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientX - prevMouseXRef.current;
      prevMouseXRef.current = e.clientX;
      rotationYRef.current += delta * 0.015;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Touch support for mobile accessibility
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseXRef.current = e.touches[0].clientX;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const delta = e.touches[0].clientX - prevMouseXRef.current;
      prevMouseXRef.current = e.touches[0].clientX;
      rotationYRef.current += delta * 0.015;
    };
    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };
    domEl.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    // --- Animation Loop ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth bobbing idle animation
      heroGroup.position.y = Math.sin(elapsedTime * 2) * 0.08;

      // Auto rotation if not dragging
      if (!isDraggingRef.current) {
        rotationYRef.current += 0.005;
      }
      heroGroup.rotation.y = rotationYRef.current;

      // Rotate particles and pedestal ring
      particles.rotation.y = elapsedTime * 0.15;
      ringMesh.rotation.z = -elapsedTime * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      domEl.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [level, hasWeapon, isEpicWeapon, hasShield, isLegendaryShield, hasWings, isArchangelWings, hasCrown]);

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-950 border border-cyan-500/20 shadow-2xl shadow-cyan-950/40">
      {/* Background Holographic Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f2ff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60" />

      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating 3D Interaction Badge */}
      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-[11px] font-mono text-cyan-400/90 flex items-center gap-1.5 backdrop-blur-md pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>Drag 3D Model to Inspect</span>
      </div>

      {/* Gear Indicators */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 pointer-events-none">
        {hasWeapon && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            ⚔️ WEAPON EQUIPPED
          </span>
        )}
        {hasShield && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            🛡️ SHIELD EQUIPPED
          </span>
        )}
        {hasWings && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            🪽 WINGS EQUIPPED
          </span>
        )}
        {hasCrown && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
            👑 CROWN EQUIPPED
          </span>
        )}
      </div>
    </div>
  );
};
