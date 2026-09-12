"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { sounds } from "@/lib/soundEffects";
import { Sparkles } from "lucide-react";

export interface HeroArchetype {
  id: string;
  name: string;
  badge: string;
  element: string;
  stats: string;
  colorHex: string;
  primaryColor: number;
  secondaryColor: number;
  trimColor: number;
  emissiveColor: number;
  meshType:
    | "spiderman"
    | "ironman"
    | "batman"
    | "knight"
    | "shinobi"
    | "paladin"
    | "voidwalker"
    | "chronomancer"
    | "berserker"
    | "ranger"
    | "ronin"
    | "valkyrie"
    | "alchemist"
    | "mechatitan"
    | "frostwarden";
}

export const HERO_ROSTER: HeroArchetype[] = [
  {
    id: "spiderman",
    name: "Spider-Man (Cyber Web-Slinger)",
    badge: "Marvel Icon",
    element: "Spider-Sense & Webbing",
    stats: "+25 Agility & Reflex",
    colorHex: "#ef4444",
    primaryColor: 0xd90429,      // Iconic Spider Crimson Red
    secondaryColor: 0x0077b6,    // Electric Cobalt Blue
    trimColor: 0x111827,         // Black Web Insignia & Outlines
    emissiveColor: 0xffffff,     // Glowing White Spider Lenses & Webbing
    meshType: "spiderman",
  },
  {
    id: "ironman",
    name: "Iron Vanguard (Iron Man)",
    badge: "Armored Avenger",
    element: "Arc Reactor Unibeam",
    stats: "+24 Intellect & Tech",
    colorHex: "#f59e0b",
    primaryColor: 0x991b1b,      // Hot-Rod Red
    secondaryColor: 0xd97706,    // Polished Gold Titanium
    trimColor: 0xfde047,         // Radiant Gold Trims
    emissiveColor: 0x00f2ff,     // Glowing Cyan Arc Reactor & Repulsors
    meshType: "ironman",
  },
  {
    id: "batman",
    name: "Dark Knight (Batman)",
    badge: "Shadow Vigilante",
    element: "Stealth & Discipline",
    stats: "+22 Spirit & Tactics",
    colorHex: "#facc15",
    primaryColor: 0x09090b,      // Tactical Carbon Black
    secondaryColor: 0x27272a,    // Kevlar Slate
    trimColor: 0xeab308,         // Gold Tech Utility Belt
    emissiveColor: 0xfef08a,     // White Slit Lenses & Emblem
    meshType: "batman",
  },
  {
    id: "cyber_knight",
    name: "Cyber Knight",
    badge: "Vanguard",
    element: "Plasma Blade",
    stats: "+15 Strength",
    colorHex: "#00f2ff",
    primaryColor: 0xe2e8f0,
    secondaryColor: 0x1d4ed8,
    trimColor: 0xf59e0b,
    emissiveColor: 0x00f2ff,
    meshType: "knight",
  },
  {
    id: "neon_shinobi",
    name: "Neon Shinobi",
    badge: "Shadow",
    element: "Stealth",
    stats: "+15 Agility",
    colorHex: "#10b981",
    primaryColor: 0x0f172a,
    secondaryColor: 0x064e3b,
    trimColor: 0x10b981,
    emissiveColor: 0x34d399,
    meshType: "shinobi",
  },
  {
    id: "solar_paladin",
    name: "Solar Paladin",
    badge: "Radiant",
    element: "Solar Ray",
    stats: "+16 Vitality",
    colorHex: "#f59e0b",
    primaryColor: 0xfef08a,
    secondaryColor: 0xd97706,
    trimColor: 0xffffff,
    emissiveColor: 0xfbbf24,
    meshType: "paladin",
  },
  {
    id: "void_walker",
    name: "Void Walker",
    badge: "Occult",
    element: "Entropy",
    stats: "+16 Spirit",
    colorHex: "#a855f7",
    primaryColor: 0x1e1b4b,
    secondaryColor: 0x581c87,
    trimColor: 0xa855f7,
    emissiveColor: 0xc084fc,
    meshType: "voidwalker",
  },
  {
    id: "arcane_chronomancer",
    name: "Chronomancer",
    badge: "Time Mage",
    element: "Temporal",
    stats: "+18 Intellect",
    colorHex: "#38bdf8",
    primaryColor: 0x0369a1,
    secondaryColor: 0x0284c7,
    trimColor: 0x38bdf8,
    emissiveColor: 0x7dd3fc,
    meshType: "chronomancer",
  },
  {
    id: "crimson_berserker",
    name: "Crimson Berserker",
    badge: "Juggernaut",
    element: "Fury",
    stats: "+18 Strength",
    colorHex: "#ef4444",
    primaryColor: 0x450a0a,
    secondaryColor: 0x991b1b,
    trimColor: 0xdc2626,
    emissiveColor: 0xf87171,
    meshType: "berserker",
  },
  {
    id: "phantom_ranger",
    name: "Phantom Ranger",
    badge: "Sniper",
    element: "Kinetic",
    stats: "+14 Agility",
    colorHex: "#059669",
    primaryColor: 0x064e3b,
    secondaryColor: 0x047857,
    trimColor: 0x6ee7b7,
    emissiveColor: 0x10b981,
    meshType: "ranger",
  },
  {
    id: "glitch_ronin",
    name: "Glitch Ronin",
    badge: "Cyber Samurai",
    element: "Neon Red",
    stats: "+16 Agility",
    colorHex: "#f43f5e",
    primaryColor: 0x18181b,
    secondaryColor: 0x881337,
    trimColor: 0xf43f5e,
    emissiveColor: 0xfb7185,
    meshType: "ronin",
  },
  {
    id: "storm_valkyrie",
    name: "Storm Valkyrie",
    badge: "Celestial",
    element: "Thunder",
    stats: "+15 Strength",
    colorHex: "#0ea5e9",
    primaryColor: 0xe0f2fe,
    secondaryColor: 0x0284c7,
    trimColor: 0x38bdf8,
    emissiveColor: 0x00f2ff,
    meshType: "valkyrie",
  },
  {
    id: "aether_alchemist",
    name: "Aether Alchemist",
    badge: "Tech Sage",
    element: "Alchemy",
    stats: "+16 Intellect",
    colorHex: "#eab308",
    primaryColor: 0x78350f,
    secondaryColor: 0xb45309,
    trimColor: 0xfde047,
    emissiveColor: 0xfacc15,
    meshType: "alchemist",
  },
  {
    id: "mecha_titan",
    name: "Mecha Titan",
    badge: "Colossus",
    element: "Heavy Steel",
    stats: "+22 Strength",
    colorHex: "#94a3b8",
    primaryColor: 0x334155,
    secondaryColor: 0x475569,
    trimColor: 0x94a3b8,
    emissiveColor: 0x38bdf8,
    meshType: "mechatitan",
  },
  {
    id: "frost_warden",
    name: "Frost Warden",
    badge: "Glacial",
    element: "Cryo Ice",
    stats: "+16 Vitality",
    colorHex: "#67e8f9",
    primaryColor: 0xcffafe,
    secondaryColor: 0x0891b2,
    trimColor: 0xa5f3fc,
    emissiveColor: 0x22d3ee,
    meshType: "frostwarden",
  },
];

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

  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const activeHero = HERO_ROSTER[selectedHeroIndex] || HERO_ROSTER[0];

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
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.25, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x94a3b8, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(activeHero.trimColor, 2.2);
    fillLight.position.set(-4, 5, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(activeHero.emissiveColor, 4.0);
    rimLight.position.set(-3, 4, -4);
    scene.add(rimLight);

    const underGlow = new THREE.PointLight(activeHero.emissiveColor, 4.5, 12);
    underGlow.position.set(0, -0.8, 0.5);
    scene.add(underGlow);

    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // Materials
    const primaryMat = new THREE.MeshStandardMaterial({
      color: activeHero.primaryColor,
      metalness: activeHero.meshType === "spiderman" || activeHero.meshType === "batman" ? 0.25 : 0.85,
      roughness: activeHero.meshType === "spiderman" ? 0.4 : 0.2,
    });

    const secondaryMat = new THREE.MeshStandardMaterial({
      color: activeHero.secondaryColor,
      emissive: activeHero.secondaryColor,
      emissiveIntensity: activeHero.meshType === "spiderman" ? 0.1 : 0.35,
      metalness: activeHero.meshType === "spiderman" ? 0.3 : 0.7,
      roughness: 0.3,
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: activeHero.trimColor,
      emissive: activeHero.trimColor,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.2,
    });

    const emissiveGlowMat = new THREE.MeshStandardMaterial({
      color: activeHero.emissiveColor,
      emissive: activeHero.emissiveColor,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });

    const isSpiderman = activeHero.meshType === "spiderman";
    const isIronman = activeHero.meshType === "ironman";
    const isBatman = activeHero.meshType === "batman";
    const isMecha = activeHero.meshType === "mechatitan";
    const isBerserker = activeHero.meshType === "berserker";

    const torsoScaleX = isMecha ? 1.15 : isBerserker ? 1.05 : 0.88;

    // --- TORSO CONSTRUCTION ---
    const torsoGeo = new THREE.BoxGeometry(torsoScaleX, 1.05, 0.52);
    const torsoMesh = new THREE.Mesh(torsoGeo, isSpiderman ? secondaryMat : secondaryMat);
    torsoMesh.position.y = 1.05;
    heroGroup.add(torsoMesh);

    // Breastplate / Vest
    const chestPlateGeo = new THREE.BoxGeometry(torsoScaleX * 0.9, 0.55, 0.16);
    const chestPlate = new THREE.Mesh(chestPlateGeo, primaryMat);
    chestPlate.position.set(0, 1.22, 0.24);
    heroGroup.add(chestPlate);

    if (isSpiderman) {
      // SPIDER-MAN: Iconic Black Spider Chest Emblem
      const spiderBody = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.05), trimMat);
      spiderBody.position.set(0, 1.22, 0.33);
      heroGroup.add(spiderBody);

      // Spider legs on chest
      const legLeft1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.04), trimMat);
      legLeft1.position.set(-0.12, 1.28, 0.33);
      legLeft1.rotation.z = 0.35;
      heroGroup.add(legLeft1);

      const legRight1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.04), trimMat);
      legRight1.position.set(0.12, 1.28, 0.33);
      legRight1.rotation.z = -0.35;
      heroGroup.add(legRight1);

      const legLeft2 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.04), trimMat);
      legLeft2.position.set(-0.12, 1.16, 0.33);
      legLeft2.rotation.z = -0.35;
      heroGroup.add(legLeft2);

      const legRight2 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.04), trimMat);
      legRight2.position.set(0.12, 1.16, 0.33);
      legRight2.rotation.z = 0.35;
      heroGroup.add(legRight2);

      // Blue side panels for classic red-and-blue suit
      const leftRib = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.54), secondaryMat);
      leftRib.position.set(-0.4, 1.05, 0);
      heroGroup.add(leftRib);

      const rightRib = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.54), secondaryMat);
      rightRib.position.set(0.4, 1.05, 0);
      heroGroup.add(rightRib);
    } else if (isIronman) {
      // IRON MAN: Glowing Cyan Unibeam Arc Reactor Core
      const arcRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.03, 16, 32),
        trimMat
      );
      arcRing.position.set(0, 1.22, 0.33);
      heroGroup.add(arcRing);

      const arcCore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.08, 24),
        emissiveGlowMat
      );
      arcCore.rotateX(Math.PI / 2);
      arcCore.position.set(0, 1.22, 0.33);
      heroGroup.add(arcCore);
    } else if (isBatman) {
      // BATMAN: Dark Bat Chest Emblem
      const batLogo = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.05), trimMat);
      batLogo.position.set(0, 1.25, 0.33);
      heroGroup.add(batLogo);

      // Golden Tech Utility Belt with compartments
      const utilityBelt = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.16, 0.58), trimMat);
      utilityBelt.position.set(0, 0.58, 0);
      heroGroup.add(utilityBelt);

      // Batman Flowing Scalloped Cape (Back)
      const capeGeo = new THREE.BoxGeometry(0.9, 1.4, 0.05);
      const capeMesh = new THREE.Mesh(capeGeo, primaryMat);
      capeMesh.position.set(0, 0.9, -0.3);
      heroGroup.add(capeMesh);
    } else {
      // Default Arc Core & Belt
      const coreGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 24);
      coreGeo.rotateX(Math.PI / 2);
      const coreMesh = new THREE.Mesh(coreGeo, emissiveGlowMat);
      coreMesh.position.set(0, 1.15, 0.3);
      heroGroup.add(coreMesh);

      const beltGeo = new THREE.BoxGeometry(torsoScaleX * 1.05, 0.14, 0.56);
      const beltMesh = new THREE.Mesh(beltGeo, trimMat);
      beltMesh.position.set(0, 0.58, 0);
      heroGroup.add(beltMesh);
    }

    // --- HEAD & MASK ARCHITECTURE ---
    const headGeo = new THREE.BoxGeometry(0.56, 0.58, 0.56);
    const headMesh = new THREE.Mesh(headGeo, primaryMat);
    headMesh.position.y = 1.88;
    heroGroup.add(headMesh);

    if (isSpiderman) {
      // SPIDER-MAN: Iconic Angular White Spider Lenses with Bold Black Borders
      // Left Eye Outer Black Border
      const leftEyeBorder = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.05), trimMat);
      leftEyeBorder.position.set(-0.14, 1.88, 0.28);
      leftEyeBorder.rotation.z = -0.22;
      heroGroup.add(leftEyeBorder);

      // Left Eye Glowing White Lens
      const leftLens = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.17, 0.06), emissiveGlowMat);
      leftLens.position.set(-0.14, 1.88, 0.29);
      leftLens.rotation.z = -0.22;
      heroGroup.add(leftLens);

      // Right Eye Outer Black Border
      const rightEyeBorder = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.05), trimMat);
      rightEyeBorder.position.set(0.14, 1.88, 0.28);
      rightEyeBorder.rotation.z = 0.22;
      heroGroup.add(rightEyeBorder);

      // Right Eye Glowing White Lens
      const rightLens = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.17, 0.06), emissiveGlowMat);
      rightLens.position.set(0.14, 1.88, 0.29);
      rightLens.rotation.z = 0.22;
      heroGroup.add(rightLens);
    } else if (isIronman) {
      // IRON MAN: Gold Faceplate & Glowing Slit Eyes
      const facePlate = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.44, 0.08), trimMat);
      facePlate.position.set(0, 1.84, 0.26);
      heroGroup.add(facePlate);

      const leftEyeSlit = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.1), emissiveGlowMat);
      leftEyeSlit.position.set(-0.11, 1.88, 0.3);
      heroGroup.add(leftEyeSlit);

      const rightEyeSlit = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.1), emissiveGlowMat);
      rightEyeSlit.position.set(0.11, 1.88, 0.3);
      heroGroup.add(rightEyeSlit);
    } else if (isBatman) {
      // BATMAN: Pointed Bat Ears & Glowing Slit Lenses
      const earGeo = new THREE.ConeGeometry(0.06, 0.35, 4);
      const leftEar = new THREE.Mesh(earGeo, primaryMat);
      leftEar.position.set(-0.24, 2.3, 0);
      heroGroup.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, primaryMat);
      rightEar.position.set(0.24, 2.3, 0);
      heroGroup.add(rightEar);

      const batVisor = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.08, 0.12), emissiveGlowMat);
      batVisor.position.set(0, 1.9, 0.26);
      heroGroup.add(batVisor);
    } else {
      // Default Cyber Visor
      const visorGeo = new THREE.BoxGeometry(0.5, 0.16, 0.22);
      const visorMesh = new THREE.Mesh(visorGeo, emissiveGlowMat);
      visorMesh.position.set(0, 1.88, 0.25);
      heroGroup.add(visorMesh);
    }

    // Other archetype head accessories
    if (activeHero.meshType === "knight" || activeHero.meshType === "paladin") {
      const crestMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.26, 0.62), trimMat);
      crestMesh.position.set(0, 2.24, 0);
      heroGroup.add(crestMesh);
    } else if (activeHero.meshType === "voidwalker" || activeHero.meshType === "berserker") {
      const hornGeo = new THREE.ConeGeometry(0.08, 0.45, 8);
      const leftHorn = new THREE.Mesh(hornGeo, emissiveGlowMat);
      leftHorn.position.set(-0.35, 2.3, 0);
      leftHorn.rotation.z = 0.4;
      heroGroup.add(leftHorn);

      const rightHorn = new THREE.Mesh(hornGeo, emissiveGlowMat);
      rightHorn.position.set(0.35, 2.3, 0);
      rightHorn.rotation.z = -0.4;
      heroGroup.add(rightHorn);
    } else if (activeHero.meshType === "ronin") {
      const kasaGeo = new THREE.ConeGeometry(0.75, 0.22, 16);
      const kasaMesh = new THREE.Mesh(kasaGeo, primaryMat);
      kasaMesh.position.set(0, 2.22, 0);
      heroGroup.add(kasaMesh);
    }

    // --- SHOULDERS & ARMS ---
    const shoulderScale = isMecha ? 0.58 : isSpiderman ? 0.36 : 0.44;
    const shoulderGeo = new THREE.BoxGeometry(shoulderScale, shoulderScale, shoulderScale);
    const leftShoulder = new THREE.Mesh(shoulderGeo, isSpiderman ? primaryMat : primaryMat);
    leftShoulder.position.set(-(torsoScaleX * 0.5 + 0.26), 1.44, 0);
    heroGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, isSpiderman ? primaryMat : primaryMat);
    rightShoulder.position.set(torsoScaleX * 0.5 + 0.26, 1.44, 0);
    heroGroup.add(rightShoulder);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.26, 0.76, 0.28);
    const leftArm = new THREE.Mesh(armGeo, isSpiderman ? secondaryMat : primaryMat);
    leftArm.position.set(-(torsoScaleX * 0.5 + 0.26), 0.88, 0);
    heroGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, isSpiderman ? secondaryMat : primaryMat);
    rightArm.position.set(torsoScaleX * 0.5 + 0.26, 0.88, 0);
    heroGroup.add(rightArm);

    if (isSpiderman) {
      // SPIDER-MAN: Red Forearm Gauntlets & Wrist Web-Shooters
      const leftGauntlet = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.38, 0.3), primaryMat);
      leftGauntlet.position.set(-(torsoScaleX * 0.5 + 0.26), 0.72, 0);
      heroGroup.add(leftGauntlet);

      const rightGauntlet = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.38, 0.3), primaryMat);
      rightGauntlet.position.set(torsoScaleX * 0.5 + 0.26, 0.72, 0);
      heroGroup.add(rightGauntlet);

      // Silver Web-Shooter Nozzles on Wrists
      const leftWebShooter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12),
        emissiveGlowMat
      );
      leftWebShooter.rotateX(Math.PI / 2);
      leftWebShooter.position.set(-(torsoScaleX * 0.5 + 0.26), 0.6, 0.16);
      heroGroup.add(leftWebShooter);

      const rightWebShooter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12),
        emissiveGlowMat
      );
      rightWebShooter.rotateX(Math.PI / 2);
      rightWebShooter.position.set(torsoScaleX * 0.5 + 0.26, 0.6, 0.16);
      heroGroup.add(rightWebShooter);
    } else if (isIronman) {
      // Palm Repulsor Node
      const leftRepulsor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16),
        emissiveGlowMat
      );
      leftRepulsor.rotateX(Math.PI / 2);
      leftRepulsor.position.set(-(torsoScaleX * 0.5 + 0.26), 0.56, 0.15);
      heroGroup.add(leftRepulsor);

      const rightRepulsor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16),
        emissiveGlowMat
      );
      rightRepulsor.rotateX(Math.PI / 2);
      rightWebShooter: rightRepulsor.position.set(torsoScaleX * 0.5 + 0.26, 0.56, 0.15);
      heroGroup.add(rightRepulsor);
    }

    // --- LEGS ---
    const legGeo = new THREE.BoxGeometry(0.32, 0.98, 0.34);
    const leftLeg = new THREE.Mesh(legGeo, isSpiderman ? secondaryMat : primaryMat);
    leftLeg.position.set(-0.26, 0.05, 0);
    heroGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, isSpiderman ? secondaryMat : primaryMat);
    rightLeg.position.set(0.26, 0.05, 0);
    heroGroup.add(rightLeg);

    if (isSpiderman) {
      // Red Spider Boots
      const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.44, 0.36), primaryMat);
      leftBoot.position.set(-0.26, -0.22, 0.02);
      heroGroup.add(leftBoot);

      const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.44, 0.36), primaryMat);
      rightBoot.position.set(0.26, -0.22, 0.02);
      heroGroup.add(rightBoot);
    }

    // --- DYNAMIC EQUIPMENT ---
    if (hasWeapon) {
      const weaponBladeColor = isEpicWeapon ? 0xfbbf24 : activeHero.emissiveColor;
      const bladeMat = new THREE.MeshStandardMaterial({
        color: weaponBladeColor,
        emissive: weaponBladeColor,
        emissiveIntensity: 2.2,
      });

      const hiltMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4), trimMat);
      hiltMesh.position.set(torsoScaleX * 0.5 + 0.55, 0.52, 0.2);

      const bladeMesh = new THREE.Mesh(
        new THREE.BoxGeometry(isEpicWeapon ? 0.18 : 0.1, 1.5, 0.05),
        bladeMat
      );
      bladeMesh.position.set(torsoScaleX * 0.5 + 0.55, 1.45, 0.2);

      heroGroup.add(hiltMesh);
      heroGroup.add(bladeMesh);
    }

    if (hasShield) {
      const shieldColor = isLegendaryShield ? 0xa855f7 : activeHero.emissiveColor;
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
      shieldMesh.position.set(-(torsoScaleX * 0.5 + 0.55), 0.95, 0.25);
      heroGroup.add(shieldMesh);
    }

    if (hasWings || activeHero.meshType === "valkyrie") {
      const wingColor = isArchangelWings ? 0xf59e0b : activeHero.emissiveColor;
      const wingMat = new THREE.MeshStandardMaterial({
        color: wingColor,
        emissive: wingColor,
        emissiveIntensity: 2.0,
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

    // --- Floating Web / Particle Systems ---
    const particleCount = Math.min(80, 35 + level * 6);
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
      color: activeHero.emissiveColor,
      size: isSpiderman ? 0.05 : 0.07,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Pedestal Platform ---
    const ringGeo = new THREE.RingGeometry(0.9, 1.5, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: activeHero.emissiveColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
      wireframe: true,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = -0.5;
    scene.add(ringMesh);

    // Mouse Drag Rotation
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

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      heroGroup.position.y = Math.sin(elapsedTime * 2) * 0.08;

      if (!isDraggingRef.current) {
        rotationYRef.current += 0.007;
      }
      heroGroup.rotation.y = rotationYRef.current;

      particles.rotation.y = elapsedTime * 0.15;
      ringMesh.rotation.z = -elapsedTime * 0.25;

      renderer.render(scene, camera);
    };

    animate();

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
  }, [selectedHeroIndex, activeHero, level, hasWeapon, isEpicWeapon, hasShield, isLegendaryShield, hasWings, isArchangelWings, hasCrown]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 3D WebGL Canvas Card */}
      <div className="relative w-full h-[380px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-950/60">
        <div className="absolute inset-0 bg-[radial-gradient(#00f2ff20_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-70" />

        {/* 3D WebGL Canvas */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Active Hero Title Overlay */}
        <div className="absolute top-3 left-3 flex flex-col pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-[10px] font-mono font-bold text-slate-300 w-fit">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: activeHero.colorHex }}
            />
            <span>{activeHero.badge}</span>
          </div>
          <span className="text-sm font-black font-mono text-white mt-0.5 drop-shadow-md">
            {activeHero.name}
          </span>
          <span
            className="text-[10px] font-mono font-bold"
            style={{ color: activeHero.colorHex }}
          >
            {activeHero.stats}
          </span>
        </div>

        {/* Floating 3D Drag Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-2 backdrop-blur-md pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Drag 360° to Inspect</span>
        </div>

        {/* Gear Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 pointer-events-none">
          {hasWeapon && (
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
              ⚔️ WEAPON
            </span>
          )}
          {hasShield && (
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              🛡️ SHIELD
            </span>
          )}
          {hasWings && (
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
              🪽 WINGS
            </span>
          )}
        </div>
      </div>

      {/* HEROES SELECTION CAROUSEL */}
      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-black tracking-wider text-slate-200 uppercase">
              SELECT HERO ({selectedHeroIndex + 1}/{HERO_ROSTER.length})
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold">
            Tap hero to equip in 3D
          </span>
        </div>

        {/* Horizontal Scrollable Hero Cards */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 pr-2 scrollbar-thin">
          {HERO_ROSTER.map((hero, idx) => {
            const isSelected = selectedHeroIndex === idx;
            return (
              <button
                key={hero.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedHeroIndex(idx);
                }}
                className={`flex-shrink-0 flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-slate-800 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105"
                    : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
                style={{ width: "135px" }}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: hero.colorHex }}
                  />
                  <span className="text-[9px] font-mono text-slate-400">
                    #{idx + 1}
                  </span>
                </div>
                <span className="text-xs font-black font-mono text-white truncate w-full">
                  {hero.name}
                </span>
                <span className="text-[9px] font-mono text-slate-400 truncate">
                  {hero.badge}
                </span>
                <span
                  className="text-[9px] font-mono font-bold mt-1"
                  style={{ color: hero.colorHex }}
                >
                  {hero.stats}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
