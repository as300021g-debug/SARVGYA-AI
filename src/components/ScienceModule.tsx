import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  Dna,
  ExternalLink,
  Search,
  BookOpen,
  Sparkles,
  RefreshCw,
  Award,
  Atom,
  Activity,
} from "lucide-react";
import { ThreeDViewer } from "./visual/ThreeDViewer.tsx";
import { ScientificSimulation } from "./visual/ScientificSimulation.tsx";

export const ScienceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"explorer" | "simulation">("explorer");
  const [identifier, setIdentifier] = useState("TP53");
  const [queryType, setQueryType] = useState<"protein" | "chemical">("protein");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const exampleChips = [
    { label: "TP53 (Tumor Suppressor)", id: "TP53", type: "protein" as const },
    { label: "BRCA1 (DNA Repair)", id: "BRCA1", type: "protein" as const },
    { label: "EGFR (Kinase Receptor)", id: "EGFR", type: "protein" as const },
    { label: "PCSK9 (Cholesterol)", id: "PCSK9", type: "protein" as const },
    { label: "Imatinib (Gleevec)", id: "Imatinib", type: "chemical" as const },
    { label: "Aspirin (Acetylsalicylic)", id: "Aspirin", type: "chemical" as const },
  ];

  const handleQuery = async (idToQuery = identifier, typeToQuery = queryType) => {
    if (!idToQuery.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/science/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: idToQuery.trim(), type: typeToQuery }),
      });
      const result = await res.json();
      if (result.analysis) {
        setData(result);
      } else {
        throw new Error(result.error || "Failed to retrieve science analysis");
      }
    } catch (err: any) {
      setError(err.message || "Science database lookup error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleQuery("TP53", "protein");
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <FlaskConical className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">DeepMind Bioscience & Chemistry Workbench</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🇮🇳 Made in India • Aryan Sharma
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Created by Aryan Sharma. Authoritative biomedical research suite connecting AlphaFold DB, UniProtKB, PubChem, and PubMed literature with 3D molecular visualization.
          </p>
        </div>

        {/* Quick Example Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {exampleChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => {
                setIdentifier(chip.id);
                setQueryType(chip.type);
                handleQuery(chip.id, chip.type);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                identifier === chip.id
                  ? "bg-teal-500/20 text-teal-300 border-teal-500/40"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("explorer")}
          className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
            activeTab === "explorer"
              ? "border-teal-500 bg-teal-950/40 text-teal-300 font-bold"
              : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Atom className="h-3.5 w-3.5 text-teal-400" />
          <span>Molecular & AlphaFold 3D Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab("simulation")}
          className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
            activeTab === "simulation"
              ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold"
              : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
          <span>Biophysical & Chemical Simulation Lab</span>
        </button>
      </div>

      {activeTab === "simulation" ? (
        <ScientificSimulation />
      ) : (
        <>
          {/* Query Bar */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-lg shadow-black/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleQuery();
          }}
          className="flex flex-wrap items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQueryType("protein")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                queryType === "protein"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <Dna className="w-3.5 h-3.5" />
              Protein / Gene
            </button>
            <button
              type="button"
              onClick={() => setQueryType("chemical")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                queryType === "chemical"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Small Molecule
            </button>
          </div>

          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter Gene Symbol (e.g. TP53), UniProt ID (P04637), or Drug Name (Imatinib)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !identifier.trim()}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-md shadow-teal-950/40"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Analyze Entity</span>
          </button>
        </form>
      </div>

      {/* Main Analysis Display */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <ThreeDViewer
            sceneType="molecule"
            modelIdentifier={data.identifier || identifier}
            title={`${data.identifier || identifier} 3D Molecular / Structural Conformation`}
            description="Interactive procedural WebGL model with atomic bond geometries"
            height={320}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Metadata Inspector Card */}
          <div className="space-y-4">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Authoritative Metadata
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  {data.externalData?.source || "Public Scientific Repository"}
                </span>
              </div>

              {data.externalData ? (
                <div className="space-y-3 text-xs">
                  {data.externalData.uniprotAccession && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">UniProt Accession:</span>
                      <span className="font-mono font-bold text-slate-100">{data.externalData.uniprotAccession}</span>
                    </div>
                  )}

                  {data.externalData.globalMetricValue && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">AlphaFold Global pLDDT:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${data.externalData.globalMetricValue}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-cyan-300">
                          {data.externalData.globalMetricValue}
                        </span>
                      </div>
                    </div>
                  )}

                  {data.externalData.formula && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Molecular Formula:</span>
                      <span className="font-mono text-emerald-300">{data.externalData.formula}</span>
                    </div>
                  )}

                  {data.externalData.weight && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Molecular Weight:</span>
                      <span className="font-mono text-slate-200">{data.externalData.weight} g/mol</span>
                    </div>
                  )}

                  {data.externalData.smiles && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Canonical SMILES:</span>
                      <span className="font-mono text-[11px] text-amber-300 break-all">{data.externalData.smiles}</span>
                    </div>
                  )}

                  {data.externalData.cifUrl && (
                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <span className="text-slate-400 block text-[11px]">AlphaFold DB Coordinates:</span>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={data.externalData.cifUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] flex items-center gap-1 border border-slate-700"
                        >
                          mmCIF File <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                        {data.externalData.pdbUrl && (
                          <a
                            href={data.externalData.pdbUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] flex items-center gap-1 border border-slate-700"
                          >
                            PDB Format <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Live scientific structure metadata queried via PubMed & UniProtKB indices.
                </p>
              )}

              {/* Canonical 4-Band AlphaFold pLDDT Scale */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-300 block">AlphaFold pLDDT Scale</span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-950/40 border border-blue-600/30 text-blue-300">
                    <span className="w-2 h-2 rounded-full bg-[#0053D6]" />
                    Very High (&gt;90)
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-sky-950/40 border border-sky-400/30 text-sky-300">
                    <span className="w-2 h-2 rounded-full bg-[#65CBF3]" />
                    Confident (70-90)
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-yellow-950/40 border border-yellow-400/30 text-yellow-300">
                    <span className="w-2 h-2 rounded-full bg-[#FFDB13]" />
                    Low (50-70)
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-orange-950/40 border border-orange-400/30 text-orange-300">
                    <span className="w-2 h-2 rounded-full bg-[#FF7D45]" />
                    Very Low (&lt;50)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Biochemical & Clinical Report */}
          <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-sm text-slate-100">
                  Publication-Grade Synthesis: {data.identifier}
                </h3>
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                DeepMind Science Skill
              </span>
            </div>

            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-3">
              {data.analysis}
            </div>
          </div>
        </div>
      </div>
      )}
      </>
      )}
    </div>
  );
};
