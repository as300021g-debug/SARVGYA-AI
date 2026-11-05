import React, { useState } from "react";
import { Cpu, Plus, Check, ShieldCheck, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";
import { AIPlugin } from "../types";

export const PluginCenter: React.FC = () => {
  const [plugins, setPlugins] = useState<AIPlugin[]>([
    {
      id: "scientific-calculator",
      name: "Bioscience & Chemistry Analyzer",
      description: "DeepMind Science skill engine with AlphaFold DB and PubChem molecular lookups",
      version: "2.4.0",
      author: "DeepMind Science Team",
      iconName: "flask",
      category: "AI Capability",
      enabled: true,
      systemPromptModifier: "When bioscience or chemistry queries arise, analyze molecular formulas, structural pLDDT confidence scores, and target mechanisms with publication rigor.",
    },
    {
      id: "stock-quant-engine",
      name: "Stock Quant & Portfolio Simulator",
      description: "Live market analytics, ticker evaluation, and financial search grounding",
      version: "3.1.0",
      author: "Sarvagya FinTech",
      iconName: "trending-up",
      category: "Module",
      enabled: true,
      systemPromptModifier: "Provide quantitative metrics, risk ratios, support/resistance levels, and Search-grounded market catalyst analysis for all stock tickers.",
    },
    {
      id: "buyhatke-deal-scout",
      name: "BuyHatke Deal & Coupon Scout",
      description: "Grounds e-commerce discount codes, seasonal deals, and verified cashback tips",
      version: "1.9.0",
      author: "BuyHatke Labs",
      iconName: "tag",
      category: "Tool",
      enabled: true,
      systemPromptModifier: "Actively synthesize verified coupon codes, deal promotions, and pricing trends using live Google Search grounding without web scraping.",
    },
    {
      id: "workspace-automator",
      name: "Google Workspace Hub",
      description: "Generates structured drafts for Docs, Sheets formulas, Gmail replies, and Calendar agendas",
      version: "4.0.0",
      author: "Google Workspace Skills",
      iconName: "briefcase",
      category: "Tool",
      enabled: true,
      systemPromptModifier: "Format emails with professional subjects and bodies, produce exact CSV/tabular rows for Google Sheets, and outline Google Docs with executive headers.",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPluginName, setNewPluginName] = useState("");
  const [newPluginCategory, setNewPluginCategory] = useState<"Tool" | "Module" | "AI Capability">("Tool");
  const [newPluginDesc, setNewPluginDesc] = useState("");
  const [newPluginPrompt, setNewPluginPrompt] = useState("");

  const togglePlugin = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleAddPlugin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPluginName.trim() || !newPluginPrompt.trim()) return;

    const newPlugin: AIPlugin = {
      id: `plugin-${Date.now()}`,
      name: newPluginName.trim(),
      category: newPluginCategory,
      description: newPluginDesc.trim() || "Custom user plugin module",
      version: "1.0.0",
      author: "User Customized",
      iconName: "cpu",
      enabled: true,
      systemPromptModifier: newPluginPrompt.trim(),
    };

    setPlugins([...plugins, newPlugin]);
    setNewPluginName("");
    setNewPluginDesc("");
    setNewPluginPrompt("");
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">Custom AI Plugin Center</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🇮🇳 Made in India • Aryan Sharma
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Created by Aryan Sharma. Dynamic system prompt modifiers and capability injections. Compliant with safe function-calling architectures.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Plugin</span>
        </button>
      </div>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plugins.map((plugin) => (
          <div
            key={plugin.id}
            className={`p-5 rounded-2xl border transition-all ${
              plugin.enabled
                ? "bg-slate-900/90 border-cyan-500/30 shadow-md shadow-cyan-950/20"
                : "bg-slate-900/50 border-slate-800 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {plugin.category}
                  </span>
                  <span className="font-bold text-sm text-slate-100">{plugin.name}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{plugin.description}</p>
              </div>

              <button
                type="button"
                onClick={() => togglePlugin(plugin.id)}
                className="text-slate-300 hover:text-white"
                title={plugin.enabled ? "Disable Plugin" : "Enable Plugin"}
              >
                {plugin.enabled ? (
                  <ToggleRight className="w-6 h-6 text-cyan-400" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-600" />
                )}
              </button>
            </div>

            <div className="pt-3 text-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Active System Prompt Modifier:
              </span>
              <p className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 font-mono text-[11px] text-cyan-200">
                "{plugin.systemPromptModifier}"
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
              <span>Author: {plugin.author}</span>
              <span>v{plugin.version}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding custom plugin */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Register New Custom AI Plugin
            </h3>

            <form onSubmit={handleAddPlugin} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Plugin Name</label>
                <input
                  type="text"
                  value={newPluginName}
                  onChange={(e) => setNewPluginName(e.target.value)}
                  placeholder="e.g. Legal Contract Auditor"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={newPluginCategory}
                  onChange={(e) => setNewPluginCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="Tool">Tool</option>
                  <option value="Module">Module</option>
                  <option value="AI Capability">AI Capability</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={newPluginDesc}
                  onChange={(e) => setNewPluginDesc(e.target.value)}
                  placeholder="Brief function summary..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">System Prompt Modifier</label>
                <textarea
                  rows={3}
                  value={newPluginPrompt}
                  onChange={(e) => setNewPluginPrompt(e.target.value)}
                  placeholder="Instructions injected into live AI core when enabled..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                >
                  Create Plugin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
