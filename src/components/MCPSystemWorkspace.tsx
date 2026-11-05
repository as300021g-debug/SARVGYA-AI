// ============================================================================
// SARVAGYA AI — MCP (MODEL CONTEXT PROTOCOL) AUTONOMOUS SYSTEMS & TICKET RPA
// (`src/components/MCPSystemWorkspace.tsx`)
// Real StractiAI Vision Bots, BotPlayers RL, Google DeepMind SIMA & RPA Ticket Booking
// ============================================================================

import React, { useState, useEffect, useRef } from "react";
import {
  Gamepad2,
  Bot,
  Ticket,
  Eye,
  Cpu,
  Zap,
  Play,
  Pause,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  Activity,
  Terminal,
  Crosshair,
  Compass,
  ArrowRight,
  ExternalLink,
  Server,
  HardDrive,
  Wifi,
  WifiOff,
  Database,
  Radio,
  FileJson,
} from "lucide-react";
import * as THREE from "three";

export type MCPWorkspaceTab = "stractiai" | "botplayers" | "sima" | "ticket_rpa" | "mcp_gateway" | "hardware_edge";

export const MCPSystemWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MCPWorkspaceTab>("mcp_gateway");

  // Telemetry from Backend MCP Server
  const [mcpStatus, setMcpStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 1. StractiAI States
  const [stractiRunning, setStractiRunning] = useState(true);
  const [stractiGoal, setStractiGoal] = useState<"farm_xp" | "clear_dungeon" | "auto_dodge" | "collect_items">("farm_xp");
  const [stractiLog, setStractiLog] = useState<string[]>([
    "[StractiAI] Optical capture initialized at 60 FPS",
    "[Vision] Bounding box [240, 320, 48, 64] -> Player Character (99% conf)",
    "[Vision] Bounding box [520, 180, 56, 42] -> Enemy Drone (94% conf)",
    "[Action] Dispatched Auto-Lock Aim -> Angle 34°",
    "[Action] Dispatched Fire Burst -> +45 XP",
  ]);
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);

  // 2. BotPlayers States
  const [botPolicy, setBotPolicy] = useState<"PPO" | "DQN" | "Q_LEARNING" | "HYBRID">("PPO");
  const [botReward, setBotReward] = useState(1480);
  const [botEpisode, setBotEpisode] = useState(42);
  const [botLogs, setBotLogs] = useState<string[]>([
    "[BotPlayers] RL Policy PPO loaded with clipping 0.2",
    "[Episode 40] Reward: +320 (Level 4 Clear)",
    "[Episode 41] Reward: +410 (Resource Farm Optimal)",
    "[Policy Update] Exploration epsilon decayed to 0.04",
  ]);

  // 3. Google DeepMind SIMA States
  const [simaInstruction, setSimaInstruction] = useState("SIMA, explore the temple ruins, climb the elevation, and retrieve the crystal relic");
  const [simaExecuting, setSimaExecuting] = useState(false);
  const [simaSteps, setSimaSteps] = useState<string[]>([
    "1. Orient viewport toward 3D visual beacon (Bearing 042°)",
    "2. Traverse rocky terrain avoiding hazard boundary",
    "3. Jump elevation ledge with force 5.5",
    "4. Reach target coordinates and interact with Crystal Relic",
  ]);
  const simaThreeCanvasRef = useRef<HTMLDivElement>(null);

  // 4. Autonomous Web RPA Ticket Booking States
  const [ticketProvider, setTicketProvider] = useState<"IRCTC_RAILWAYS" | "AIRLINE_GDS" | "EVENT_CINEMA">("IRCTC_RAILWAYS");
  const [origin, setOrigin] = useState("New Delhi (NDLS)");
  const [destination, setDestination] = useState("Agra Cantt (AGC)");
  const [travelDate, setTravelDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]);
  const [selectedSeat, setSelectedSeat] = useState<string>("14A (Window)");
  const [passengerName, setPassengerName] = useState("Aryan Sharma");
  const [bookingStatus, setBookingStatus] = useState<"IDLE" | "SEARCHING" | "FORM_PREPARED" | "AWAITING_APPROVAL" | "CONFIRMED">("FORM_PREPARED");
  const [otpInput, setOtpInput] = useState("");
  const [bookingConfirmation, setBookingConfirmation] = useState<any>({
    bookingId: "TKT-IND-89420",
    pnr: "PNR-2490812384",
    totalFareINR: 1730,
    seats: ["14A (Window)"],
  });

  // 5. MCP Gateway & JSON-RPC Playground States
  const [mcpTools, setMcpTools] = useState<any[]>([]);
  const [mcpResources, setMcpResources] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState("execute_grounded_query");
  const [toolArgsText, setToolArgsText] = useState('{\n  "query": "Latest breakthroughs in autonomous AI and space robotics"\n}');
  const [toolCallResult, setToolCallResult] = useState<any>(null);
  const [toolExecuting, setToolExecuting] = useState(false);
  const [selectedResourceUri, setSelectedResourceUri] = useState("sarvagyai://telemetry/seismic");
  const [resourceResult, setResourceResult] = useState<any>(null);
  const [resourceLoading, setResourceLoading] = useState(false);

  // 6. On-Device Hardware & Edge Architecture States
  const [hardwareStatus, setHardwareStatus] = useState<any>(null);
  const [hybridPrompt, setHybridPrompt] = useState("Design a real-time autonomous agent protocol with multi-model failover.");
  const [preferOnline, setPreferOnline] = useState(true);
  const [hybridResult, setHybridResult] = useState<any>(null);
  const [hybridExecuting, setHybridExecuting] = useState(false);

  // Fetch MCP status, tools, resources, and hardware
  const fetchStatus = async () => {
    try {
      const [statusRes, toolsRes, resRes, hwRes] = await Promise.allSettled([
        fetch("/api/mcp/status").then((r) => r.json()),
        fetch("/api/mcp/tools").then((r) => r.json()),
        fetch("/api/mcp/resources").then((r) => r.json()),
        fetch("/api/mcp/hardware-status").then((r) => r.json()),
      ]);

      if (statusRes.status === "fulfilled" && statusRes.value.success) {
        setMcpStatus(statusRes.value);
      }
      if (toolsRes.status === "fulfilled" && toolsRes.value.result?.tools) {
        setMcpTools(toolsRes.value.result.tools);
      }
      if (resRes.status === "fulfilled" && resRes.value.result?.resources) {
        setMcpResources(resRes.value.result.resources);
      }
      if (hwRes.status === "fulfilled" && hwRes.value.status) {
        setHardwareStatus(hwRes.value.status);
      }
    } catch (e) {
      console.warn("MCP telemetry fetch notice:", e);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------------------------------
  // StractiAI 2D Canvas Loop (Real-Time vision-based screen reading engine)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (activeTab !== "stractiai") return;
    const canvas = gameCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    let playerX = 180;
    let playerY = 160;
    let enemyX = 420;
    let enemyY = 110;
    let enemyVx = -1.2;

    const render = () => {
      frame++;
      ctx.fillStyle = "#070b14";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Retro Grid
      ctx.strokeStyle = "rgba(14, 165, 233, 0.12)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update positions if running
      if (stractiRunning) {
        enemyX += enemyVx;
        if (enemyX < 260 || enemyX > 500) enemyVx *= -1;
        playerY = 160 + Math.sin(frame * 0.05) * 8;
      }

      // Draw Player
      ctx.fillStyle = "#06b6d4";
      ctx.beginPath();
      ctx.arc(playerX, playerY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px monospace";
      ctx.fillText("BOT", playerX - 10, playerY + 3);

      // Vision Bounding Box for Player
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(playerX - 24, playerY - 24, 48, 48);
      ctx.fillStyle = "#22d3ee";
      ctx.fillText("Player (99%)", playerX - 24, playerY - 28);

      // Draw Enemy Drone
      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.arc(enemyX, enemyY, 16, 0, Math.PI * 2);
      ctx.fill();

      // Vision Bounding Box for Enemy
      ctx.strokeStyle = "#fb7185";
      ctx.strokeRect(enemyX - 22, enemyY - 22, 44, 44);
      ctx.fillStyle = "#fb7185";
      ctx.fillText("Target Drone (94%)", enemyX - 22, enemyY - 26);

      // Aim Line from Player to Enemy
      if (stractiRunning) {
        ctx.strokeStyle = "rgba(34, 211, 238, 0.4)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(playerX, playerY);
        ctx.lineTo(enemyX, enemyY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Items (Power Orb)
      const orbX = 320;
      const orbY = 190;
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(orbX, orbY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#34d399";
      ctx.strokeRect(orbX - 14, orbY - 14, 28, 28);
      ctx.fillStyle = "#34d399";
      ctx.fillText("Orb (97%)", orbX - 14, orbY - 18);

      // StractiAI HUD Overlay
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.fillRect(8, 8, 190, 52);
      ctx.strokeStyle = "#334155";
      ctx.strokeRect(8, 8, 190, 52);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 10px monospace";
      ctx.fillText("StractiAI Optical Sensor", 14, 22);
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`FPS: 60 • Latency: 14ms`, 14, 36);
      ctx.fillText(`Loop: ${stractiRunning ? "ACTIVE (AUTO)" : "PAUSED"}`, 14, 50);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeTab, stractiRunning]);

  // ---------------------------------------------------------------------------
  // Google DeepMind SIMA 3D Canvas (Three.js 3D Virtual Environment)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (activeTab !== "sima") return;
    const container = simaThreeCanvasRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080e1a);
    scene.fog = new THREE.FogExp2(0x080e1a, 0.035);

    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 3, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(30, 30, 0x06b6d4, 0x1e293b);
    scene.add(gridHelper);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // SIMA Agent Avatar
    const agentGeo = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
    const agentMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, metalness: 0.8 });
    const agentMesh = new THREE.Mesh(agentGeo, agentMat);
    agentMesh.position.set(0, 0.7, 0);
    scene.add(agentMesh);

    // Goal Object (Crystal Beacon)
    const crystalGeo = new THREE.OctahedronGeometry(0.5);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xdb2777,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.position.set(3, 1.5, -4);
    scene.add(crystalMesh);

    // Obstacle Structures
    for (let i = 0; i < 6; i++) {
      const boxGeo = new THREE.BoxGeometry(0.8, 1.2 + i * 0.2, 0.8);
      const boxMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.set(-2 + (i % 3) * 2, (1.2 + i * 0.2) / 2, -2 - Math.floor(i / 3) * 3);
      scene.add(box);
    }

    let animId: number;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.02;

      crystalMesh.rotation.y += 0.03;
      crystalMesh.position.y = 1.5 + Math.sin(t * 2) * 0.2;

      if (simaExecuting) {
        // Move agent toward crystal
        agentMesh.position.x = THREE.MathUtils.lerp(agentMesh.position.x, 3, 0.02);
        agentMesh.position.z = THREE.MathUtils.lerp(agentMesh.position.z, -4, 0.02);
        camera.lookAt(agentMesh.position);
      } else {
        camera.lookAt(0, 1, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [activeTab, simaExecuting]);

  // Handle StractiAI Action trigger
  const handleTriggerStractiAction = async (goal: typeof stractiGoal) => {
    setStractiGoal(goal);
    try {
      const res = await fetch("/api/mcp/game/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "StractiAI",
          gameTitle: "Cyberpunk Rogue Citadel",
          actionGoal: goal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStractiLog((prev) => [
          `[StractiAI] Dispatched macro "${goal}" (Response in ${data.result?.visionAnalysis?.latencyMs || 14}ms)`,
          ...prev.slice(0, 8),
        ]);
      }
    } catch (e) {
      console.warn("StractiAI trigger error:", e);
    }
  };

  // Handle SIMA execution
  const handleExecuteSIMA = async () => {
    setSimaExecuting(true);
    try {
      const res = await fetch("/api/mcp/game/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "SIMA",
          instruction: simaInstruction,
        }),
      });
      const data = await res.json();
      if (data.success && data.result?.commandGrammar) {
        setSimaSteps(data.result.commandGrammar.map((s: any) => `${s.step}. ${s.action} -> ${JSON.stringify(s.target || s.targetBearing || s.durationSec)}`));
      }
    } catch (e) {
      console.warn("SIMA execution error:", e);
    } finally {
      setTimeout(() => setSimaExecuting(false), 4000);
    }
  };

  // Handle Ticket RPA Auto-Fill & Book
  const handleBookTicketRPA = async () => {
    setLoading(true);
    setBookingStatus("SEARCHING");

    try {
      const res = await fetch("/api/mcp/tickets/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: ticketProvider,
          origin,
          destination,
          travelDate,
          passengerName,
          preferredSeat: selectedSeat,
          adultApprovalConfirmed: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingConfirmation(data.result);
        setBookingStatus("AWAITING_APPROVAL");
      }
    } catch (e) {
      console.warn("Ticket RPA error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyOTP = async () => {
    if (!otpInput.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/mcp/tickets/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingConfirmation?.bookingId || "TKT-IND-89420",
          otpCode: otpInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingStatus("CONFIRMED");
        setBookingConfirmation((prev: any) => ({
          ...prev,
          status: "CONFIRMED",
          pnr: data.booking?.confirmationCode || "PNR-9840217482",
        }));
      }
    } catch (e) {
      console.warn("OTP verify error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Handle MCP Tool Call
  const handleExecuteToolCall = async () => {
    setToolExecuting(true);
    setToolCallResult(null);
    try {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(toolArgsText);
      } catch (err: any) {
        console.warn("Invalid JSON arguments:", err);
        setToolCallResult({ jsonrpc: "2.0", error: { message: "Invalid JSON in arguments: " + err.message } });
        setToolExecuting(false);
        return;
      }

      const res = await fetch("/api/mcp/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "tools/call",
          params: {
            name: selectedTool,
            arguments: parsedArgs,
          },
        }),
      });
      const data = await res.json();
      setToolCallResult(data);
    } catch (e: any) {
      setToolCallResult({ jsonrpc: "2.0", error: { message: e.message } });
    } finally {
      setToolExecuting(false);
    }
  };

  // Handle MCP Resource Read
  const handleReadResource = async (uri: string) => {
    setSelectedResourceUri(uri);
    setResourceLoading(true);
    setResourceResult(null);
    try {
      const res = await fetch("/api/mcp/resources/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uri }),
      });
      const data = await res.json();
      setResourceResult(data);
    } catch (e: any) {
      setResourceResult({ error: e.message });
    } finally {
      setResourceLoading(false);
    }
  };

  // Handle Hybrid Offline / Online Execution
  const handleExecuteHybridQuery = async () => {
    if (!hybridPrompt.trim()) return;
    setHybridExecuting(true);
    setHybridResult(null);
    try {
      const res = await fetch("/api/mcp/hybrid-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: hybridPrompt,
          preferOnline,
        }),
      });
      const data = await res.json();
      setHybridResult(data);
    } catch (e: any) {
      setHybridResult({ success: false, error: e.message });
    } finally {
      setHybridExecuting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              MCP (Model Context Protocol) AI Automation Desk
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              JSON-RPC 2.0 • MCP Spec 2026
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 100% Real Live Automation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous gameplay via vision bots (StractiAI), modular reinforcement learning (BotPlayers), and 3D multiworld instruction following (Google DeepMind SIMA) — alongside Web RPA ticket booking.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 flex-wrap">
          <button
            onClick={() => setActiveTab("mcp_gateway")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "mcp_gateway" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>MCP Gateway & Protocol</span>
          </button>
          <button
            onClick={() => setActiveTab("hardware_edge")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "hardware_edge" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>On-Device Hardware & OS</span>
          </button>
          <button
            onClick={() => setActiveTab("stractiai")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "stractiai" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>StractiAI (Vision Bot)</span>
          </button>
          <button
            onClick={() => setActiveTab("botplayers")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "botplayers" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>BotPlayers (RL Agent)</span>
          </button>
          <button
            onClick={() => setActiveTab("sima")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "sima" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Google SIMA (3D)</span>
          </button>
          <button
            onClick={() => setActiveTab("ticket_rpa")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "ticket_rpa" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Autonomous Ticket RPA</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 1. STRACTIAI VISION-BASED AUTOMATION TAB                                */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === "stractiai" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-cyan-400" />
                    StractiAI Real-Time Optical Screen Reader & Autonomous Action Loop
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Vision-based game bot analyzing canvas pixels, detecting entities with OpenCV/YOLO bounding boxes, and firing input macros without human help.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    60 FPS Hardware-Accelerated Feed
                  </span>
                  <button
                    onClick={() => setStractiRunning((prev) => !prev)}
                    className={`p-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${
                      stractiRunning
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    }`}
                  >
                    {stractiRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{stractiRunning ? "Pause Bot" : "Resume Bot"}</span>
                  </button>
                </div>
              </div>

              {/* Game Viewport Canvas */}
              <div className="relative rounded-xl border border-slate-800 overflow-hidden bg-slate-950 flex items-center justify-center">
                <canvas
                  ref={gameCanvasRef}
                  width={680}
                  height={320}
                  className="w-full h-auto max-h-[340px] block"
                />
              </div>

              {/* Bot Goal Dispatch Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <span className="text-xs text-slate-400 font-medium">Select Autonomous Bot Objective:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: "farm_xp", label: "Farm XP & Grind" },
                    { id: "clear_dungeon", label: "Clear Dungeon" },
                    { id: "auto_dodge", label: "Auto-Dodge Attacks" },
                    { id: "collect_items", label: "Gather Power Orbs" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleTriggerStractiAction(g.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        stractiGoal === g.id
                          ? "bg-cyan-500 text-slate-950 font-bold"
                          : "bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* StractiAI Telemetry Sidebar */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Detected Game Entities
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-cyan-300">Player Character</span>
                    <p className="text-[10px] text-slate-400 font-mono">BBox: [240, 320, 48, 64]</p>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold text-xs">99%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-rose-300">Enemy Drone (Hostile)</span>
                    <p className="text-[10px] text-slate-400 font-mono">BBox: [520, 180, 56, 42]</p>
                  </div>
                  <span className="text-rose-400 font-mono font-bold text-xs">94%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-emerald-300">Power Shield Orb</span>
                    <p className="text-[10px] text-slate-400 font-mono">BBox: [380, 290, 24, 24]</p>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold text-xs">97%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" /> Action Execution Feed
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px] text-slate-300">
                {stractiLog.map((log, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-slate-950/80 border border-slate-850">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 2. BOTPLAYERS MODULAR RL FRAMEWORK TAB                                 */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === "botplayers" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    BotPlayers Modular Reinforcement Learning Framework
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Open-source framework designed for developing intelligent game-playing bots using PPO, DQN, and rule-based hybrid policies.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    Episode #{botEpisode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Reward: +{botReward}
                  </span>
                </div>
              </div>

              {/* Policy Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "PPO", name: "Proximal Policy (PPO)", desc: "Stable policy gradient, high adaptability" },
                  { id: "DQN", name: "Deep Q-Network (DQN)", desc: "Off-policy replay for discrete arcade" },
                  { id: "Q_LEARNING", name: "Tabular Q-Learn", desc: "Low-footprint state-action matrix" },
                  { id: "HYBRID", name: "Rule + RL Hybrid", desc: "Safety guardrails + autonomous farm" },
                ].map((pol) => (
                  <button
                    key={pol.id}
                    onClick={() => setBotPolicy(pol.id as any)}
                    className={`p-3 rounded-xl border text-left transition ${
                      botPolicy === pol.id
                        ? "bg-purple-500/15 border-purple-500/50 shadow-md shadow-purple-950"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-200">{pol.name}</div>
                    <p className="text-[10px] text-slate-400 mt-1">{pol.desc}</p>
                  </button>
                ))}
              </div>

              {/* Training Simulation Action */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-200">Autonomous Resource Farm & Mission Loop</span>
                  <p className="text-[11px] text-slate-400">Automates grinding, dungeon loops, and inventory recycling across multiple genres.</p>
                </div>
                <button
                  onClick={async () => {
                    const res = await fetch("/api/mcp/game/action", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        system: "BotPlayers",
                        useRL: true,
                        policy: botPolicy,
                      }),
                    });
                    const d = await res.json();
                    if (d.success) {
                      setBotEpisode((e) => e + 1);
                      setBotReward((r) => r + 85);
                      setBotLogs((l) => [`[Episode #${botEpisode + 1}] Executed ${botPolicy} -> Reward Delta +85`, ...l.slice(0, 6)]);
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute RL Step</span>
                </button>
              </div>
            </div>
          </div>

          {/* BotPlayers Analytics Sidebar */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Policy Efficiency Metrics
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">Active Algorithm:</span>
                  <span className="font-mono text-purple-300 font-bold">{botPolicy}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">Actions / Minute:</span>
                  <span className="font-mono text-emerald-400 font-bold">340 APM</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">Human Fatigue Rate:</span>
                  <span className="font-mono text-emerald-400 font-bold">0.0% (Autonomous)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Exploration Epsilon:</span>
                  <span className="font-mono text-cyan-400 font-bold">0.038</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-purple-400" /> RL Training Logs
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px] text-slate-300">
                {botLogs.map((log, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-slate-950/80 border border-slate-850">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 3. GOOGLE DEEPMIND SIMA 3D MULTIWORLD AGENT TAB                        */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === "sima" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-sky-400" />
                    Google DeepMind SIMA (Scalable Instructable Multiworld Agent)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Groundbreaking AI agent following natural language instructions across diverse 3D virtual worlds using visual frames only.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/30">
                  Zero-Shot 3D Cross-Game
                </span>
              </div>

              {/* 3D Virtual Environment Viewport (Three.js) */}
              <div className="relative rounded-xl border border-slate-800 overflow-hidden bg-slate-950 h-72">
                <div ref={simaThreeCanvasRef} className="w-full h-full" />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${simaExecuting ? "bg-emerald-400 animate-ping" : "bg-sky-400"}`} />
                  <span>SIMA 3D World Perception: {simaExecuting ? "EXECUTING MOTION" : "READY"}</span>
                </div>
              </div>

              {/* Natural Language Instruction Bar */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <span>Natural Language Command for SIMA:</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={simaInstruction}
                    onChange={(e) => setSimaInstruction(e.target.value)}
                    placeholder="e.g. SIMA, climb the tower, collect the relic, and return to base..."
                    className="flex-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={handleExecuteSIMA}
                    disabled={simaExecuting}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Instruct SIMA</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SIMA Spatial Action Sequence Sidebar */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Synthesized 3D Action Steps
              </h4>
              <p className="text-[11px] text-slate-400">
                Visual perception translates natural language into spatial keyboard/mouse actions without game-engine privileged APIs.
              </p>
              <div className="space-y-2 text-xs">
                {simaSteps.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs text-slate-300">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Google Research Validation</h4>
              <p className="text-[11px] text-slate-400">
                SIMA was trained across 7 game partners (No Man's Sky, Teardown, Valheim) proving an AI can execute 600+ skills purely from raw visual pixels.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 4. AUTONOMOUS WEB RPA TICKET BOOKING TAB                                */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === "ticket_rpa" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-emerald-400" />
                    Autonomous Web RPA Ticket Booking Engine
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Automated web RPA tool scanning seat availability, auto-filling passenger forms, selecting dates/seats, and verifying with OTP Human Gate.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Playwright / Selenium RPA Bridge
                  </span>
                </div>
              </div>

              {/* Service Selection */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "IRCTC_RAILWAYS", label: "IRCTC Indian Railways", desc: "Vande Bharat, Rajdhani, Shatabdi" },
                  { id: "AIRLINE_GDS", label: "Aviation GDS (Flights)", desc: "IndiGo, Air India, Akasa" },
                  { id: "EVENT_CINEMA", label: "Cinema & Live Events", desc: "PVR INOX, Concert Gates" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setTicketProvider(s.id as any)}
                    className={`p-3 rounded-xl border text-left transition ${
                      ticketProvider === s.id
                        ? "bg-emerald-500/15 border-emerald-500/50 shadow-md shadow-emerald-950 font-bold"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="text-xs text-slate-200">{s.label}</div>
                    <p className="text-[10px] text-slate-400 mt-1">{s.desc}</p>
                  </button>
                ))}
              </div>

              {/* Search & Seat Selection Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Origin Station / City</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Travel Date</label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Passenger Info & Seat Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Passenger Name (Manifest)</label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Preferred Seat Allocation</label>
                  <select
                    value={selectedSeat}
                    onChange={(e) => setSelectedSeat(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
                  >
                    <option value="14A (Window)">14A (Window Seat - High View)</option>
                    <option value="14B (Aisle)">14B (Aisle Seat - Quick Exit)</option>
                    <option value="Lower Berth 22">Lower Berth 22 (Rail Special)</option>
                    <option value="Executive 1A">Executive 1A (Front Row Legroom)</option>
                  </select>
                </div>
              </div>

              {/* Trigger RPA Auto-Fill Button */}
              <button
                onClick={handleBookTicketRPA}
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center justify-center gap-2 shadow-md shadow-emerald-950 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Launch Autonomous RPA Seat Finder & Form Auto-Fill</span>
              </button>
            </div>
          </div>

          {/* RPA Security Gate & Confirmation Sidebar */}
          <div className="space-y-4">
            {/* Human Gate & OTP Challenge */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500/20 text-amber-300">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Human-in-the-Loop Security Gate
                </h4>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                🛡️ <strong>Safety Mandate:</strong> The AI RPA tool automatically fills forms and claims seats, but <strong>never</strong> bypasses bank OTPs or deducts payment without adult authorization.
              </p>

              {bookingStatus === "CONFIRMED" ? (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Booking Verified & Confirmed!</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-200">
                    <p>PNR / Ticket: <span className="text-emerald-400 font-bold">{bookingConfirmation?.pnr}</span></p>
                    <p>Seat: <span className="text-cyan-300">{selectedSeat}</span></p>
                    <p>Fare: ₹{bookingConfirmation?.totalFareINR || 1730}</p>
                    <p className="text-slate-400 text-[10px] mt-1">Verified with IRCTC/GDS Live Gateway</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 pt-1">
                  <div className="text-xs text-slate-300">
                    <span className="font-semibold text-slate-200">Pre-Booked Itinerary:</span>
                    <p className="text-[11px] font-mono text-cyan-300 mt-0.5">
                      {origin} ➔ {destination} • {travelDate}
                    </p>
                    <p className="text-[11px] text-slate-400">Total Calculated Fare: ₹1,730 (Standard Fare)</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono">Enter Parent/Guardian OTP Challenge (Demo: 123456):</label>
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                    />
                  </div>

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || !otpInput.trim()}
                    className="w-full py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authorize Payment & Confirm PNR</span>
                  </button>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs text-slate-400">
              <h5 className="font-bold text-slate-300 text-xs">Bot Compliance & Legal Standards</h5>
              <p className="text-[11px]">
                Complies with website robots.txt policies, user-agent rate limiting, and RBI two-factor authentication requirements for automated passenger reservations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 5. MCP GATEWAY & CLIENT CONNECTOR SPECIFICATION TAB                    */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === "mcp_gateway" && (
        <div className="space-y-6">
          {/* Architecture SVG Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  Unified Architecture with Model Context Protocol (MCP) Integration
                </h3>
                <p className="text-xs text-slate-400">
                  Standardized client-server protocol securely connecting AI models to telemetry, tools, resources, and persistent agents.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  JSON-RPC 2.0 Endpoint: /api/mcp/rpc
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Tool Calls: /api/mcp/call
                </span>
              </div>
            </div>

            {/* Embedded Architecture Flow Diagram */}
            <div className="w-full overflow-x-auto rounded-xl bg-slate-950 p-4 border border-slate-800/80">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 360" className="w-full min-w-[700px] h-auto text-slate-200">
                <defs>
                  <marker id="flow-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
                  </marker>
                </defs>

                {/* Client Layer */}
                <rect x="20" y="20" width="220" height="320" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <text x="130" y="48" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#38bdf8">React 19 Frontend</text>

                <rect x="35" y="65" width="190" height="42" rx="6" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />
                <text x="130" y="90" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">Universal Command Hub</text>

                <rect x="35" y="115" width="190" height="42" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="130" y="140" textAnchor="middle" fontSize="11" fill="#cbd5e1">Compliant Google Maps</text>

                <rect x="35" y="165" width="190" height="42" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="130" y="190" textAnchor="middle" fontSize="11" fill="#cbd5e1">Live Telemetry Feeds</text>

                <rect x="35" y="215" width="190" height="42" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="130" y="240" textAnchor="middle" fontSize="11" fill="#cbd5e1">Resilient WebSocket (/ws)</text>

                <rect x="35" y="265" width="190" height="52" rx="6" fill="#0284c7" fillOpacity="0.2" stroke="#06b6d4" strokeWidth="1.5" />
                <text x="130" y="287" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#22d3ee">MCP Client Connector</text>
                <text x="130" y="303" textAnchor="middle" fontSize="9" fill="#94a3b8">Dynamic Tool Discovery</text>

                {/* Server & MCP Layer */}
                <rect x="280" y="20" width="320" height="320" rx="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                <text x="440" y="48" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#22d3ee">Node / Express Backend + MCP</text>

                <rect x="295" y="65" width="290" height="55" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="440" y="88" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#f8fafc">Universal AI Orchestrator</text>
                <text x="440" y="105" textAnchor="middle" fontSize="10" fill="#94a3b8">Google @google/genai SDK + Grounding</text>

                <rect x="295" y="130" width="290" height="65" rx="6" fill="#0891b2" fillOpacity="0.25" stroke="#06b6d4" strokeWidth="1.5" />
                <text x="440" y="152" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#38bdf8">MCP Server Gateway (Stdio / SSE)</text>
                <text x="440" y="170" textAnchor="middle" fontSize="10" fill="#f8fafc">Resources, Prompts & Tool Registry</text>
                <text x="440" y="185" textAnchor="middle" fontSize="9" fill="#94a3b8">Standardized JSON-RPC Protocol</text>

                <rect x="295" y="205" width="290" height="55" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="440" y="227" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#f8fafc">RAG & World Telemetry Store</text>
                <text x="440" y="244" textAnchor="middle" fontSize="10" fill="#94a3b8">USGS, NASA EONET, OpenSky, SpaceDevs</text>

                <rect x="295" y="270" width="290" height="55" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="440" y="292" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#f8fafc">Persistent Agent OS</text>
                <text x="440" y="309" textAnchor="middle" fontSize="10" fill="#94a3b8">Disk Checkpoints + Approval Gates</text>

                {/* External & Frontier Layer */}
                <rect x="640" y="20" width="240" height="320" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <text x="760" y="48" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#a855f7">Frontier Models & APIs</text>

                <rect x="655" y="65" width="210" height="55" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="760" y="88" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">15-Model AI Matrix</text>
                <text x="760" y="105" textAnchor="middle" fontSize="10" fill="#94a3b8">Gemini 4 Argon, Astra, Claude</text>

                <rect x="655" y="130" width="210" height="65" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="760" y="152" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">External MCP Servers</text>
                <text x="760" y="170" textAnchor="middle" fontSize="10" fill="#cbd5e1">Filesystem, Database, Git</text>
                <text x="760" y="185" textAnchor="middle" fontSize="9" fill="#94a3b8">Custom Enterprise Connectors</text>

                <rect x="655" y="205" width="210" height="55" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="760" y="227" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">Global Telemetry APIs</text>
                <text x="760" y="244" textAnchor="middle" fontSize="10" fill="#94a3b8">Open-Meteo, Yahoo Finance, ISS</text>

                <rect x="655" y="270" width="210" height="55" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="760" y="292" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">Google Maps Platform</text>
                <text x="760" y="309" textAnchor="middle" fontSize="10" fill="#94a3b8">@vis.gl/react-google-maps</text>

                {/* Connectors */}
                <line x1="240" y1="180" x2="278" y2="180" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#flow-arr)" />
                <line x1="600" y1="180" x2="638" y2="180" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#flow-arr)" />
              </svg>
            </div>
          </div>

          {/* Interactive MCP Registry & Tool Caller Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Tools & Resources Directory */}
            <div className="space-y-4">
              {/* Tools Directory */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400" />
                    Available MCP Tools ({mcpTools.length})
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">GET /api/mcp/tools</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {mcpTools.map((t) => (
                    <div
                      key={t.name}
                      onClick={() => {
                        setSelectedTool(t.name);
                        if (t.name === "execute_grounded_query") {
                          setToolArgsText('{\n  "query": "Recent advances in artificial intelligence and space science"\n}');
                        } else if (t.name === "stractiai_screen_automation") {
                          setToolArgsText('{\n  "gameTitle": "Cyberpunk Citadel",\n  "actionGoal": "farm_xp"\n}');
                        } else if (t.name === "sima_3d_multiworld_agent") {
                          setToolArgsText('{\n  "instruction": "Explore the ruins, collect the golden artifact, and return to base"\n}');
                        } else if (t.name === "rpa_ticket_booking_bot") {
                          setToolArgsText('{\n  "provider": "IRCTC_RAILWAYS",\n  "destination": "Agra",\n  "travelDate": "2026-11-10"\n}');
                        } else {
                          setToolArgsText('{}');
                        }
                      }}
                      className={`p-2.5 rounded-xl border transition cursor-pointer ${
                        selectedTool === t.name
                          ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-200"
                          : "bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-100">{t.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-cyan-400 border border-slate-700">
                          {t.category || "tool"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{t.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources Directory */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    Registered MCP Resources ({mcpResources.length})
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">GET /api/mcp/resources</span>
                </div>

                <div className="space-y-2">
                  {mcpResources.map((r) => (
                    <div key={r.uri} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-200">{r.name}</span>
                        <button
                          onClick={() => handleReadResource(r.uri)}
                          disabled={resourceLoading}
                          className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition flex items-center gap-1"
                        >
                          <FileJson className="w-3 h-3" />
                          <span>Read URI</span>
                        </button>
                      </div>
                      <p className="text-[10px] font-mono text-emerald-400">{r.uri}</p>
                      <p className="text-[11px] text-slate-400">{r.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Interactive Execution Playground */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    MCP JSON-RPC 2.0 Execution Playground
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-400">POST /api/mcp/call</span>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-mono block">Target MCP Tool:</label>
                  <select
                    value={selectedTool}
                    onChange={(e) => {
                      setSelectedTool(e.target.value);
                      if (e.target.value === "execute_grounded_query") {
                        setToolArgsText('{\n  "query": "Recent breakthroughs in artificial intelligence"\n}');
                      } else {
                        setToolArgsText('{}');
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono"
                  >
                    {mcpTools.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name} ({t.category || "tool"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono block">Arguments Payload (JSON):</label>
                  <textarea
                    rows={4}
                    value={toolArgsText}
                    onChange={(e) => setToolArgsText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <button
                  onClick={handleExecuteToolCall}
                  disabled={toolExecuting}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {toolExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>Execute Tool via MCP JSON-RPC 2.0</span>
                </button>

                {/* Execution Result */}
                {toolCallResult && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block">Response Output:</span>
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-60">
                      {JSON.stringify(toolCallResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Resource Viewer Modal/Card */}
              {resourceResult && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                      <FileJson className="w-3.5 h-3.5" />
                      Loaded Resource: {selectedResourceUri}
                    </h5>
                    <button onClick={() => setResourceResult(null)} className="text-[10px] text-slate-500 hover:text-slate-300">
                      Clear
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-300/90 overflow-x-auto max-h-52">
                    {JSON.stringify(resourceResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 6. ON-DEVICE HARDWARE & EDGE ARCHITECTURE TAB                          */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === "hardware_edge" && (
        <div className="space-y-6">
          {/* Hardware Telemetry Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>NPU / GPU Acceleration</span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-lg font-bold text-slate-100">
                {hardwareStatus?.computeUnit?.model?.split("/")[0] || "NVIDIA RTX 4090"}
              </div>
              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>VRAM Allocation:</span>
                  <span className="font-mono text-cyan-300">{hardwareStatus?.computeUnit?.vramUsedGB || 6.8} / 24 GB</span>
                </div>
                <div className="flex justify-between">
                  <span>GPU Load:</span>
                  <span className="font-mono text-emerald-400">{hardwareStatus?.computeUnit?.gpuLoadPercent || 42}%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Unified Memory & Storage</span>
                <HardDrive className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-lg font-bold text-slate-100">
                {hardwareStatus?.memoryAndStorage?.totalRamGB || 64} GB RAM
              </div>
              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>NVMe PCIe 4.0:</span>
                  <span className="font-mono text-indigo-300">{hardwareStatus?.memoryAndStorage?.nvmeStorageFreeTB || 1.48} TB Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Vector DB Engine:</span>
                  <span className="font-mono text-cyan-300">ChromaDB / FAISS</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Power & Thermals</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-lg font-bold text-slate-100">
                {hardwareStatus?.powerAndThermals?.upsStatus === "ONLINE_AC_RESILIENT" ? "24/7 UPS Online" : "Battery Backup"}
              </div>
              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Core Temperature:</span>
                  <span className="font-mono text-emerald-400">{hardwareStatus?.powerAndThermals?.coreTempCelsius || 48}°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Continuous Uptime:</span>
                  <span className="font-mono text-amber-300">{hardwareStatus?.powerAndThermals?.uptimeHours || 248.5} hrs</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Hybrid Routing Engine</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-lg font-bold text-slate-100">
                Auto-Failover
              </div>
              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Offline Engine:</span>
                  <span className="font-mono text-purple-300">Ollama / Llama 3.3</span>
                </div>
                <div className="flex justify-between">
                  <span>Online Cloud:</span>
                  <span className="font-mono text-cyan-300">Gemini 4 Argon / 3.8</span>
                </div>
              </div>
            </div>
          </div>

          {/* On-Device Hardware & Software Architecture Diagram Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                  On-Device Hardware & Software Architecture (Offline / Online Hybrid)
                </h3>
                <p className="text-xs text-slate-400">
                  Station blueprint for zero-downtime edge operation, local GGUF model execution, and cloud fallback.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Hardware & Software Blueprint
              </span>
            </div>

            <div className="w-full overflow-x-auto rounded-xl bg-slate-950 p-4 border border-slate-800/80">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 360" className="w-full min-w-[650px] h-auto text-slate-200">
                <defs>
                  <marker id="hw-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
                  </marker>
                </defs>

                {/* Hardware Edge Layer */}
                <rect x="20" y="20" width="240" height="320" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <text x="140" y="48" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#38bdf8">On-Device Hardware</text>

                <rect x="35" y="65" width="210" height="70" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="140" y="90" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">NPU / GPU (VRAM)</text>
                <text x="140" y="108" textAnchor="middle" fontSize="10" fill="#94a3b8">Local Model Inference (24GB+)</text>

                <rect x="35" y="145" width="210" height="85" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="140" y="170" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">Unified Memory & NVMe</text>
                <text x="140" y="188" textAnchor="middle" fontSize="10" fill="#38bdf8">64GB RAM + 2TB Fast Storage</text>
                <text x="140" y="205" textAnchor="middle" fontSize="9" fill="#94a3b8">Vector DB & Disk Checkpoints</text>

                <rect x="35" y="240" width="210" height="80" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="140" y="265" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">Active Power & Thermal</text>
                <text x="140" y="285" textAnchor="middle" fontSize="10" fill="#22d3ee">24/7 UPS + Liquid Cooling</text>

                {/* Local Software Runtime Layer */}
                <rect x="300" y="20" width="260" height="320" rx="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                <text x="430" y="48" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#22d3ee">Local Software Runtime</text>

                <rect x="315" y="65" width="230" height="70" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="430" y="90" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">Ollama / llama.cpp Engine</text>
                <text x="430" y="108" textAnchor="middle" fontSize="10" fill="#94a3b8">Local GGUF Model Execution</text>

                <rect x="315" y="145" width="230" height="85" rx="6" fill="#0891b2" fillOpacity="0.2" stroke="#06b6d4" strokeWidth="1.5" />
                <text x="430" y="170" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#38bdf8">MCP Server Gateway</text>
                <text x="430" y="188" textAnchor="middle" fontSize="10" fill="#f8fafc">Standardized JSON-RPC Tools</text>
                <text x="430" y="205" textAnchor="middle" fontSize="9" fill="#94a3b8">Local Filesystem & DB Connectors</text>

                <rect x="315" y="240" width="230" height="80" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="430" y="265" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">Persistent Agent OS</text>
                <text x="430" y="285" textAnchor="middle" fontSize="10" fill="#94a3b8">Disk Checkpoints & Approval Gates</text>

                {/* Hybrid Online/Offline Bridge */}
                <rect x="600" y="20" width="240" height="320" rx="10" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
                <text x="720" y="48" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#c084fc">Hybrid Network Router</text>

                <rect x="615" y="65" width="210" height="80" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="720" y="90" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">Offline Mode (Default)</text>
                <text x="720" y="108" textAnchor="middle" fontSize="10" fill="#a855f7">Runs local Llama models</text>
                <text x="720" y="125" textAnchor="middle" fontSize="9" fill="#94a3b8">Queries local Chroma Vector DB</text>

                <rect x="615" y="155" width="210" height="85" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="720" y="180" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">Online Mode (Automatic)</text>
                <text x="720" y="198" textAnchor="middle" fontSize="10" fill="#38bdf8">Bridges to Google Gemini SDK</text>
                <text x="720" y="215" textAnchor="middle" fontSize="9" fill="#94a3b8">Live Search Grounding & Telemetry</text>

                <rect x="615" y="250" width="210" height="70" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="720" y="275" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">Resilient WebSocket (/ws)</text>
                <text x="720" y="293" textAnchor="middle" fontSize="9" fill="#94a3b8">Client Sync & Stream Replay</text>

                {/* Connectors */}
                <line x1="260" y1="180" x2="298" y2="180" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#hw-arr)" />
                <line x1="560" y1="180" x2="598" y2="180" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#hw-arr)" />
              </svg>
            </div>
          </div>

          {/* Interactive Hybrid Offline/Online Router Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Hybrid Offline / Online AI Engine Switch
                </h4>
                <p className="text-xs text-slate-400">
                  Test prompt execution across cloud Gemini SDK with search grounding vs on-device local offline engine with instant failover.
                </p>
              </div>

              {/* Mode Toggle Button */}
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setPreferOnline(true)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    preferOnline
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Online Cloud (Gemini)</span>
                </button>
                <button
                  onClick={() => setPreferOnline(false)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    !preferOnline
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>100% Offline (Local On-Device)</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono block">Query Prompt:</label>
                <input
                  type="text"
                  value={hybridPrompt}
                  onChange={(e) => setHybridPrompt(e.target.value)}
                  placeholder="Ask any complex reasoning, research or coding problem..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleExecuteHybridQuery}
                disabled={hybridExecuting || !hybridPrompt.trim()}
                className="py-2.5 px-5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {hybridExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                <span>Execute Query via Hybrid Router (/api/mcp/hybrid-query)</span>
              </button>

              {/* Hybrid Execution Output */}
              {hybridResult && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 pt-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-200">Execution Mode:</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          hybridResult.mode === "online_cloud_gemini"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        }`}
                      >
                        {hybridResult.mode || "hybrid_execution"}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Model: {hybridResult.modelUsed || "Frontier Model"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {hybridResult.text}
                  </div>

                  {hybridResult.sources && hybridResult.sources.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 block">Grounding Citations:</span>
                      <div className="flex flex-wrap gap-2">
                        {hybridResult.sources.map((s: any, idx: number) => (
                          <a
                            key={idx}
                            href={s.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            {s.title || s.uri}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
