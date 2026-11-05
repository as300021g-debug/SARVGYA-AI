// ============================================================================
// SARVAGYA AI — SCIENTIFIC SIMULATION ENGINE
// Real mathematical simulation canvas with variable parameters & formula analysis
// ============================================================================

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Sliders, Info, Activity, Zap, CheckCircle2 } from "lucide-react";
import { SimulationConfig } from "./types.ts";

interface ScientificSimulationProps {
  config?: SimulationConfig;
  defaultPreset?: "pendulum" | "orbital_velocity" | "enzyme_kinetics" | "wave_interference";
}

export const PRESET_SIMULATIONS: Record<string, SimulationConfig> = {
  pendulum: {
    id: "pendulum",
    title: "Harmonic Oscillator & Simple Pendulum",
    subject: "physics",
    description: "Evaluates second-order differential equation θ''(t) + (g/L)sin(θ) = -bθ' with air damping.",
    variables: [
      { id: "length", label: "String Length (L)", min: 0.5, max: 4.0, step: 0.1, defaultValue: 2.0, unit: "m" },
      { id: "gravity", label: "Gravitational Acceleration (g)", min: 1.6, max: 24.8, step: 0.1, defaultValue: 9.8, unit: "m/s²" },
      { id: "damping", label: "Damping Coefficient (b)", min: 0.0, max: 0.5, step: 0.01, defaultValue: 0.05, unit: "N·s/m" },
      { id: "mass", label: "Bob Mass (m)", min: 0.1, max: 5.0, step: 0.1, defaultValue: 1.0, unit: "kg" },
    ],
    formulaDescription: "T = 2π√(L/g) [Small angle approximation] • E_total = ½mv² + mgh",
    isExperimental: false,
  },
  orbital_velocity: {
    id: "orbital_velocity",
    title: "Orbital Mechanics & Escape Velocity",
    subject: "astronomy",
    description: "Calculates orbital velocity v = √(GM/r) and Keplerian orbital period around planetary mass.",
    variables: [
      { id: "altitude", label: "Orbital Altitude (h)", min: 200, max: 36000, step: 100, defaultValue: 400, unit: "km" },
      { id: "planetMass", label: "Central Mass Ratio (M/M_earth)", min: 0.1, max: 10.0, step: 0.1, defaultValue: 1.0, unit: "M⊕" },
      { id: "eccentricity", label: "Orbital Eccentricity (e)", min: 0.0, max: 0.8, step: 0.02, defaultValue: 0.05, unit: "" },
    ],
    formulaDescription: "v_circ = √(G·M / (R + h)) • T = 2π√((R+h)³ / (G·M))",
    isExperimental: false,
  },
  enzyme_kinetics: {
    id: "enzyme_kinetics",
    title: "Michaelis-Menten Enzyme Kinetics",
    subject: "biology",
    description: "Simulates substrate saturation velocity V = (Vmax · [S]) / (Km + [S]).",
    variables: [
      { id: "vmax", label: "Maximum Velocity (Vmax)", min: 10, max: 200, step: 5, defaultValue: 100, unit: "μmol/min" },
      { id: "km", label: "Michaelis Constant (Km)", min: 1, max: 50, step: 1, defaultValue: 15, unit: "mM" },
      { id: "inhibitor", label: "Competitive Inhibitor ([I])", min: 0, max: 20, step: 1, defaultValue: 0, unit: "μM" },
    ],
    formulaDescription: "V = (V_max * [S]) / (K_m_apparent + [S]) where K_m_apparent = K_m(1 + [I]/K_i)",
    isExperimental: false,
  },
};

export const ScientificSimulation: React.FC<ScientificSimulationProps> = ({
  config: propConfig,
  defaultPreset = "pendulum",
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    propConfig?.id || defaultPreset
  );
  const activeConfig = propConfig || PRESET_SIMULATIONS[selectedPresetId] || PRESET_SIMULATIONS.pendulum;

  // Initialize variables
  const [varValues, setVarValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    activeConfig.variables.forEach((v) => {
      init[v.id] = v.defaultValue;
    });
    return init;
  });

  const [isRunning, setIsRunning] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset variables when preset changes
  useEffect(() => {
    const init: Record<string, number> = {};
    activeConfig.variables.forEach((v) => {
      init[v.id] = v.defaultValue;
    });
    setVarValues(init);
  }, [selectedPresetId, propConfig]);

  // Simulation physics loop on 2D Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Numerical state variables
    let theta = Math.PI / 4; // initial 45 deg angle
    let omega = 0; // angular velocity

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = "#060810";
      ctx.fillRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
      ctx.lineWidth = 1;
      const step = 30;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (isRunning) {
        const dt = 0.025 * speedMultiplier;
        time += dt;

        if (activeConfig.id === "pendulum") {
          const L = varValues.length || 2.0;
          const g = varValues.gravity || 9.8;
          const b = varValues.damping || 0.05;
          const m = varValues.mass || 1.0;

          // Runge-Kutta / Verlet-style step: theta'' = -(g/L)*sin(theta) - (b/m)*omega
          const alpha = -(g / L) * Math.sin(theta) - (b / m) * omega;
          omega += alpha * dt;
          theta += omega * dt;
        }
      }

      // Render Scene based on Simulation type
      if (activeConfig.id === "pendulum") {
        const originX = width / 2;
        const originY = 60;
        const visualLength = 120 * (varValues.length || 2.0) * 0.7;
        const bobX = originX + visualLength * Math.sin(theta);
        const bobY = originY + visualLength * Math.cos(theta);

        // Ceiling mount
        ctx.fillStyle = "#334155";
        ctx.fillRect(originX - 30, originY - 10, 60, 10);

        // String
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();

        // Mass Bob
        const bobRadius = 14 + (varValues.mass || 1.0) * 3;
        const grad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, bobRadius);
        grad.addColorStop(0, "#38bdf8");
        grad.addColorStop(1, "#0284c7");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#e0f2fe";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Waveform at bottom
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        const startX = 40;
        const endX = width - 40;
        const waveY = height - 50;
        for (let px = startX; px <= endX; px += 2) {
          const tOffset = (px - startX) * 0.03;
          const amp = 30 * Math.exp(-((varValues.damping || 0.05) / (varValues.mass || 1)) * tOffset);
          const py = waveY + amp * Math.sin(tOffset * Math.sqrt((varValues.gravity || 9.8) / (varValues.length || 2.0)) - time * 2);
          if (px === startX) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Wave baseline
        ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
        ctx.beginPath();
        ctx.moveTo(startX, waveY);
        ctx.lineTo(endX, waveY);
        ctx.stroke();
      } else if (activeConfig.id === "orbital_velocity") {
        const cx = width / 2;
        const cy = height / 2;
        const R = 45;
        const alt = varValues.altitude || 400;
        const orbitR = R + Math.min(140, alt / 150);
        const ecc = varValues.eccentricity || 0.05;

        // Central Planet
        const planetGrad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, R);
        planetGrad.addColorStop(0, "#38bdf8");
        planetGrad.addColorStop(1, "#1e3a8a");
        ctx.fillStyle = planetGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();

        // Orbit Ellipse
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.ellipse(cx, cy, orbitR * (1 + ecc), orbitR * (1 - ecc), 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Satellite
        const satAngle = time * (1.2 / Math.sqrt(orbitR * 0.03));
        const satR = (orbitR * (1 - ecc * ecc)) / (1 + ecc * Math.cos(satAngle));
        const satX = cx + satR * Math.cos(satAngle);
        const satY = cy + satR * Math.sin(satAngle);

        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(satX, satY, 6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Michaelis-Menten Curve
        const vmax = varValues.vmax || 100;
        const km = varValues.km || 15;
        const inh = varValues.inhibitor || 0;
        const kmApp = km * (1 + inh / 5);

        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 3;
        ctx.beginPath();
        const originX = 50;
        const originY = height - 40;
        const maxX = width - 40;

        for (let px = originX; px <= maxX; px += 4) {
          const sVal = (px - originX) * 0.5; // [S]
          const v = (vmax * sVal) / (kmApp + sVal);
          const py = originY - (v / vmax) * (height - 90);
          if (px === originX) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Asymptote Vmax
        ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        const asymY = originY - (height - 90);
        ctx.moveTo(originX, asymY);
        ctx.lineTo(maxX, asymY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeConfig, varValues, isRunning, speedMultiplier]);

  // Derived real mathematical metrics
  const computedMetrics = React.useMemo(() => {
    if (activeConfig.id === "pendulum") {
      const L = varValues.length || 2.0;
      const g = varValues.gravity || 9.8;
      const period = 2 * Math.PI * Math.sqrt(L / g);
      const freq = 1 / period;
      return [
        { label: "Oscillation Period (T)", value: `${period.toFixed(2)} s` },
        { label: "Natural Frequency (f)", value: `${freq.toFixed(2)} Hz` },
        { label: "Restoring Force Constant", value: `${(g / L).toFixed(2)} s⁻²` },
      ];
    } else if (activeConfig.id === "orbital_velocity") {
      const altKm = varValues.altitude || 400;
      const rMeters = (6371 + altKm) * 1000;
      const GM = 3.986004418e14 * (varValues.planetMass || 1.0);
      const v = Math.sqrt(GM / rMeters);
      const vKmh = (v * 3.6).toFixed(0);
      const periodMins = ((2 * Math.PI * Math.sqrt(Math.pow(rMeters, 3) / GM)) / 60).toFixed(1);
      return [
        { label: "Orbital Velocity", value: `${(v / 1000).toFixed(2)} km/s (${vKmh} km/h)` },
        { label: "Orbital Period", value: `${periodMins} mins` },
        { label: "Orbital Radius", value: `${(rMeters / 1000).toFixed(0)} km` },
      ];
    } else {
      const vmax = varValues.vmax || 100;
      const km = varValues.km || 15;
      const inh = varValues.inhibitor || 0;
      const kmApp = km * (1 + inh / 5);
      return [
        { label: "Asymptotic V_max", value: `${vmax} μmol/min` },
        { label: "Apparent K_m", value: `${kmApp.toFixed(1)} mM` },
        { label: "Affinity Status", value: kmApp < 10 ? "High Affinity" : "Moderate Affinity" },
      ];
    }
  }, [activeConfig, varValues]);

  return (
    <div className="w-full border border-slate-800 bg-[#060810] text-slate-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 p-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 bg-emerald-500" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-100">
              {activeConfig.title}
            </h3>
            <span className="border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
              {activeConfig.subject.toUpperCase()}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{activeConfig.description}</p>
        </div>

        {/* Preset Selector */}
        {!propConfig && (
          <div className="flex items-center space-x-1 font-mono text-xs mt-2 sm:mt-0">
            {Object.keys(PRESET_SIMULATIONS).map((id) => (
              <button
                key={id}
                onClick={() => setSelectedPresetId(id)}
                className={`px-2.5 py-1 border transition-colors ${
                  selectedPresetId === id
                    ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                {PRESET_SIMULATIONS[id].title.split(" ")[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Left 2 Cols: Simulation Canvas & Controls */}
        <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col">
          {/* Canvas */}
          <div className="relative border border-slate-800 bg-black overflow-hidden flex-1 min-h-[300px]">
            <canvas ref={canvasRef} width={640} height={320} className="w-full h-full block" />
          </div>

          {/* Playback Toolbar */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80 font-mono text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 border ${
                  isRunning
                    ? "border-amber-500/50 bg-amber-950/30 text-amber-300"
                    : "border-emerald-500/50 bg-emerald-950/30 text-emerald-300"
                }`}
              >
                {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isRunning ? "PAUSE" : "RUN"}</span>
              </button>

              <button
                onClick={() => {
                  const init: Record<string, number> = {};
                  activeConfig.variables.forEach((v) => {
                    init[v.id] = v.defaultValue;
                  });
                  setVarValues(init);
                }}
                className="flex items-center space-x-1 px-2.5 py-1.5 border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>RESET</span>
              </button>
            </div>

            <div className="flex items-center space-x-1 text-[11px] text-slate-400">
              <span className="text-slate-500">SPEED:</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeedMultiplier(s)}
                  className={`px-2 py-0.5 border ${
                    speedMultiplier === s
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold"
                      : "border-slate-800 bg-slate-900 text-slate-500"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Sliders & Live Mathematical Telemetry */}
        <div className="p-4 space-y-4 font-mono">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase text-slate-300 mb-3">
              <Sliders className="h-3.5 w-3.5 text-emerald-400" />
              <span>DYNAMIC PARAMETERS</span>
            </div>

            <div className="space-y-3">
              {activeConfig.variables.map((v) => (
                <div key={v.id} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">{v.label}</span>
                    <span className="text-emerald-400 font-bold">
                      {varValues[v.id]} {v.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={v.min}
                    max={v.max}
                    step={v.step}
                    value={varValues[v.id] ?? v.defaultValue}
                    onChange={(e) =>
                      setVarValues({ ...varValues, [v.id]: parseFloat(e.target.value) })
                    }
                    className="w-full accent-emerald-500 cursor-pointer bg-slate-800"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Computed Physical Telemetry */}
          <div className="pt-3 border-t border-slate-800">
            <div className="text-[11px] font-bold uppercase text-slate-400 mb-2">
              REAL-TIME FORMULA TELEMETRY
            </div>
            <div className="space-y-1.5">
              {computedMetrics.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 border border-slate-800/80 bg-slate-950/60 text-xs"
                >
                  <span className="text-slate-400 text-[11px]">{m.label}</span>
                  <span className="text-cyan-300 font-bold">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formula Attribution */}
          <div className="p-2.5 border border-slate-800 bg-slate-950/40 text-[11px]">
            <div className="text-slate-400 font-bold flex items-center space-x-1 mb-1">
              <Info className="h-3 w-3 text-emerald-400" />
              <span>MATHEMATICAL PRINCIPLE:</span>
            </div>
            <div className="text-emerald-300 font-mono text-[10px] break-words">
              {activeConfig.formulaDescription}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
