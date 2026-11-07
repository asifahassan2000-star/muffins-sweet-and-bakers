import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, RotateCcw, Eye, ShoppingBag, Check, 
  Flame, Award, Heart, Info, ArrowUpRight, Compass
} from 'lucide-react';
import { MenuItem } from '../types';

interface Interactive3DMuffinShowcaseProps {
  onAddToCart?: (item: MenuItem, selectedSize?: any, e?: React.MouseEvent) => void;
  onNavigate?: (view: any) => void;
}

// 4 Signature Glaze options using the requested palette
interface GlazeOption {
  id: string;
  name: string;
  hex: string;
  tagline: string;
  notes: string;
}

const GLAZE_OPTIONS: GlazeOption[] = [
  {
    id: 'amber_honey',
    name: 'Warm Amber Honey',
    hex: '#F4B34D',
    tagline: 'Pure Wildflower Blossom Nectar',
    notes: 'Slow-simmered raw hill honey infused with crushed green cardamom pods.'
  },
  {
    id: 'burnt_orange',
    name: 'Burnt Orange Ganache',
    hex: '#E94F16',
    tagline: 'Citrus Zest & Caramel Crunch',
    notes: 'Charred blood orange reduction blended into velvety white cocoa butter.'
  },
  {
    id: 'pistachio_glaze',
    name: 'Royal Pistachio Praline',
    hex: '#7BA05B',
    tagline: 'Slow-Stone Milled Kerman Pistachio',
    notes: 'Pure roasted pistachio butter whipped with cardamom syrup and white cocoa butter.'
  },
  {
    id: 'dark_chocolate',
    name: 'Valrhona Dark Cocoa',
    hex: '#32140D',
    tagline: '70% Belgian Roast Ganache',
    notes: 'Single-origin equatorial cocoa beans melted with French double cream.'
  },
  {
    id: 'tangerine_glaze',
    name: 'Tangerine Sugar Frost',
    hex: '#FF792B',
    tagline: 'Crisp Sun-Ripened Glaze',
    notes: 'Milled crystalline sugar brushed with fresh cold-pressed tangerine juice.'
  }
];

// Interactive hotspot markers on the 3D model
interface HotspotInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  position: { x: number; y: number }; // Percentage position on overlay
}

const HOTSPOTS: HotspotInfo[] = [
  {
    id: 'crown',
    title: 'Caramelized Craggy Crown',
    subtitle: 'Golden 175°C Bake',
    description: 'Slow caramelization of unrefined turbinado sugar creates our signature crunchy, volcano-cracked muffin peak.',
    position: { x: 50, y: 32 }
  },
  {
    id: 'chunks',
    title: 'Valrhona Chocolate Core',
    subtitle: 'Molten Pocket Texture',
    description: 'Hand-cut 70% dark chocolate shards that melt into velvety pockets while keeping a soft, aerated crumb.',
    position: { x: 68, y: 44 }
  },
  {
    id: 'liner',
    title: 'Pleated French Liner',
    subtitle: 'Virgin Kraft Parchment',
    description: 'Custom corrugated paper cups imported from Alsace that hold heat evenly and peel away with zero crumb loss.',
    position: { x: 34, y: 72 }
  }
];

export default function Interactive3DMuffinShowcase({
  onAddToCart,
  onNavigate
}: Interactive3DMuffinShowcaseProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedGlaze, setSelectedGlaze] = useState<GlazeOption>(GLAZE_OPTIONS[0]);
  const [activeHotspot, setActiveHotspot] = useState<HotspotInfo | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const muffinGroupRef = useRef<THREE.Group | null>(null);
  const glazeMeshesRef = useRef<THREE.Mesh[]>([]);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.15, y: 0 });
  const currentRotationRef = useRef({ x: 0.15, y: 0 });

  // 1. Initialize Three.js Scene and Procedural 3D Muffin
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.9, 4.3);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Master Muffin Group
    const muffinGroup = new THREE.Group();
    scene.add(muffinGroup);
    muffinGroupRef.current = muffinGroup;
    muffinGroup.position.y = -0.15;

    // ================= LIGHTING =================
    // Ambient Light: soft warm room glow
    const ambientLight = new THREE.AmbientLight(0xfff8f2, 1.2);
    scene.add(ambientLight);

    // Directional Key Light: warm amber sun from top-right
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.4);
    keyLight.position.set(3.5, 5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Burnt Orange Rim Light: highlights silhouette edges
    const rimLight = new THREE.DirectionalLight(0xe94f16, 1.8);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    // Soft Tangerine Front Fill Light
    const fillLight = new THREE.PointLight(0xff792b, 1.1, 8);
    fillLight.position.set(0, 2, 3);
    scene.add(fillLight);

    // ================= 3D GEOMETRY CONSTRUCTION =================

    // 1. Artisanal Pleated Liner Cup (Corrugated Cylinder)
    const cupRadiusTop = 0.95;
    const cupRadiusBottom = 0.72;
    const cupHeight = 1.1;
    const pleatCount = 36;
    const cupSegmentsY = 16;
    const cupGeometry = new THREE.CylinderGeometry(
      cupRadiusTop,
      cupRadiusBottom,
      cupHeight,
      pleatCount,
      cupSegmentsY,
      true
    );

    // Displace vertices to create authentic crimped pleated paper folds
    const posAttr = cupGeometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      const angle = Math.atan2(z, x);
      const radius = Math.sqrt(x * x + z * z);
      // Ruffled accordion pleat formula
      const pleatWave = Math.sin(angle * pleatCount * 0.5) * 0.035;
      const newRadius = radius + pleatWave;
      posAttr.setX(i, Math.cos(angle) * newRadius);
      posAttr.setZ(i, Math.sin(angle) * newRadius);
    }
    cupGeometry.computeVertexNormals();

    // Liner Material (Deep Espresso kraft paper with subtle warm amber texture)
    const cupMaterial = new THREE.MeshStandardMaterial({
      color: 0x21100b,
      roughness: 0.88,
      metalness: 0.12,
      side: THREE.DoubleSide
    });
    const cupMesh = new THREE.Mesh(cupGeometry, cupMaterial);
    cupMesh.position.y = -0.45;
    cupMesh.castShadow = true;
    cupMesh.receiveShadow = true;
    muffinGroup.add(cupMesh);

    // 2. Volumetric Baked Muffin Crown (Craggy, puffy dome)
    const crownGeometry = new THREE.SphereGeometry(1.22, 48, 36, 0, Math.PI * 2, 0, Math.PI * 0.58);
    const crownPos = crownGeometry.attributes.position;
    // Displace crown vertices for organic bakery peak and cracks
    for (let i = 0; i < crownPos.count; i++) {
      const x = crownPos.getX(i);
      const y = crownPos.getY(i);
      const z = crownPos.getZ(i);

      // Noise formula using trig harmonics
      const n1 = Math.sin(x * 4.5) * Math.cos(z * 4.5) * 0.08;
      const n2 = Math.sin(y * 6.0) * Math.cos(x * 3.0) * 0.05;
      const n3 = Math.cos((x + z) * 8.0) * 0.03;
      const displacement = n1 + n2 + n3;

      crownPos.setX(i, x + x * displacement * 0.3);
      crownPos.setY(i, y * 0.82 + displacement);
      crownPos.setZ(i, z + z * displacement * 0.3);
    }
    crownGeometry.computeVertexNormals();

    // Baked Crust Material (Warm roasted hazelnut/caramel crumb)
    const crownMaterial = new THREE.MeshStandardMaterial({
      color: 0xc47a32,
      roughness: 0.76,
      metalness: 0.08,
      bumpScale: 0.06
    });
    const crownMesh = new THREE.Mesh(crownGeometry, crownMaterial);
    crownMesh.position.y = 0.12;
    crownMesh.castShadow = true;
    crownMesh.receiveShadow = true;
    muffinGroup.add(crownMesh);

    // 3. Embedded Dark Valrhona Chocolate & Almond Chunks
    const chocolateMat = new THREE.MeshStandardMaterial({
      color: 0x32140d,
      roughness: 0.32,
      metalness: 0.15
    });

    const almondMat = new THREE.MeshStandardMaterial({
      color: 0xf4b34d,
      roughness: 0.65,
      metalness: 0.05
    });

    // Scatter chunks on the crown
    const chunkCount = 18;
    for (let c = 0; c < chunkCount; c++) {
      const isAlmond = c % 4 === 0;
      const size = isAlmond ? 0.09 + Math.random() * 0.05 : 0.12 + Math.random() * 0.09;
      const chunkGeo = isAlmond 
        ? new THREE.ConeGeometry(size * 0.8, size * 1.6, 6)
        : new THREE.DodecahedronGeometry(size, 0);

      const chunkMesh = new THREE.Mesh(chunkGeo, isAlmond ? almondMat : chocolateMat);
      
      const phi = Math.random() * Math.PI * 0.35 + 0.15;
      const theta = Math.random() * Math.PI * 2;
      const r = 1.15 + (Math.random() - 0.5) * 0.08;

      chunkMesh.position.x = r * Math.sin(phi) * Math.cos(theta);
      chunkMesh.position.y = 0.12 + r * Math.cos(phi) * 0.82;
      chunkMesh.position.z = r * Math.sin(phi) * Math.sin(theta);

      chunkMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      chunkMesh.castShadow = true;
      muffinGroup.add(chunkMesh);
    }

    // 4. Glossy Artisanal Caramel / Honey Glaze Drizzles
    const glazeMeshes: THREE.Mesh[] = [];
    const drizzleCurves = [
      // Ribbon 1 across crown
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.95, 0.45, -0.2),
        new THREE.Vector3(-0.55, 0.88, 0.3),
        new THREE.Vector3(0.0, 1.05, 0.1),
        new THREE.Vector3(0.65, 0.78, 0.45),
        new THREE.Vector3(0.95, 0.35, 0.25)
      ]),
      // Ribbon 2 criss-cross
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.65, 0.65, 0.75),
        new THREE.Vector3(-0.25, 0.98, 0.35),
        new THREE.Vector3(0.3, 0.95, -0.3),
        new THREE.Vector3(0.8, 0.55, -0.6)
      ]),
      // Ribbon 3 drip down side
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.1, 1.02, 0.2),
        new THREE.Vector3(0.18, 0.88, 0.75),
        new THREE.Vector3(0.28, 0.45, 0.95),
        new THREE.Vector3(0.32, 0.12, 0.92)
      ])
    ];

    drizzleCurves.forEach((curve) => {
      const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.045, 8, false);
      const glazeMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(selectedGlaze.hex),
        roughness: 0.15,
        metalness: 0.1,
        transmission: 0.35,
        ior: 1.45,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, glazeMat);
      tubeMesh.castShadow = true;
      muffinGroup.add(tubeMesh);
      glazeMeshes.push(tubeMesh);
    });
    glazeMeshesRef.current = glazeMeshes;

    // 5. Contact Shadow Plinth (Subtle white marble circular podium)
    const plinthGeometry = new THREE.CylinderGeometry(1.5, 1.6, 0.08, 64);
    const plinthMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.05
    });
    const plinth = new THREE.Mesh(plinthGeometry, plinthMaterial);
    plinth.position.y = -1.05;
    plinth.receiveShadow = true;
    muffinGroup.add(plinth);

    // Warm contact shadow circle
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x32140d,
      transparent: true,
      opacity: 0.18
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.08;
    muffinGroup.add(shadowMesh);

    // 6. Floating Warm Steam / Stardust Particles
    const particleCount = 28;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 1.8;
      particlePositions[p * 3 + 1] = 0.5 + Math.random() * 1.8;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 1.8;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xf4b34d,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    muffinGroup.add(particles);

    // ================= ANIMATION LOOP =================
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth auto-rotation or damping
      if (isAutoRotating && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.007;
      }

      // Smooth lerp rotation for ultra-luxurious feel
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      if (muffinGroupRef.current) {
        muffinGroupRef.current.rotation.x = currentRotationRef.current.x;
        muffinGroupRef.current.rotation.y = currentRotationRef.current.y;
        // Subtle organic breathing float
        muffinGroupRef.current.position.y = -0.15 + Math.sin(Date.now() * 0.002) * 0.035;
      }

      // Floating steam particles drift upward
      const posArray = particles.geometry.attributes.position.array as Float32Array;
      for (let p = 0; p < particleCount; p++) {
        posArray[p * 3 + 1] += 0.0035;
        if (posArray[p * 3 + 1] > 2.2) {
          posArray[p * 3 + 1] = 0.4;
          posArray[p * 3] = (Math.random() - 0.5) * 1.2;
          posArray[p * 3 + 2] = (Math.random() - 0.5) * 1.2;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      cupGeometry.dispose();
      cupMaterial.dispose();
      crownGeometry.dispose();
      crownMaterial.dispose();
      container.innerHTML = '';
    };
  }, []);

  // 2. React to Glaze Switcher: Dynamically update Three.js Material Colors
  useEffect(() => {
    if (!glazeMeshesRef.current.length) return;
    const targetColor = new THREE.Color(selectedGlaze.hex);
    glazeMeshesRef.current.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshPhysicalMaterial) {
        mesh.material.color = targetColor;
        mesh.material.needsUpdate = true;
      }
    });
  }, [selectedGlaze]);

  // 3. Pointer Interaction Handlers for 3D Orbiting
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsAutoRotating(false);
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x = Math.max(-0.4, Math.min(0.6, targetRotationRef.current.x + deltaY * 0.008));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Add Item to Cart
  const handleOrderMuffin = (e: React.MouseEvent) => {
    const signatureMuffinItem: MenuItem = {
      id: 'muffinns-signature-3d-muffin',
      name: `Signature Honey & ${selectedGlaze.name}`,
      category: 'Muffins & Desserts',
      description: `3D-crafted honey muffin slow-baked at 175°C with ${selectedGlaze.notes} Made fresh daily.`,
      basePrice: 380,
      image: '/assets/images/hero_editorial_muffin_1794039141433.jpg',
      badge: 'Chef 3D Creation'
    };

    if (onAddToCart) {
      onAddToCart(
        signatureMuffinItem,
        { label: `Fresh Glaze: ${selectedGlaze.name}`, price: 380 * quantity },
        e
      );
    }

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2400);
  };

  const [is3DViewerExpanded, setIs3DViewerExpanded] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF6F3] text-[#32140D] pt-10 sm:pt-16 pb-0 select-none border-b border-[#32140D]/10">
      
      {/* ================= BACKGROUND PASTRY DOODLES (Design.com Style) ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0 opacity-60" aria-hidden="true">
        {/* Top-Left Cupcake Doodle */}
        <svg className="absolute -top-4 -left-6 w-36 sm:w-48 h-36 sm:h-48 text-[#ECC6B6]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M25 55 L32 88 C33 91 36 93 40 93 L60 93 C64 93 67 91 68 88 L75 55 Z" />
          <path d="M35 55 L39 90 M50 55 L50 93 M65 55 L61 90" strokeDasharray="1 3" />
          <path d="M22 55 C22 47 30 46 36 49 C40 42 50 42 54 48 C60 43 70 45 72 52 C76 52 79 56 77 60 C75 62 70 62 68 60" />
          <circle cx="50" cy="30" r="4.5" fill="#E94F16" fillOpacity="0.3" stroke="currentColor" />
          <path d="M50 25.5 C52 18 56 16 59 15" />
        </svg>

        {/* Top-Right Donut Doodle */}
        <svg className="absolute 12 right-6 sm:right-16 w-28 sm:w-36 h-28 sm:h-36 text-[#ECC6B6]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="50" cy="50" r="40" />
          <circle cx="50" cy="50" r="14" />
          <path d="M28 32 Q32 28 36 32 M60 28 Q64 24 68 28 M30 65 Q34 69 38 65 M62 66 Q66 70 70 66" strokeLinecap="round" strokeWidth="2.5" />
          <circle cx="48" cy="22" r="1.5" fill="currentColor" />
          <circle cx="72" cy="46" r="1.5" fill="currentColor" />
          <circle cx="28" cy="50" r="1.5" fill="currentColor" />
          <circle cx="50" cy="76" r="1.5" fill="currentColor" />
        </svg>

        {/* Mid-Left Sprinkled Cookie / Donut */}
        <svg className="absolute top-1/3 left-8 sm:left-24 w-16 sm:w-20 h-16 sm:h-20 text-[#ECC6B6]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="50" r="38" />
          <circle cx="50" cy="50" r="12" />
          <line x1="32" y1="36" x2="38" y2="42" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="34" x2="66" y2="40" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="64" x2="42" y2="58" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Floating Pretzel 1 */}
        <svg className="absolute top-16 left-1/3 w-16 sm:w-20 h-16 sm:h-20 text-[#ECC6B6]/80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M30 65 C15 50 20 25 38 25 C48 25 50 35 50 45 C50 35 52 25 62 25 C80 25 85 50 70 65 C58 78 42 78 30 65 Z" />
          <path d="M38 48 C42 58 58 58 62 48" />
        </svg>

        {/* Floating Pretzel 2 */}
        <svg className="absolute top-28 right-1/4 w-14 sm:w-16 h-14 sm:h-16 text-[#ECC6B6]/70" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M30 65 C15 50 20 25 38 25 C48 25 50 35 50 45 C50 35 52 25 62 25 C80 25 85 50 70 65 C58 78 42 78 30 65 Z" />
          <path d="M38 48 C42 58 58 58 62 48" />
        </svg>

        {/* Bottom Right Pastry Swirl / Cinnamon Roll */}
        <svg className="absolute bottom-1/3 right-8 sm:right-20 w-24 sm:w-32 h-24 sm:h-32 text-[#ECC6B6]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M50 50 m -35 0 a 35 35 0 1 0 70 0 a 35 35 0 1 0 -70 0" />
          <path d="M50 50 m -24 0 a 24 24 0 1 0 48 0 a 24 24 0 1 0 -48 0" strokeDasharray="3 3" />
          <path d="M50 50 m -12 0 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0" />
        </svg>

        {/* Subtle Sprinkle Dots Clusters */}
        <div className="absolute top-1/4 left-1/4 flex gap-1.5 opacity-50">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E94F16]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#7BA05B]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF792B]" />
        </div>
        <div className="absolute top-1/2 right-1/3 flex gap-1.5 opacity-50">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7BA05B]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#E94F16]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#F4B34D]" />
        </div>
      </div>

      {/* ================= MAIN EDITORIAL CONTENT ================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center">
        
        {/* AUTHENTIC VINTAGE MUFF INNS CREST (Matching User Screenshot) */}
        <div className="mb-6 sm:mb-8 flex items-center justify-center">
          <div className="flex items-center gap-3.5 px-5 py-3 rounded-xl bg-white shadow-sm border border-[#32140D]/10">
            {/* Hummingbird & botanical flower illustration */}
            <div className="w-14 h-12 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 80" className="w-full h-full text-[#32140D]" fill="currentColor">
                {/* Flower blossom */}
                <circle cx="32" cy="50" r="9" fill="#E94F16" fillOpacity="0.85" />
                <circle cx="22" cy="42" r="7" fill="#FF792B" fillOpacity="0.8" />
                <circle cx="42" cy="42" r="7" fill="#FF792B" fillOpacity="0.8" />
                <circle cx="32" cy="34" r="7" fill="#E94F16" fillOpacity="0.8" />
                <circle cx="32" cy="48" r="4" fill="#F4B34D" />
                {/* Hummingbird */}
                <path d="M58 28 C64 24 72 26 78 30 C76 34 72 38 66 40 L60 48 C56 50 52 46 54 42 Z" fill="#7BA05B" />
                <path d="M78 30 L95 24" stroke="#21100B" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M66 32 C70 18 80 14 84 12 C78 20 72 26 66 32 Z" fill="#3B5E34" />
                <path d="M54 42 L42 60 L48 62 L58 48 Z" fill="#8FB36A" />
              </svg>
            </div>

            {/* Vintage Emblem Box */}
            <div className="flex flex-col items-center justify-center border-l border-[#32140D]/15 pl-4 py-0.5">
              {/* Urdu script banner */}
              <div className="px-3 py-0.5 rounded-sm bg-[#E94F16] text-white flex items-center justify-center shadow-xs">
                <span className="font-serif font-black text-sm sm:text-base leading-none tracking-normal">
                  پتاشے
                </span>
              </div>
              {/* Brand Typography */}
              <div className="mt-1 text-center">
                <h3 className="font-serif font-black text-base sm:text-lg tracking-tight leading-tight text-[#21100B]">
                  Muff<span className="text-[#E94F16]"> Inns</span>
                </h3>
                <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] uppercase text-[#7BA05B] font-extrabold block">
                  SWEETS & BAKERS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* HEADLINE: "Decadence in Every Bite" (Half Dark Brown, Orange & Pistachio) */}
        <h2 
          className="font-serif font-black tracking-tight text-[clamp(2.8rem,7vw,7.2rem)] leading-[0.96] max-w-6xl mx-auto"
          style={{
            background: 'linear-gradient(110deg, #21100B 0%, #32140D 42%, #E94F16 70%, #FF792B 82%, #7BA05B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 18px rgba(233, 79, 22, 0.15))'
          }}
        >
          Decadence in Every Bite
        </h2>

        {/* Clean, Unboxed Subtitle with Pistachio Notes */}
        <p className="mt-4 sm:mt-5 max-w-3xl mx-auto font-sans text-base sm:text-xl text-[#32140D]/85 font-normal leading-relaxed tracking-wide">
          Handcrafted gourmet pastries baked fresh for your daily indulgence.
        </p>

        {/* Subtle Pistachio & Saffron Flourish Accent */}
        <div className="mt-2 flex items-center justify-center gap-3" aria-hidden="true">
          <span className="h-px w-10 sm:w-16 bg-[#7BA05B]/40" />
          <span className="font-handwriting text-base sm:text-lg text-[#7BA05B] font-bold">
            ✦ Slow-roasted pistachio nibs & raw wildflower honey ✦
          </span>
          <span className="h-px w-10 sm:w-16 bg-[#7BA05B]/40" />
        </div>

        {/* CTA ORDER NOW BUTTON (Direct match to screenshot) */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => (onNavigate ? onNavigate('menu') : window.location.assign('#menu-section'))}
            className="px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#E94F16] to-[#FF792B] text-white font-mono text-xs sm:text-sm uppercase tracking-[0.24em] font-extrabold shadow-[0_12px_28px_-6px_rgba(233,79,22,0.5)] hover:shadow-[0_18px_36px_-6px_rgba(233,79,22,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer inline-flex items-center gap-3"
          >
            <span>ORDER NOW</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Interactive 3D Muffin Orbit Toggle */}
          <button
            onClick={() => setIs3DViewerExpanded(!is3DViewerExpanded)}
            className="px-6 py-3 rounded-full bg-white/90 text-[#32140D] hover:text-[#E94F16] border border-[#32140D]/15 font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
          >
            <Compass className={`w-3.5 h-3.5 text-[#7BA05B] ${is3DViewerExpanded ? 'rotate-90' : ''}`} />
            <span>{is3DViewerExpanded ? 'Hide 3D Muffin Studio' : '✦ Spin 3D Muffin & Glazes'}</span>
          </button>
        </div>

        {/* ================= OPTIONAL EXPANDABLE 3D MUFFIN STUDIO ================= */}
        <AnimatePresence>
          {is3DViewerExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-4xl mx-auto mt-8 overflow-hidden"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-md border border-[#32140D]/10 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* 3D Canvas */}
                  <div className="relative w-72 sm:w-80 aspect-square shrink-0 flex items-center justify-center">
                    <div
                      ref={mountRef}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerLeave={handlePointerUp}
                      className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none z-10"
                      title="Drag to orbit 3D Muffin"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-black/10 text-[10px] font-mono text-[#32140D]">
                      <Compass className="w-3 h-3 text-[#E94F16] animate-spin" />
                      <span>360° Drag Orbit</span>
                    </div>
                  </div>

                  {/* Glazes & Ordering */}
                  <div className="flex-1 space-y-4 text-left">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#7BA05B] font-bold block">
                        Signature Atelier Glaze
                      </span>
                      <h4 className="font-serif text-2xl font-bold text-[#21100B]">
                        {selectedGlaze.name}
                      </h4>
                      <p className="text-xs text-[#32140D]/75 font-sans mt-1">
                        {selectedGlaze.notes}
                      </p>
                    </div>

                    {/* Glaze Selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {GLAZE_OPTIONS.map((glaze) => {
                        const isSelected = selectedGlaze.id === glaze.id;
                        return (
                          <button
                            key={glaze.id}
                            onClick={() => setSelectedGlaze(glaze)}
                            className={`p-2 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2 border ${
                              isSelected
                                ? 'border-[#E94F16] bg-[#FAF6F3] shadow-xs'
                                : 'border-[#32140D]/10 bg-white hover:border-[#32140D]/30'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: glaze.hex }}
                            />
                            <span className="text-[11px] font-medium text-[#21100B] truncate">
                              {glaze.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex items-center gap-4">
                      <button
                        onClick={handleOrderMuffin}
                        className="flex-1 py-3 px-5 rounded-full bg-[#E94F16] text-white font-mono text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#d6430e] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {addedSuccess ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                        <span>{addedSuccess ? 'Added to Order!' : 'Order 3D Muffin · Rs 380'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ================= EDGE-TO-EDGE PANORAMIC BOTTOM DESSERT PARADE (Design.com Screenshot) ================= */}
      <div className="relative w-full mt-10 sm:mt-14 overflow-hidden" aria-label="Fresh bakery assortment lineup">
        {/* Full-width container extending edge-to-edge across entire screen */}
        <div className="w-full flex items-end justify-between px-2 sm:px-6 md:px-12 gap-2 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-none transform translate-y-4 sm:translate-y-8">
          
          {/* 1. Red Velvet Cream Cake Slice with Berries */}
          <div className="shrink-0 w-28 sm:w-44 md:w-56 lg:w-64 transition-transform duration-500 hover:-translate-y-3 cursor-pointer group">
            <div className="relative">
              <img
                src="/assets/images/red_velvet_real_1785250411481.jpg"
                alt="Red Velvet Gourmet Pastry"
                className="w-full h-auto object-cover rounded-t-3xl shadow-lg border-t-2 border-x-2 border-white/60"
              />
              <span className="absolute bottom-2 left-2 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-[#32140D] font-bold shadow-xs">
                Red Velvet
              </span>
            </div>
          </div>

          {/* 2. Ferrero Rocher Hazelnut Truffle / Dark Cocoa Fudge Dome */}
          <div className="shrink-0 w-32 sm:w-48 md:w-60 lg:w-72 transition-transform duration-500 hover:-translate-y-3 cursor-pointer group">
            <div className="relative">
              <img
                src="/assets/images/brownie_real_1785249149924.jpg"
                alt="Valrhona Cocoa Truffle Dome"
                className="w-full h-auto object-cover rounded-t-3xl shadow-xl border-t-2 border-x-2 border-white/60"
              />
              <span className="absolute bottom-2 left-2 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-[#32140D] font-bold shadow-xs">
                Hazelnut Cocoa
              </span>
            </div>
          </div>

          {/* 3. Strawberry & Pistachio Macaron Stack */}
          <div className="shrink-0 w-36 sm:w-52 md:w-64 lg:w-80 transition-transform duration-500 hover:-translate-y-3 cursor-pointer group">
            <div className="relative">
              <img
                src="/assets/images/bento_cakes_real_1785250831955.jpg"
                alt="French Macaron & Bento Cake"
                className="w-full h-auto object-cover rounded-t-3xl shadow-xl border-t-2 border-x-2 border-white/60"
              />
              <span className="absolute bottom-2 left-2 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#7BA05B] text-white font-bold shadow-xs">
                Pistachio & Berry
              </span>
            </div>
          </div>

          {/* 4. Chocolate Rainbow Sprinkles Donut */}
          <div className="shrink-0 w-32 sm:w-48 md:w-60 lg:w-72 transition-transform duration-500 hover:-translate-y-3 cursor-pointer group">
            <div className="relative">
              <img
                src="/assets/images/assorted_donuts_poster_1785053725000_1785053747442.jpg"
                alt="Sprinkled Gourmet Donut"
                className="w-full h-auto object-cover rounded-t-3xl shadow-xl border-t-2 border-x-2 border-white/60"
              />
              <span className="absolute bottom-2 left-2 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-[#32140D] font-bold shadow-xs">
                Sprinkles Donut
              </span>
            </div>
          </div>

          {/* 5. Pink Frosted Floral Cupcake with Red Cherry */}
          <div className="shrink-0 w-36 sm:w-52 md:w-64 lg:w-80 transition-transform duration-500 hover:-translate-y-3 cursor-pointer group">
            <div className="relative">
              <img
                src="/assets/images/muffins_cupcakes_real_1785250803815.jpg"
                alt="Floral Strawberry Cupcake"
                className="w-full h-auto object-cover rounded-t-3xl shadow-2xl border-t-2 border-x-2 border-white/60"
              />
              <span className="absolute bottom-2 left-2 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E94F16] text-white font-bold shadow-xs">
                Cherry Cupcake
              </span>
            </div>
          </div>

          {/* 6. Royal Pistachio Kunafa / Baklava */}
          <div className="shrink-0 w-32 sm:w-48 md:w-60 lg:w-72 transition-transform duration-500 hover:-translate-y-3 cursor-pointer group">
            <div className="relative">
              <img
                src="/assets/images/pistachio_kunafa_real_1785249233286.jpg"
                alt="Royal Pistachio Kunafa"
                className="w-full h-auto object-cover rounded-t-3xl shadow-xl border-t-2 border-x-2 border-white/60"
              />
              <span className="absolute bottom-2 left-2 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#7BA05B] text-white font-bold shadow-xs">
                Pistachio Kunafa
              </span>
            </div>
          </div>

        </div>

        {/* Ambient bottom gradient blend into next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
      </div>

    </section>
  );
}

