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

    // 4. Vibrant Studio Lighting Setup
    // Strong bright ambient so nothing looks black/shadowy
    const ambientLight = new THREE.AmbientLight(0x94a3b8, 2.6);
    scene.add(ambientLight);

    // Bright front-top key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    // Warm golden front fill light
    const fillLight = new THREE.DirectionalLight(0xfef08a, 2.5);
    fillLight.position.set(-4, 5, 4);
    scene.add(fillLight);

    // Vibrant magenta-purple back rim light
    const rimLight = new THREE.DirectionalLight(0xc084fc, 4.5);
    rimLight.position.set(-3, 4, -4);
    scene.add(rimLight);

    // Cyan pedestal glow from beneath
    const underGlow = new THREE.PointLight(0x00f5ff, 4.0, 12);
    underGlow.position.set(0, -0.8, 0.5);
    scene.add(underGlow);

    // 5. Hero Root Group
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // === VIBRANT & STRIKING MATERIAL PALETTE ===
    // Gleaming Silver/Titanium Primary Armor
    const silverTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.18,
    });

    // Deep Electric Royal Blue secondary armor
    const cyberBlueMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      emissive: 0x1e40af,
      emissiveIntensity: 0.4,
      metalness: 0.7,
      roughness: 0.25,
    });

    // Golden Imperial Trims
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.2,
    });

    // High-Intensity Glowing Neon Cyan (Visor & Core)
    const neonCyanMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00f2ff,
      emissiveIntensity: 2.0,
      roughness: 0.1,
    });

    // Royal Purple Pauldrons
    const purpleMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.6,
      metalness: 0.6,
      roughness: 0.25,
    });

    // --- BODY CONSTRUCTION: CYBER KNIGHT ---

    // 1. Torso Base (Electric Blue)
    const torsoGeo = new THREE.BoxGeometry(0.85, 1.05, 0.52);
    const torsoMesh = new THREE.Mesh(torsoGeo, cyberBlueMat);
    torsoMesh.position.y = 1.05;
    heroGroup.add(torsoMesh);

    // Breastplate Armor (Polished Silver Titanium)
    const chestPlateGeo = new THREE.BoxGeometry(0.78, 0.55, 0.15);
    const chestPlate = new THREE.Mesh(chestPlateGeo, silverTitaniumMat);
    chestPlate.position.set(0, 1.22, 0.24);
    heroGroup.add(chestPlate);

    // Golden Chest Trim
    const chestTrimGeo = new THREE.BoxGeometry(0.82, 0.08, 0.18);
    const chestTrim = new THREE.Mesh(chestTrimGeo, goldTrimMat);
    chestTrim.position.set(0, 1.45, 0.25);
    heroGroup.add(chestTrim);

    // Glowing Arc Reactor Core (Neon Cyan)
    const coreGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 24);
    coreGeo.rotateX(Math.PI / 2);
    const coreMesh = new THREE.Mesh(coreGeo, neonCyanMat);
    coreMesh.position.set(0, 1.15, 0.3);
    heroGroup.add(coreMesh);

    // Abdomen Tech Belt (Gold & Titanium)
    const beltGeo = new THREE.BoxGeometry(0.88, 0.14, 0.56);
    const beltMesh = new THREE.Mesh(beltGeo, goldTrimMat);
    beltMesh.position.set(0, 0.58, 0);
    heroGroup.add(beltMesh);

    // 2. Helmet & Head
    // Base Helmet (Silver Titanium)
    const headGeo = new THREE.BoxGeometry(0.56, 0.58, 0.56);
    const headMesh = new THREE.Mesh(headGeo, silverTitaniumMat);
    headMesh.position.y = 1.88;
    heroGroup.add(headMesh);

    // Golden Crest / Fin on Top of Helmet
    const crestGeo = new THREE.BoxGeometry(0.1, 0.22, 0.62);
    const crestMesh = new THREE.Mesh(crestGeo, goldTrimMat);
    crestMesh.position.set(0, 2.22, 0);
    heroGroup.add(crestMesh);

    // Hyper-Bright Neon Cyber Visor
    const visorGeo = new THREE.BoxGeometry(0.5, 0.16, 0.22);
    const visorMesh = new THREE.Mesh(visorGeo, neonCyanMat);
    visorMesh.position.set(0, 1.88, 0.25);
    heroGroup.add(visorMesh);

    // Visor Golden Brow Accent
    const browGeo = new THREE.BoxGeometry(0.52, 0.06, 0.24);
    const browMesh = new THREE.Mesh(browGeo, goldTrimMat);
    browMesh.position.set(0, 2.0, 0.26);
    heroGroup.add(browMesh);

    // 3. Shoulders & Pauldrons (Royal Purple + Gold Trims)
    const shoulderGeo = new THREE.BoxGeometry(0.42, 0.42, 0.48);
    const leftShoulder = new THREE.Mesh(shoulderGeo, purpleMat);
    leftShoulder.position.set(-0.72, 1.44, 0);
    heroGroup.add(leftShoulder);

    const leftShoulderTrim = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.5), goldTrimMat);
    leftShoulderTrim.position.set(-0.72, 1.62, 0);
    heroGroup.add(leftShoulderTrim);

    const rightShoulder = new THREE.Mesh(shoulderGeo, purpleMat);
    rightShoulder.position.set(0.72, 1.44, 0);
    heroGroup.add(rightShoulder);

    const rightShoulderTrim = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.5), goldTrimMat);
    rightShoulderTrim.position.set(0.72, 1.62, 0);
    heroGroup.add(rightShoulderTrim);

    // 4. Arms (Silver Titanium with Cyan Cyber-Stripes)
    const armGeo = new THREE.BoxGeometry(0.26, 0.76, 0.28);
    const leftArm = new THREE.Mesh(armGeo, silverTitaniumMat);
    leftArm.position.set(-0.72, 0.88, 0);
    heroGroup.add(leftArm);

    // Left Arm Cyan Glow Stripe
    const leftStripe = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.3), neonCyanMat);
    leftStripe.position.set(-0.84, 0.88, 0);
    heroGroup.add(leftStripe);

    const rightArm = new THREE.Mesh(armGeo, silverTitaniumMat);
    rightArm.position.set(0.72, 0.88, 0);
    heroGroup.add(rightArm);

    // Right Arm Cyan Glow Stripe
    const rightStripe = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.3), neonCyanMat);
    rightStripe.position.set(0.84, 0.88, 0);
    heroGroup.add(rightStripe);

    // 5. Legs (Silver Titanium with Golden Knee Guards)
    const legGeo = new THREE.BoxGeometry(0.32, 0.98, 0.34);
    const leftLeg = new THREE.Mesh(legGeo, silverTitaniumMat);
    leftLeg.position.set(-0.26, 0.05, 0);
    heroGroup.add(leftLeg);

    const leftKnee = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.2, 0.14), goldTrimMat);
    leftKnee.position.set(-0.26, 0.15, 0.18);
    heroGroup.add(leftKnee);

    const rightLeg = new THREE.Mesh(legGeo, silverTitaniumMat);
    rightLeg.position.set(0.26, 0.05, 0);
    heroGroup.add(rightLeg);

    const rightKnee = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.2, 0.14), goldTrimMat);
    rightKnee.position.set(0.26, 0.15, 0.18);
    heroGroup.add(rightKnee);

    // --- Dynamic Equipment Meshes ---

    // 1. Weapon (Right Hand)
    if (hasWeapon) {
      const weaponBladeColor = isEpicWeapon ? 0xfbbf24 : 0x00f5ff;
      const bladeMat = new THREE.MeshStandardMaterial({
        color: weaponBladeColor,
        emissive: weaponBladeColor,
        emissiveIntensity: 2.2,
      });

      const hiltGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
      const hiltMesh = new THREE.Mesh(hiltGeo, goldTrimMat);
      hiltMesh.position.set(0.92, 0.52, 0.2);

      const guardGeo = new THREE.BoxGeometry(0.28, 0.08, 0.14);
      const guardMesh = new THREE.Mesh(guardGeo, silverTitaniumMat);
      guardMesh.position.set(0.92, 0.68, 0.2);

      const bladeGeo = new THREE.BoxGeometry(
        isEpicWeapon ? 0.18 : 0.1,
        1.5,
        0.05
      );
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      bladeMesh.position.set(0.92, 1.45, 0.2);

      heroGroup.add(hiltMesh);
      heroGroup.add(guardMesh);
      heroGroup.add(bladeMesh);
    }

    // 2. Shield (Left Arm)
    if (hasShield) {
      const shieldColor = isLegendaryShield ? 0xa855f7 : 0x06b6d4;
      const shieldMat = new THREE.MeshPhysicalMaterial({
        color: shieldColor,
        emissive: shieldColor,
        emissiveIntensity: 1.2,
        roughness: 0.1,
        transmission: 0.65,
        thickness: 0.25,
        transparent: true,
        opacity: 0.9,
      });

      const shieldGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 6);
      shieldGeo.rotateX(Math.PI / 2);
      shieldGeo.rotateY(Math.PI / 2);
      const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
      shieldMesh.position.set(-0.95, 0.95, 0.25);

      // Golden center emblem for shield
      const shieldCenterGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.14, 6);
      shieldCenterGeo.rotateX(Math.PI / 2);
      shieldCenterGeo.rotateY(Math.PI / 2);
      const shieldCenter = new THREE.Mesh(shieldCenterGeo, goldTrimMat);
      shieldCenter.position.set(-0.95, 0.95, 0.28);

      heroGroup.add(shieldMesh);
      heroGroup.add(shieldCenter);
    }

    // 3. Cyber Wings (Back)
    if (hasWings) {
      const wingColor = isArchangelWings ? 0xf59e0b : 0x00f5ff;
      const wingMat = new THREE.MeshStandardMaterial({
        color: wingColor,
        emissive: wingColor,
        emissiveIntensity: 1.8,
        roughness: 0.2,
        side: THREE.DoubleSide,
      });

      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0);
      wingShape.lineTo(1.4, 0.85);
      wingShape.lineTo(1.8, 0.3);
      wingShape.lineTo(1.1, -0.45);
      wingShape.closePath();

      const wingGeo = new THREE.ShapeGeometry(wingShape);

      const rightWing = new THREE.Mesh(wingGeo, wingMat);
      rightWing.position.set(0.35, 1.2, -0.32);
      rightWing.rotation.y = -0.35;
      heroGroup.add(rightWing);

      const leftWing = new THREE.Mesh(wingGeo, wingMat);
      leftWing.position.set(-0.35, 1.2, -0.32);
      leftWing.rotation.y = Math.PI + 0.35;
      heroGroup.add(leftWing);
    }

    // 4. Floating Crown / Halo
    if (hasCrown) {
      const crownMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xfbbf24,
        emissiveIntensity: 2.2,
      });
      const torusGeo = new THREE.TorusGeometry(0.38, 0.05, 16, 32);
      torusGeo.rotateX(Math.PI / 2);
      const crownMesh = new THREE.Mesh(torusGeo, crownMat);
      crownMesh.position.set(0, 2.4, 0);
      heroGroup.add(crownMesh);
    }

    // --- Floating Glowing Runes & Particles ---
    const particleCount = Math.min(70, 30 + level * 6);
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.1 + Math.random() * 1.3;
      particlePos[i] = Math.cos(angle) * radius;
      particlePos[i + 1] = Math.random() * 3.0 - 0.5;
      particlePos[i + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f5ff,
      size: 0.07,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Pedestal Hologram Platform (Glowing Cyan Rings) ---
    const ringGeo = new THREE.RingGeometry(0.9, 1.5, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      wireframe: true,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = -0.5;
    scene.add(ringMesh);

    // Inner glowing solid disc
    const innerDiscGeo = new THREE.CircleGeometry(0.85, 32);
    innerDiscGeo.rotateX(-Math.PI / 2);
    const innerDiscMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const innerDisc = new THREE.Mesh(innerDiscGeo, innerDiscMat);
    innerDisc.position.y = -0.51;
    scene.add(innerDisc);

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
        rotationYRef.current += 0.006;
      }
      heroGroup.rotation.y = rotationYRef.current;

      // Rotate particles and pedestal ring
      particles.rotation.y = elapsedTime * 0.15;
      ringMesh.rotation.z = -elapsedTime * 0.25;

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
    <div className="relative w-full h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-950/60">
      {/* Background Holographic Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f2ff20_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-70" />

      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating 3D Interaction Badge */}
      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300 flex items-center gap-2 backdrop-blur-md pointer-events-none shadow-lg shadow-cyan-950/40">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>360° Interactive 3D Model</span>
      </div>

      {/* Gear Indicators */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 pointer-events-none">
        {hasWeapon && (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20">
            ⚔️ WEAPON EQUIPPED
          </span>
        )}
        {hasShield && (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20">
            🛡️ SHIELD EQUIPPED
          </span>
        )}
        {hasWings && (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20">
            🪽 WINGS EQUIPPED
          </span>
        )}
        {hasCrown && (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 shadow-sm shadow-yellow-500/20">
            👑 CROWN EQUIPPED
          </span>
        )}
      </div>
    </div>
  );
};
