// ============================================================================
// SARVAGYA AI — THREE.JS 3D SCENE & SCIENTIFIC VIEWER
// Procedural WebGL rendering for molecules, planetary bodies & orbital systems
// Strictly adhering to Three.js architecture, resource disposal & zero-pill design
// ============================================================================

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  Atom,
  Globe,
  Radio,
  Layers,
} from "lucide-react";
import { ThreeDViewerProps, ThreeDSceneType } from "./types.ts";

export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  sceneType = "molecule",
  modelIdentifier = "caffeine",
  title,
  description,
  autoRotate: initialAutoRotate = true,
  height = 420,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);
  const [wireframe, setWireframe] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activePreset, setActivePreset] = useState<ThreeDSceneType>(sceneType);
  const [rotationSpeed, setRotationSpeed] = useState(1);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software GL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement("canvas").getContext("webgl2");
        if (!gl) return true;
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 600;
    const heightPx = typeof height === "number" ? height : 420;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060810);
    scene.fog = new THREE.FogExp2(0x060810, 0.025);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 2, 7);

    // WebGL Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Studio Environment map via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-point Lighting
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x090d16, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 1.5);
    rimLight.position.set(-6, 3, -6);
    scene.add(rimLight);

    // Ground Contact Shadow Plane
    const contactPlaneGeo = new THREE.PlaneGeometry(12, 12);
    const contactPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x020307,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const contactPlane = new THREE.Mesh(contactPlaneGeo, contactPlaneMat);
    contactPlane.rotation.x = -Math.PI / 2;
    contactPlane.position.y = -2;
    scene.add(contactPlane);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 20;
    controls.minDistance = 2;

    // Procedural Model Group
    const modelGroup = new THREE.Group();
    meshGroupRef.current = modelGroup;
    scene.add(modelGroup);

    materialsRef.current = [];

    // Build procedural 3D model based on preset
    const buildScene = (type: ThreeDSceneType) => {
      // Clear previous children
      while (modelGroup.children.length > 0) {
        const child = modelGroup.children[0] as THREE.Mesh;
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
          else child.material.dispose();
        }
        modelGroup.remove(child);
      }
      materialsRef.current = [];

      if (type === "molecule") {
        // Molecule (Ball-and-stick model with carbon, nitrogen, oxygen, hydrogen)
        const atomGeo = new THREE.SphereGeometry(0.35, 32, 32);
        const smallAtomGeo = new THREE.SphereGeometry(0.2, 24, 24);
        const bondGeo = new THREE.CylinderGeometry(0.06, 0.06, 1, 16);

        const carbonMat = new THREE.MeshPhysicalMaterial({ color: 0x334155, roughness: 0.2, metalness: 0.4 });
        const nitrogenMat = new THREE.MeshPhysicalMaterial({ color: 0x2563eb, roughness: 0.15, metalness: 0.5 });
        const oxygenMat = new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.3 });
        const hydrogenMat = new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.1 });
        const bondMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.6 });

        materialsRef.current.push(carbonMat, nitrogenMat, oxygenMat, hydrogenMat, bondMat);

        // Core Ring
        const ringAtoms = [
          { pos: [-1.2, 0, 0], mat: carbonMat },
          { pos: [-0.6, 1.0, 0], mat: nitrogenMat },
          { pos: [0.6, 1.0, 0], mat: carbonMat },
          { pos: [1.2, 0, 0], mat: nitrogenMat },
          { pos: [0.6, -1.0, 0], mat: carbonMat },
          { pos: [-0.6, -1.0, 0], mat: carbonMat },
          // Functional groups
          { pos: [-1.2, 1.9, 0.4], mat: oxygenMat },
          { pos: [1.3, -1.8, 0], mat: oxygenMat },
          { pos: [2.1, 0.6, 0.5], mat: carbonMat },
          { pos: [-2.1, -0.4, -0.3], mat: hydrogenMat },
          { pos: [2.6, 1.4, 0.8], mat: hydrogenMat },
        ];

        ringAtoms.forEach((a) => {
          const mesh = new THREE.Mesh(a.mat === hydrogenMat ? smallAtomGeo : atomGeo, a.mat);
          mesh.position.set(a.pos[0], a.pos[1], a.pos[2]);
          mesh.castShadow = !isSoftwareGl;
          modelGroup.add(mesh);
        });

        // Bonds
        for (let i = 0; i < 6; i++) {
          const a1 = ringAtoms[i].pos;
          const a2 = ringAtoms[(i + 1) % 6].pos;
          const bond = new THREE.Mesh(bondGeo, bondMat);
          const p1 = new THREE.Vector3(a1[0], a1[1], a1[2]);
          const p2 = new THREE.Vector3(a2[0], a2[1], a2[2]);
          const dist = p1.distanceTo(p2);
          bond.scale.set(1, dist, 1);
          bond.position.copy(p1).add(p2).multiplyScalar(0.5);
          bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
          modelGroup.add(bond);
        }
      } else if (type === "planet" || type === "solar_system") {
        // Planetary body with rings, atmospheric glow, and surface topography
        const planetGeo = new THREE.SphereGeometry(1.6, 48, 48);
        const planetMat = new THREE.MeshStandardMaterial({
          color: activePreset === "solar_system" ? 0x0284c7 : 0xe05638,
          roughness: 0.65,
          metalness: 0.2,
        });
        materialsRef.current.push(planetMat);

        const planet = new THREE.Mesh(planetGeo, planetMat);
        planet.castShadow = !isSoftwareGl;
        planet.receiveShadow = !isSoftwareGl;
        modelGroup.add(planet);

        // Atmosphere glow shell
        const atmosGeo = new THREE.SphereGeometry(1.68, 36, 36);
        const atmosMat = new THREE.MeshStandardMaterial({
          color: activePreset === "solar_system" ? 0x38bdf8 : 0xf97316,
          transparent: true,
          opacity: 0.25,
          roughness: 0.1,
          depthWrite: false,
        });
        materialsRef.current.push(atmosMat);
        const atmos = new THREE.Mesh(atmosGeo, atmosMat);
        modelGroup.add(atmos);

        // Planetary Ring
        const ringGeo = new THREE.RingGeometry(2.2, 3.4, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0x94a3b8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
          roughness: 0.4,
        });
        materialsRef.current.push(ringMat);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.3;
        ring.rotation.y = 0.2;
        modelGroup.add(ring);
      } else if (type === "satellite_orbit") {
        // Earth with satellite in elliptical orbit
        const earthGeo = new THREE.SphereGeometry(1.4, 40, 40);
        const earthMat = new THREE.MeshStandardMaterial({
          color: 0x1e3a8a,
          roughness: 0.4,
          metalness: 0.3,
        });
        materialsRef.current.push(earthMat);
        const earth = new THREE.Mesh(earthGeo, earthMat);
        modelGroup.add(earth);

        // Orbit trail (Torus / Line loop)
        const orbitCurve = new THREE.EllipseCurve(0, 0, 3.2, 2.6, 0, 2 * Math.PI, false, 0);
        const points = orbitCurve.getPoints(100);
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(
          points.map((p) => new THREE.Vector3(p.x, 0, p.y))
        );
        const orbitMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        orbitLine.rotation.x = Math.PI / 4;
        modelGroup.add(orbitLine);

        // Satellite body (cube + solar panels)
        const satGroup = new THREE.Group();
        const bodyGeo = new THREE.BoxGeometry(0.3, 0.3, 0.4);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9, roughness: 0.2 });
        const panelGeo = new THREE.BoxGeometry(1.2, 0.02, 0.3);
        const panelMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.1 });
        materialsRef.current.push(bodyMat, panelMat);

        satGroup.add(new THREE.Mesh(bodyGeo, bodyMat));
        satGroup.add(new THREE.Mesh(panelGeo, panelMat));
        satGroup.position.set(2.8, 1.2, 0);
        modelGroup.add(satGroup);
      } else {
        // Generic Mesh / Torus Knot
        const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32);
        const knotMat = new THREE.MeshPhysicalMaterial({
          color: 0x6366f1,
          metalness: 0.85,
          roughness: 0.18,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
        });
        materialsRef.current.push(knotMat);
        const knot = new THREE.Mesh(knotGeo, knotMat);
        knot.castShadow = !isSoftwareGl;
        modelGroup.add(knot);
      }
    };

    buildScene(activePreset);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      if (autoRotate && modelGroup) {
        modelGroup.rotation.y += 0.4 * delta * rotationSpeed;
        modelGroup.rotation.x += 0.15 * delta * rotationSpeed;
      }

      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = typeof height === "number" ? height : 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activePreset, autoRotate, rotationSpeed, height]);

  // Wireframe toggle
  useEffect(() => {
    materialsRef.current.forEach((m) => {
      // @ts-ignore
      m.wireframe = wireframe;
      m.needsUpdate = true;
    });
  }, [wireframe]);

  return (
    <div
      className={`relative w-full rounded-none border border-slate-800 bg-[#060810] overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 h-screen" : ""
      }`}
    >
      {/* Header Info */}
      <div className="absolute top-3 left-4 z-10 flex items-center space-x-3 pointer-events-none">
        <div className="flex h-8 w-8 items-center justify-center bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
          <Atom className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            {title || `3D Spatial Engine: ${activePreset.toUpperCase()}`}
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            {description || `Interactive WebGL Model • Procedural Mesh (${modelIdentifier})`}
          </div>
        </div>
      </div>

      {/* Top-Right Action Badges */}
      <div className="absolute top-3 right-4 z-10 flex items-center space-x-2">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex h-7 w-7 items-center justify-center bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full cursor-grab active:cursor-grabbing"
        style={{ height: isFullscreen ? "100vh" : height }}
      />

      {/* Collapsible Bottom Control Dock (Strictly following zero viewport occlusion rule) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-xl">
        <div className="border border-slate-800 bg-slate-950/90 shadow-2xl">
          {/* Header toggle */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800/80 text-[11px] font-mono text-slate-400">
            <span className="flex items-center space-x-2">
              <Sliders className="h-3 w-3 text-cyan-400" />
              <span>SPATIAL INSPECTION CONTROLS</span>
            </span>
            <button
              onClick={() => setShowControls(!showControls)}
              className="flex items-center space-x-1 text-slate-400 hover:text-slate-200"
            >
              <span>{showControls ? "Hide" : "Show"}</span>
              {showControls ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>
          </div>

          {showControls && (
            <div className="p-3 space-y-2.5">
              {/* Preset Selector */}
              <div className="flex items-center space-x-1 overflow-x-auto text-xs font-mono">
                <span className="text-[10px] text-slate-500 uppercase mr-2">Scene:</span>
                {(
                  [
                    { id: "molecule", label: "Molecule" },
                    { id: "planet", label: "Planet" },
                    { id: "satellite_orbit", label: "Orbital Track" },
                    { id: "mesh", label: "Torus Knot" },
                  ] as const
                ).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setActivePreset(preset.id)}
                    className={`px-2.5 py-1 border transition-colors ${
                      activePreset === preset.id
                        ? "border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold"
                        : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Toggles and Sliders */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/60 text-[11px] font-mono">
                {/* Auto Rotate Toggle */}
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 border ${
                    autoRotate
                      ? "border-cyan-500/50 bg-cyan-950/30 text-cyan-300"
                      : "border-slate-800 bg-slate-900 text-slate-400"
                  }`}
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Rotate: {autoRotate ? "ON" : "OFF"}</span>
                </button>

                {/* Wireframe Toggle */}
                <button
                  onClick={() => setWireframe(!wireframe)}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 border ${
                    wireframe
                      ? "border-purple-500/50 bg-purple-950/30 text-purple-300"
                      : "border-slate-800 bg-slate-900 text-slate-400"
                  }`}
                >
                  <Layers className="h-3 w-3" />
                  <span>Wireframe: {wireframe ? "ON" : "OFF"}</span>
                </button>

                {/* Speed Multiplier */}
                <div className="flex items-center justify-between px-2 py-1 border border-slate-800 bg-slate-900 text-slate-400">
                  <span className="text-[10px] text-slate-500">SPEED:</span>
                  <div className="flex space-x-1 text-xs">
                    {[0.5, 1, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => setRotationSpeed(s)}
                        className={`px-1 ${
                          rotationSpeed === s ? "text-cyan-400 font-bold" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
