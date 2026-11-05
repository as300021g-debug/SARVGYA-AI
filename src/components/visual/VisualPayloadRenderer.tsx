// ============================================================================
// SARVAGYA AI — UNIVERSAL VISUAL PAYLOAD RENDERER
// Dispatches structured AI visual payloads into high-fidelity UI components
// ============================================================================

import React from "react";
import { VisualizationErrorBoundary } from "./VisualizationErrorBoundary.tsx";
import { ChartRenderer } from "./ChartRenderer.tsx";
import { DataTable } from "./DataTable.tsx";
import { InteractiveMap } from "./InteractiveMap.tsx";
import { TrainTracker } from "./TrainTracker.tsx";
import { FlowchartViewer } from "./FlowchartViewer.tsx";
import { ThreeDViewer } from "./ThreeDViewer.tsx";
import { ScientificSimulation } from "./ScientificSimulation.tsx";
import { ImageViewer, ImageGallery, VideoPlayer, AudioPlayer } from "./MediaViewer.tsx";
import { LiveStatusPanel } from "./LiveStatusPanel.tsx";
import { ProgressPanel } from "./ProgressPanel.tsx";
import { ActivityFeed } from "./ActivityFeed.tsx";
import { MetricCard } from "./MetricCard.tsx";
import { CalendarView } from "./CalendarView.tsx";
import { TimelineViewer } from "./TimelineViewer.tsx";
import { VisualPayload } from "./types.ts";

interface VisualPayloadRendererProps {
  payload: VisualPayload;
  className?: string;
}

export const VisualPayloadRenderer: React.FC<VisualPayloadRendererProps> = ({
  payload,
  className = "",
}) => {
  if (!payload || !payload.type) return null;

  return (
    <VisualizationErrorBoundary fallbackTitle={`Visual Error in ${payload.type}`}>
      <div className={`w-full my-3 ${className}`}>
        {payload.type === "chart" && (
          <ChartRenderer config={payload.config || payload.data} />
        )}

        {payload.type === "table" && (
          <DataTable
            title={payload.title}
            description={payload.description}
            columns={payload.config?.columns || Object.keys(payload.data?.[0] || {}).map((k) => ({ key: k, label: k }))}
            data={payload.data || []}
          />
        )}

        {(payload.type === "map" || payload.type === "route_map") && (
          <InteractiveMap
            title={payload.title}
            markers={payload.data?.markers || []}
            routes={payload.data?.routes || [payload.data?.waypoints || []]}
          />
        )}

        {payload.type === "train_tracker" && (
          <TrainTracker
            initialTrainNumber={payload.data?.trainNumber || payload.config?.trainNumber || "12002"}
            title={payload.title}
          />
        )}

        {payload.type === "flowchart" && (
          <FlowchartViewer
            title={payload.title}
            description={payload.description}
            nodes={payload.data?.nodes || []}
            edges={payload.data?.edges || []}
          />
        )}

        {payload.type === "timeline" && (
          <TimelineViewer
            title={payload.title}
            description={payload.description}
            events={payload.data?.events || payload.data || []}
          />
        )}

        {payload.type === "threed" && (
          <ThreeDViewer
            sceneType={payload.config?.sceneType || payload.data?.sceneType || "molecule"}
            modelIdentifier={payload.config?.modelIdentifier || payload.data?.modelIdentifier}
            title={payload.title}
            description={payload.description}
          />
        )}

        {payload.type === "simulation" && (
          <ScientificSimulation
            config={payload.config || payload.data}
            defaultPreset={payload.config?.preset || "pendulum"}
          />
        )}

        {payload.type === "image" && (
          <ImageViewer
            src={payload.data?.src || payload.data}
            title={payload.title}
            prompt={payload.data?.prompt || payload.config?.prompt}
            aspectRatio={payload.data?.aspectRatio}
            modelUsed={payload.data?.modelUsed}
          />
        )}

        {payload.type === "gallery" && (
          <ImageGallery
            title={payload.title}
            items={payload.data?.items || payload.data || []}
          />
        )}

        {payload.type === "video" && (
          <VideoPlayer
            src={payload.data?.src}
            poster={payload.data?.poster}
            title={payload.title}
            duration={payload.data?.duration}
            aspectRatio={payload.data?.aspectRatio}
          />
        )}

        {(payload.type === "audio" || payload.type === "waveform") && (
          <AudioPlayer
            src={payload.data?.src}
            title={payload.title}
            subtitle={payload.description}
            bpm={payload.data?.bpm || 120}
          />
        )}

        {payload.type === "status_panel" && (
          <LiveStatusPanel
            title={payload.title}
            items={payload.data?.items || payload.data?.subsystems || []}
          />
        )}

        {payload.type === "progress_panel" && (
          <ProgressPanel
            title={payload.title}
            percent={payload.data?.percent || 0}
            steps={payload.data?.steps || []}
          />
        )}

        {payload.type === "activity_feed" && (
          <ActivityFeed
            title={payload.title}
            events={payload.data?.events || payload.data?.activities || []}
          />
        )}

        {payload.type === "metric_card" && (
          <MetricCard
            title={payload.title}
            value={payload.data?.value}
            unit={payload.data?.unit}
            trend={payload.data?.trend}
            trendPercent={payload.data?.trendPercent || payload.data?.delta}
            sparkline={payload.data?.sparkline || payload.data?.sparklineData}
          />
        )}

        {payload.type === "calendar" && (
          <CalendarView
            title={payload.title}
            events={payload.data?.events || payload.data || []}
          />
        )}

        {/* Source provenance badges */}
        {payload.sources && payload.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-slate-500">
            <span>VERIFIED SOURCES:</span>
            {payload.sources.map((s, idx) => (
              <a
                key={idx}
                href={s.uri}
                target="_blank"
                rel="noreferrer"
                className="border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-cyan-400 hover:text-cyan-300"
              >
                {s.title || s.uri}
              </a>
            ))}
          </div>
        )}
      </div>
    </VisualizationErrorBoundary>
  );
};
