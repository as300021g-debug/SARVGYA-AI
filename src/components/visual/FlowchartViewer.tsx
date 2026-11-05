// ============================================================================
// SARVAGYA AI — FLOWCHART & DIRECTED GRAPH VIEWER
// Interactive SVG-based workflow and architectural DAG diagram renderer
// ============================================================================

import React, { useState } from "react";
import { GitBranch, Layers, CheckCircle2, AlertCircle, Clock, Database, Cpu, ArrowRight } from "lucide-react";
import { FlowchartNode, FlowchartEdge } from "./types.ts";

interface FlowchartViewerProps {
  title?: string;
  description?: string;
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  height?: number | string;
}

export const FlowchartViewer: React.FC<FlowchartViewerProps> = ({
  title = "System Execution Flow",
  description,
  nodes,
  edges,
  height = 420,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Automatic topological layout for nodes into levels
  const layoutNodes = React.useMemo(() => {
    if (!nodes || nodes.length === 0) return [];

    // Assign level by dependencies
    const nodeMap = new Map<string, FlowchartNode>(nodes.map((n) => [n.id, n]));
    const inDegree: Record<string, number> = {};
    nodes.forEach((n) => (inDegree[n.id] = 0));
    edges.forEach((e) => {
      inDegree[e.to] = (inDegree[e.to] || 0) + 1;
    });

    const levels: string[][] = [];
    const visited = new Set<string>();

    let currentLevel = nodes.filter((n) => (inDegree[n.id] || 0) === 0).map((n) => n.id);
    if (currentLevel.length === 0) currentLevel = [nodes[0].id];

    while (currentLevel.length > 0) {
      levels.push(currentLevel);
      currentLevel.forEach((id) => visited.add(id));

      const nextLevel: string[] = [];
      currentLevel.forEach((parentId) => {
        edges
          .filter((e) => e.from === parentId)
          .forEach((e) => {
            if (!visited.has(e.to) && !nextLevel.includes(e.to)) {
              nextLevel.push(e.to);
            }
          });
      });
      currentLevel = nextLevel;
      if (levels.length > 10) break; // cycle protection
    }

    // Include any orphans in last level
    nodes.forEach((n) => {
      if (!visited.has(n.id)) {
        if (levels.length === 0) levels.push([]);
        levels[levels.length - 1].push(n.id);
      }
    });

    // Compute coordinates
    const computed: Array<FlowchartNode & { x: number; y: number; width: number; height: number }> = [];
    const levelHeight = 90;
    const nodeWidth = 160;
    const nodeHeight = 54;

    levels.forEach((lvl, lvlIdx) => {
      const totalWidth = lvl.length * (nodeWidth + 24);
      const startX = Math.max(30, 400 - totalWidth / 2);

      lvl.forEach((id, colIdx) => {
        const node = nodeMap.get(id);
        if (node) {
          computed.push({
            ...node,
            x: startX + colIdx * (nodeWidth + 24),
            y: 40 + lvlIdx * levelHeight,
            width: nodeWidth,
            height: nodeHeight,
          });
        }
      });
    });

    return computed;
  }, [nodes, edges]);

  const selectedNode = selectedNodeId ? layoutNodes.find((n) => n.id === selectedNodeId) : null;

  return (
    <div className="w-full border border-slate-800 bg-[#060810] text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <GitBranch className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-100">
              {title}
            </h4>
            {description && <p className="text-[10px] text-slate-400 font-mono">{description}</p>}
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          {nodes.length} NODES • {edges.length} EDGES
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
        {/* SVG Flowchart Canvas */}
        <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-slate-800 relative overflow-x-auto p-4 bg-[#05070d]">
          <svg
            viewBox="0 0 800 440"
            className="w-full min-w-[650px] h-auto select-none"
            style={{ minHeight: typeof height === "number" ? height - 80 : 340 }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#38bdf8" />
              </marker>
            </defs>

            {/* Directed Edges */}
            {edges.map((edge, idx) => {
              const src = layoutNodes.find((n) => n.id === edge.from);
              const tgt = layoutNodes.find((n) => n.id === edge.to);
              if (!src || !tgt) return null;

              const x1 = src.x + src.width / 2;
              const y1 = src.y + src.height;
              const x2 = tgt.x + tgt.width / 2;
              const y2 = tgt.y;

              const midY = (y1 + y2) / 2;
              const path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

              return (
                <g key={`edge-${idx}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="3"
                  />
                  <path
                    d={path}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray={edge.animated ? "4,4" : "none"}
                    markerEnd="url(#arrowhead)"
                  />
                  {edge.label && (
                    <text
                      x={(x1 + x2) / 2}
                      y={midY - 6}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {layoutNodes.map((n) => {
              const isSelected = selectedNodeId === n.id;
              const isStartEnd = n.category === "start" || n.category === "end";
              const isModel = n.category === "model";
              const isDb = n.category === "database";

              let borderColor = "#334155";
              let bgColor = "#0f172a";
              let iconColor = "#94a3b8";

              if (n.status === "completed") {
                borderColor = "#059669";
                iconColor = "#10b981";
              } else if (n.status === "active") {
                borderColor = "#0284c7";
                bgColor = "#082f49";
                iconColor = "#38bdf8";
              }

              if (isSelected) {
                borderColor = "#38bdf8";
                bgColor = "#0c4a6e";
              }

              return (
                <g
                  key={n.id}
                  onClick={() => setSelectedNodeId(n.id)}
                  className="cursor-pointer transition-all"
                  transform={`translate(${n.x}, ${n.y})`}
                >
                  {/* Card Background */}
                  <rect
                    width={n.width}
                    height={n.height}
                    fill={bgColor}
                    stroke={borderColor}
                    strokeWidth={isSelected ? "2" : "1"}
                  />

                  {/* Left accent border */}
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2={n.height}
                    stroke={iconColor}
                    strokeWidth="3"
                  />

                  {/* Title */}
                  <text
                    x="12"
                    y="22"
                    fill="#f8fafc"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {n.title.length > 18 ? n.title.slice(0, 17) + "…" : n.title}
                  </text>

                  {/* Subtitle / Category */}
                  <text
                    x="12"
                    y="38"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {n.category?.toUpperCase() || "STEP"} • {n.status || "IDLE"}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Inspector Panel */}
        <div className="p-4 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400 mb-2 border-b border-slate-800 pb-1">
              NODE INSPECTOR
            </div>

            {selectedNode ? (
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">IDENTIFIER</div>
                  <div className="text-slate-100 font-bold">{selectedNode.title}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{selectedNode.id}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase">DESCRIPTION</div>
                  <div className="text-slate-300 text-[11px] mt-0.5">
                    {selectedNode.description || "Execution component in orchestrated DAG pipeline."}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div className="p-2 border border-slate-800 bg-slate-900/40">
                    <div className="text-[9px] text-slate-500">CATEGORY</div>
                    <div className="text-slate-200 capitalize font-bold">
                      {selectedNode.category || "Process"}
                    </div>
                  </div>
                  <div className="p-2 border border-slate-800 bg-slate-900/40">
                    <div className="text-[9px] text-slate-500">STATUS</div>
                    <div className="text-emerald-400 font-bold uppercase">
                      {selectedNode.status || "Ready"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-dashed border-slate-800 text-slate-500 text-center text-[11px]">
                Click on any node in the flowchart to inspect parameters and dependencies.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500">
            Autonomous DAG pipeline rendered via SVG with deterministic graph flow.
          </div>
        </div>
      </div>
    </div>
  );
};
