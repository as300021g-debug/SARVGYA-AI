import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  Activity,
  Cpu,
  Dna,
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  Atom,
} from "lucide-react";
import { ScientificSimulation } from "./visual/ScientificSimulation.tsx";

export const InteractiveLabsModule: React.FC = () => {
  type LabType = "physics" | "chemistry" | "genetics" | "circuits" | "advanced_simulations";
  const [activeLab, setActiveLab] = useState<LabType>("physics");

  // Physics Simulation: Simple Harmonic Pendulum
  const [gravity, setGravity] = useState<number>(9.8);
  const [length, setLength] = useState<number>(2.0);
  const [pendulumAngle, setPendulumAngle] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Chemistry Compound Analysis Studio
  const [element1, setElement1] = useState("H2");
  const [element2, setElement2] = useState("O2");
  const [reactionResult, setReactionResult] = useState<string | null>(null);

  // Genetics: Monohybrid Punnett Square
  const [parent1, setParent1] = useState<"BB" | "Bb" | "bb">("Bb");
  const [parent2, setParent2] = useState<"BB" | "Bb" | "bb">("Bb");

  // Circuits: Digital Logic Gates
  const [gateType, setGateType] = useState<"AND" | "OR" | "XOR" | "NAND">("AND");
  const [inputA, setInputA] = useState<boolean>(true);
  const [inputB, setInputB] = useState<boolean>(false);

  // Pendulum animation loop
  useEffect(() => {
    if (!isSimulating || activeLab !== "physics") return;
    let animId: number;
    let startTime = Date.now();

    const loop = () => {
      const t = (Date.now() - startTime) / 1000;
      // omega = sqrt(g / L)
      const omega = Math.sqrt(gravity / Math.max(0.5, length));
      // theta(t) = theta0 * cos(omega * t)
      const theta = 35 * Math.cos(omega * t);
      setPendulumAngle(theta);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gravity, length, isSimulating, activeLab]);

  // Chemical Reactions dictionary
  const reactionMap: Record<string, { product: string; equation: string; enthalpy: string; notes: string }> = {
    "H2+O2": { product: "Water (H2O)", equation: "2H₂ + O₂ → 2H₂O", enthalpy: "-285.8 kJ/mol (Exothermic)", notes: "Rapid energetic combustion producing clean water vapor." },
    "Na+Cl2": { product: "Sodium Chloride (NaCl)", equation: "2Na + Cl₂ → 2NaCl", enthalpy: "-411.2 kJ/mol (Exothermic)", notes: "Vigorous reaction forming ionic crystalline table salt lattice." },
    "CH4+O2": { product: "Carbon Dioxide & Water", equation: "CH₄ + 2O₂ → CO₂ + 2H₂O", enthalpy: "-890.3 kJ/mol (Hydrocarbon Combustion)", notes: "Standard methane combustion releasing heat and light." },
    "N2+H2": { product: "Ammonia (NH3)", equation: "N₂ + 3H₂ ⇌ 2NH₃", enthalpy: "-92.4 kJ/mol (Haber Process)", notes: "Industrial catalytic synthesis at high pressure and moderate temperature." },
  };

  const handleSynthesizeReaction = () => {
    const key = `${element1}+${element2}`;
    const reverseKey = `${element2}+${element1}`;
    const found = reactionMap[key] || reactionMap[reverseKey];
    if (found) {
      setReactionResult(`${found.equation}\nProduct: ${found.product}\nΔH: ${found.enthalpy}\nNote: ${found.notes}`);
    } else {
      setReactionResult(`Mixture of ${element1} and ${element2}: No spontaneous reaction under standard laboratory STP conditions.`);
    }
  };

  // Logic gate calculation
  const computeGateOutput = () => {
    switch (gateType) {
      case "AND":
        return inputA && inputB;
      case "OR":
        return inputA || inputB;
      case "XOR":
        return inputA !== inputB;
      case "NAND":
        return !(inputA && inputB);
      default:
        return false;
    }
  };

  const gateOutput = computeGateOutput();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <FlaskConical className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">Interactive Science Labs</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🇮🇳 Made in India • Aryan Sharma
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Created by Aryan Sharma. Real-time parameter manipulation for physics, chemistry, genetics, digital electronics, and mathematical kinetic simulations.
          </p>
        </div>

        {/* Lab Switcher */}
        <div className="flex flex-wrap items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveLab("physics")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeLab === "physics" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Physics Pendulum
          </button>
          <button
            onClick={() => setActiveLab("chemistry")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeLab === "chemistry" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Chemical Reaction
          </button>
          <button
            onClick={() => setActiveLab("genetics")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeLab === "genetics" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            Genetics Punnett
          </button>
          <button
            onClick={() => setActiveLab("circuits")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeLab === "circuits" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Logic Gates
          </button>
          <button
            onClick={() => setActiveLab("advanced_simulations")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeLab === "advanced_simulations" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            Kinetic Simulations
          </button>
        </div>
      </div>

      {/* 1. PHYSICS PENDULUM */}
      {activeLab === "physics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              Gravitational & Length Controls
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                  <span>Gravity (g)</span>
                  <span className="font-mono text-teal-400">{gravity.toFixed(1)} m/s²</span>
                </div>
                <input
                  type="range"
                  min="1.6"
                  max="24.8"
                  step="0.2"
                  value={gravity}
                  onChange={(e) => setGravity(parseFloat(e.target.value))}
                  className="w-full accent-teal-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Moon (1.6)</span>
                  <span>Earth (9.8)</span>
                  <span>Jupiter (24.8)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                  <span>String Length (L)</span>
                  <span className="font-mono text-teal-400">{length.toFixed(1)} meters</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isSimulating ? "Pause Harmonic Motion" : "Resume Motion"}
                </button>
                <button
                  onClick={() => {
                    setGravity(9.8);
                    setLength(2.0);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Earth STP
                </button>
              </div>

              {/* Calculated Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Calculated Period (T)</div>
                  <div className="text-base font-bold text-teal-300 font-mono">
                    {(2 * Math.PI * Math.sqrt(length / gravity)).toFixed(2)}s
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Current Amplitude</div>
                  <div className="text-base font-bold text-emerald-400 font-mono">
                    {Math.abs(pendulumAngle).toFixed(1)}°
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SVG Real-Time Harmonic Pendulum Visualizer */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-center min-h-[350px]">
            <svg width="280" height="280" className="overflow-visible">
              {/* Pivot */}
              <circle cx="140" cy="40" r="6" fill="#0d9488" />
              <line x1="100" y1="40" x2="180" y2="40" stroke="#334155" strokeWidth="4" />

              {/* Pendulum Cord */}
              {(() => {
                const rad = (pendulumAngle * Math.PI) / 180;
                const px = 140 + Math.sin(rad) * (length * 40);
                const py = 40 + Math.cos(rad) * (length * 40);
                return (
                  <>
                    <line x1="140" y1="40" x2={px} y2={py} stroke="#14b8a6" strokeWidth="2" strokeDasharray="3,3" />
                    <circle cx={px} cy={py} r="16" fill="#0f766e" stroke="#2dd4bf" strokeWidth="2.5" />
                    <circle cx={px} cy={py} r="4" fill="#ffffff" />
                  </>
                );
              })()}
            </svg>
            <div className="text-xs text-slate-400 font-mono mt-4">
              θ(t) = θ₀ · cos(√(g/L) · t)
            </div>
          </div>
        </div>
      )}

      {/* 2. CHEMISTRY COMPOUND SYNTHESIZER */}
      {activeLab === "chemistry" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-teal-400" />
              Chemical Reaction Chamber
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Reactant 1</label>
                <select
                  value={element1}
                  onChange={(e) => setElement1(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200"
                >
                  <option value="H2">Hydrogen Gas (H₂)</option>
                  <option value="Na">Sodium Metal (Na)</option>
                  <option value="CH4">Methane (CH₄)</option>
                  <option value="N2">Nitrogen Gas (N₂)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Reactant 2</label>
                <select
                  value={element2}
                  onChange={(e) => setElement2(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200"
                >
                  <option value="O2">Oxygen Gas (O₂)</option>
                  <option value="Cl2">Chlorine Gas (Cl₂)</option>
                  <option value="H2">Hydrogen Gas (H₂)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSynthesizeReaction}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-950/40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Initiate Catalytic Reaction
            </button>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 mb-3">Stoichiometric & Thermodynamic Output</h3>
              {reactionResult ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-teal-300 font-mono leading-relaxed whitespace-pre-wrap">
                  {reactionResult}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
                  Select reactants and initiate reaction.
                </div>
              )}
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              Validated against standard NIST Chemistry WebBook thermochemical values.
            </div>
          </div>
        </div>
      )}

      {/* 3. GENETICS PUNNETT SQUARE */}
      {activeLab === "genetics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Dna className="w-4 h-4 text-teal-400" />
              Mendelian Monohybrid Inheritance
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Maternal Genotype (Parent 1)</label>
                <select
                  value={parent1}
                  onChange={(e) => setParent1(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200"
                >
                  <option value="BB">Homozygous Dominant (BB)</option>
                  <option value="Bb">Heterozygous (Bb)</option>
                  <option value="bb">Homozygous Recessive (bb)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Paternal Genotype (Parent 2)</label>
                <select
                  value={parent2}
                  onChange={(e) => setParent2(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200"
                >
                  <option value="BB">Homozygous Dominant (BB)</option>
                  <option value="Bb">Heterozygous (Bb)</option>
                  <option value="bb">Homozygous Recessive (bb)</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div><strong className="text-slate-200">B:</strong> Dominant Allele (e.g., Brown Eyes)</div>
              <div><strong className="text-slate-200">b:</strong> Recessive Allele (e.g., Blue Eyes)</div>
            </div>
          </div>

          {/* 2x2 Punnett Matrix */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-center">
            <div className="grid grid-cols-2 gap-2 text-center w-64">
              {parent1.split("").map((a1, i) =>
                parent2.split("").map((a2, j) => {
                  const combo = [a1, a2].sort().join("");
                  const isDom = combo.includes("B");
                  return (
                    <div
                      key={`${i}-${j}`}
                      className={`p-4 rounded-xl border font-mono font-bold text-lg ${
                        isDom
                          ? "bg-teal-500/10 border-teal-500/30 text-teal-300"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      {combo}
                      <div className="text-[10px] font-normal text-slate-400 mt-1 font-sans">
                        {isDom ? "Dominant Phenotype" : "Recessive Phenotype"}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. DIGITAL LOGIC GATES */}
      {activeLab === "circuits" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              Digital Logic Breadboard
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Gate Operator</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["AND", "OR", "XOR", "NAND"] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGateType(g)}
                      className={`py-2 rounded-lg text-xs font-bold border transition ${
                        gateType === g
                          ? "bg-teal-600 text-white border-teal-500"
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setInputA(!inputA)}
                  className={`p-3 rounded-xl border text-center font-mono font-bold transition ${
                    inputA
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-slate-800 text-slate-500 border-slate-700"
                  }`}
                >
                  Input A: {inputA ? "1 (HIGH)" : "0 (LOW)"}
                </button>

                <button
                  onClick={() => setInputB(!inputB)}
                  className={`p-3 rounded-xl border text-center font-mono font-bold transition ${
                    inputB
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-slate-800 text-slate-500 border-slate-700"
                  }`}
                >
                  Input B: {inputB ? "1 (HIGH)" : "0 (LOW)"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center space-y-4">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">
              Output Line: {gateType} Gate
            </div>
            <div
              className={`w-32 h-32 rounded-3xl flex flex-col items-center justify-center border-2 transition-all ${
                gateOutput
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-xl shadow-emerald-500/20"
                  : "bg-slate-950 border-slate-800 text-slate-600"
              }`}
            >
              <span className="text-4xl font-black font-mono">{gateOutput ? "1" : "0"}</span>
              <span className="text-xs font-bold mt-1">{gateOutput ? "TRUE / HIGH" : "FALSE / LOW"}</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {inputA ? "1" : "0"} {gateType} {inputB ? "1" : "0"} = {gateOutput ? "1" : "0"}
            </div>
          </div>
        </div>
      )}

      {/* 5. ADVANCED KINETIC & ORBITAL SIMULATIONS */}
      {activeLab === "advanced_simulations" && (
        <div className="space-y-4">
          <ScientificSimulation defaultPreset="orbital_velocity" />
        </div>
      )}
    </div>
  );
};
