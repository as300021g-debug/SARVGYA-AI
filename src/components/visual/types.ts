// ============================================================================
// SARVAGYA AI — REUSABLE VISUALIZATION ENGINE TYPE DEFINITIONS & CONTRACTS
// Clean, validated data contracts for charts, maps, transit, 3D, media & diagrams
// ============================================================================

export type VisualizationType =
  | "chart"
  | "table"
  | "map"
  | "route_map"
  | "train_tracker"
  | "flowchart"
  | "timeline"
  | "threed"
  | "simulation"
  | "image"
  | "gallery"
  | "video"
  | "audio"
  | "waveform"
  | "status_panel"
  | "progress_panel"
  | "activity_feed"
  | "metric_card"
  | "calendar";

export type ChartType =
  | "bar"
  | "horizontal_bar"
  | "line"
  | "area"
  | "pie"
  | "doughnut"
  | "scatter"
  | "candlestick"
  | "heatmap";

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  color?: string;
  category?: string;
  date?: string;
  [key: string]: any;
}

export interface ChartConfig {
  type: ChartType;
  title?: string;
  description?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  unit?: string;
  data: ChartDataPoint[];
  categories?: string[];
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  isSimulated?: boolean;
}

// --- Railway Data Provider & Train Tracker Contracts ---
export type TrainRunningStatus = "ON_TIME" | "DELAYED" | "ARRIVED" | "DEPARTED" | "SCHEDULED" | "UNKNOWN";

export type StationStatus = "PASSED" | "CURRENT" | "NEXT" | "UPCOMING";

export interface TrainStation {
  code: string;
  name: string;
  state?: string;
  distanceKm: number;
  scheduledArrival: string;
  scheduledDeparture: string;
  actualArrival: string;
  actualDeparture: string;
  delayArrivalMinutes: number;
  delayDepartureMinutes: number;
  platform?: string;
  haltMinutes: number;
  status: StationStatus;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TrainJourneyData {
  trainNumber: string;
  trainName: string;
  trainType: "Vande Bharat" | "Rajdhani" | "Shatabdi" | "Duronto" | "Superfast" | "Mail/Express";
  journeyDate: string;
  sourceStation: { code: string; name: string };
  destinationStation: { code: string; name: string };
  totalDistanceKm: number;
  currentStation?: { code: string; name: string };
  nextStation?: { code: string; name: string; eta: string; distanceKm: number };
  status: TrainRunningStatus;
  currentDelayMinutes: number;
  speedKmh: number;
  progressPercentage: number;
  currentLocation: {
    lat: number;
    lng: number;
    headingDeg?: number;
    description: string;
  };
  stations: TrainStation[];
  lastUpdated: string;
  dataFreshness: "LIVE_CONFIRMED" | "INFERRED_TELEMETRY" | "SCHEDULED_RUN" | "SIMULATED_DEMO";
  providerAttribution: string;
}

export interface RailwayDataProvider {
  getTrainStatus(trainQuery: string, journeyDate?: string): Promise<TrainJourneyData>;
  searchTrains(query: string): Promise<Array<{ trainNumber: string; trainName: string }>>;
}

// --- Map & Route Contracts ---
export interface MapMarker {
  id: string;
  title: string;
  description?: string;
  lat: number;
  lng: number;
  category?: "station" | "airport" | "poi" | "vehicle" | "satellite";
  icon?: string;
  color?: string;
}

export interface RouteWaypoint {
  lat: number;
  lng: number;
  label?: string;
}

// --- Flowchart & Diagram Contracts ---
export interface FlowchartNode {
  id: string;
  title: string;
  description?: string;
  category?: "process" | "decision" | "start" | "end" | "model" | "database";
  status?: "pending" | "active" | "completed" | "error";
  children?: string[];
}

export interface FlowchartEdge {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

// --- Timeline Contracts ---
export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
  status: "completed" | "current" | "pending" | "warning";
  category?: string;
  metrics?: Record<string, string | number>;
}

// --- 3D Viewer Contracts ---
export type ThreeDSceneType = "molecule" | "solar_system" | "planet" | "cell" | "satellite_orbit" | "mesh";

export interface ThreeDViewerProps {
  sceneType: ThreeDSceneType;
  modelIdentifier?: string; // e.g. "caffeine", "mars", "earth_satellite"
  title?: string;
  description?: string;
  autoRotate?: boolean;
  wireframe?: boolean;
  height?: number | string;
}

// --- Scientific Simulation Contracts ---
export interface SimulationVariable {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export interface SimulationConfig {
  id: string;
  title: string;
  subject: "physics" | "chemistry" | "biology" | "astronomy";
  description: string;
  variables: SimulationVariable[];
  formulaDescription: string;
  isExperimental: boolean;
}

// --- Central Universal Visual Payload ---
export interface VisualPayload {
  type: VisualizationType;
  title: string;
  description?: string;
  timestamp?: string;
  isLive?: boolean;
  sources?: Array<{ title: string; uri: string }>;
  data: any;
  config?: any;
}
