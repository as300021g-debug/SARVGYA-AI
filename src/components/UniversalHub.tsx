import React, { useState } from "react";
import {
  Globe,
  ExternalLink,
  Sparkles,
  Send,
  Loader2,
  Terminal,
  Code2,
  Database,
  Workflow,
  Cpu,
  Search,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Copy,
  Check,
  BookOpen,
  Microscope,
  TrendingUp,
  Film,
  Mic,
  Eye,
  Sliders,
  BrainCircuit,
  Boxes,
  Compass,
  Smartphone,
  Home,
  Car,
  Rocket,
  Cloud,
  Activity,
  Bot,
  Radio,
  Share2,
  Briefcase,
} from "lucide-react";

interface ExecutionResult {
  success: boolean;
  domain?: string;
  pillar?: string;
  subFeature?: string;
  response: string;
  sources?: Array<{ title: string; uri: string }>;
  timestamp: string;
  executionMode: string;
  modelUsed?: string;
  error?: string;
}

export const UniversalHub: React.FC = () => {
  // Top-level Navigation Tabs
  type HubTab = "assistants" | "categories" | "architectures" | "ecosystems" | "capabilities" | "edge_subsystems";
  const [activeTab, setActiveTab] = useState<HubTab>("assistants");

  // --- 0. Universal Assistant Personas ---
  const [selectedAssistant, setSelectedAssistant] = useState<string>("gemini");

  // --- 1. Major Categories of AI ---
  const [selectedCategory, setSelectedCategory] = useState<string>("narrow_ai");

  // --- 2. Core AI Types by Architecture & Capability ---
  const [selectedArchitecture, setSelectedArchitecture] = useState<string>("llm");

  // --- 3. Famous AI Models and Ecosystems ---
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>("gemini");
  const [ecosystemCategoryFilter, setEcosystemCategoryFilter] = useState<string>("all");

  // --- 4. 6 Foundational AI Capabilities & RAG ---
  const [selectedPillar, setSelectedPillar] = useState<string>("data_science_rag");
  const [selectedSubFeature, setSelectedSubFeature] = useState<string>("rag_analysis");
  const [targetLanguage, setTargetLanguage] = useState<string>("TypeScript");
  const [documentContent, setDocumentContent] = useState<string>(
    `[DOCUMENT: AI STUDIO DISTRIBUTED ARCHITECTURE WHITEPAPER]
Abstract: SARVAGYA AI utilizes a multi-model distributed gateway with dynamic model cascading across Gemini 3.8 Flash, Gemini 4 Argon, and Gemini 3.1 Flash-Lite.
Section 1. Grounding Latency: Real-time Google Search grounding operates with an average index resolution time of 420ms, extracting web citations and canonical URIs directly into candidate metadata.
Section 2. Fault Tolerance: Rate-limiting codes (429 RESOURCE_EXHAUSTED) trigger an automatic non-blocking failover cascade to ensure zero-downtime availability.
Section 3. Spatial & IoT Synchronization: Telemetry feeds from CAN-bus in automotive clusters and Matter-over-Thread mesh nodes are normalized using JSON-LD schemas.`
  );

  // --- 5. Edge Subsystems ---
  const [selectedDomain, setSelectedDomain] = useState<string>("mobile");

  // Query & Execution State
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                     0. UNIFIED ASSISTANT PERSONAS MATRIX                   */
  /* -------------------------------------------------------------------------- */
  const assistantsList = [
    {
      id: "gemini",
      name: "Google Gemini & Assistant",
      company: "Google DeepMind",
      badge: "Flagship Multimodal",
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      color: "border-cyan-500/40 bg-cyan-950/20",
      desc: "Live multimodal voice/vision streaming, native Google Workspace integration (Drive, Docs, Gmail, Sheets), and live Google Search grounding for real-time web verification.",
      specs: [
        { label: "Grounding", val: "Google Search (Live Web Citations)" },
        { label: "Workspace", val: "Drive, Docs, Sheets, Gmail Integrations" },
        { label: "Modality", val: "Audio, Vision, Code, Text Fusion" },
      ],
      presets: [
        "Synthesize a live web search summary of the newest developments in quantum error correction and cite verified sources",
        "Formulate an executive Google Docs briefing and Google Sheets data matrix for quarterly AI cloud infrastructure costs",
        "Explain how Gemini's native multimodal architecture integrates audio and image tokens in a single synchronized transformer",
      ],
    },
    {
      id: "chatgpt",
      name: "OpenAI ChatGPT & Astra",
      company: "OpenAI",
      badge: "Conversational & Code",
      icon: <Bot className="w-5 h-5 text-emerald-400" />,
      color: "border-emerald-500/40 bg-emerald-950/20",
      desc: "Real-time conversational flow, pragmatic code execution blocks, step-by-step logic, and multi-turn problem-solving.",
      specs: [
        { label: "Core Focus", val: "Executable Code Blocks & Step-by-Step Logic" },
        { label: "Interaction", val: "Natural Conversation Flow" },
        { label: "Execution", val: "Live Computational Execution Blocks" },
      ],
      presets: [
        "Generate a complete TypeScript WebSocket streaming client with automatic reconnect exponential backoff and unit tests",
        "Step-by-step debugging of a memory leak in a high-concurrency Node.js microservice handling 10,000 req/sec",
        "Compare GPT-4o's real-time omni tokenization mechanism against classic dual-model cascade pipelines",
      ],
    },
    {
      id: "claude",
      name: "Anthropic Claude 3.5",
      company: "Anthropic",
      badge: "Constitutional Safety",
      icon: <BrainCircuit className="w-5 h-5 text-purple-400" />,
      color: "border-purple-500/40 bg-purple-950/20",
      desc: "Deep constitutional reasoning, epistemic humility, structured long-form writing, and meticulous code refactoring with zero hallucination bias.",
      specs: [
        { label: "Reasoning", val: "Constitutional Safeguards & Balance" },
        { label: "Refactoring", val: "Large-Scale Architecture Audits" },
        { label: "Writing", val: "Nuanced, Publication-Grade Prose" },
      ],
      presets: [
        "Perform a thorough architectural code review and refactoring proposal for a complex distributed state machine",
        "Draft a comprehensive, balanced policy paper analyzing epistemic risks and ethical guardrails of autonomous agent swarms",
        "Explain the mathematical formulation of Constitutional AI and reinforcement learning from AI feedback (RLAIF)",
      ],
    },
    {
      id: "apple_siri",
      name: "Apple Intelligence & Siri",
      company: "Apple",
      badge: "On-Device & Intent",
      icon: <Smartphone className="w-5 h-5 text-slate-300" />,
      color: "border-slate-500/40 bg-slate-900/30",
      desc: "Privacy-focused contextual intent parsing, App Intent schemas, natural language shortcut formulation, and on-device semantic indexes.",
      specs: [
        { label: "Privacy Model", val: "Private Cloud Compute & On-Device Neural Engine" },
        { label: "Integration", val: "App Intents & Siri Shortcut Schemas" },
        { label: "Context", val: "Personal Semantic Index & Screen Awareness" },
      ],
      presets: [
        "Formulate an iOS Swift AppIntent schema for an automated flight tracker shortcut with Live Activities integration",
        "Explain how Apple's Private Cloud Compute maintains cryptographically verifiable stateless server execution",
        "Design an on-device contextual awareness intent pipeline that schedules calendar alerts based on email receipts",
      ],
    },
    {
      id: "alexa",
      name: "Amazon Alexa & IoT Hub",
      company: "Amazon",
      badge: "Smart Home Automation",
      icon: <Home className="w-5 h-5 text-amber-400" />,
      color: "border-amber-500/40 bg-amber-950/20",
      desc: "Smart home device automation, Matter/Zigbee/Thread mesh network coordination, multi-device routine triggers, and ambient voice computing.",
      specs: [
        { label: "Protocols", val: "Matter, Zigbee, Thread, Z-Wave" },
        { label: "Routines", val: "Multi-Step Sensor & Event Automations" },
        { label: "Latency", val: "Local Mesh Low-Latency Triggers" },
      ],
      presets: [
        "Create a complex Alexa Smart Home Routine schema triggered by room occupancy and luminosity to balance circadian lighting",
        "Architect a Matter-over-Thread home mesh network layout with border routers for complete offline local resilience",
        "Synthesize an energy conservation routine that shifts high-wattage appliance runtime to off-peak solar generation hours",
      ],
    },
    {
      id: "galaxy_ai",
      name: "Samsung Galaxy AI Suite",
      company: "Samsung Electronics",
      badge: "Mobile Productivity",
      icon: <Radio className="w-5 h-5 text-sky-400" />,
      color: "border-sky-500/40 bg-sky-950/20",
      desc: "Live Call Translation, Generative Edit & Note Assist summaries, Browsing Assist digests, and Circle to Search spatial-visual queries.",
      specs: [
        { label: "Translation", val: "On-Device Two-Way Voice Call Translation" },
        { label: "Productivity", val: "Note Assist & Auto-Formatting Summaries" },
        { label: "Vision", val: "Circle to Search & Generative Object Editing" },
      ],
      presets: [
        "Simulate a live two-way Korean-to-English business call translation transcript with cultural nuance preservation",
        "Transform an unstructured 2,000-word product specification transcript into bulleted Note Assist executive briefing notes",
        "Explain the on-device NPU segmentation pipeline used for real-time generative image background synthesis",
      ],
    },
  ];

  /* -------------------------------------------------------------------------- */
  /*                         1. MAJOR CATEGORIES OF AI                          */
  /* -------------------------------------------------------------------------- */
  const majorCategories = [
    {
      id: "narrow_ai",
      title: "Narrow AI (Weak AI)",
      badge: "Current Commercial Reality",
      status: "Production Standard",
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      color: "border-cyan-500/40 bg-cyan-950/20",
      desc: "Systems designed and trained for a specific task or a narrow set of tasks (e.g., image recognition, language translation, recommendation algorithms). Nearly all modern commercial AI operates within this boundary.",
      specs: [
        { label: "Scope", val: "Single Domain / Task-Specific" },
        { label: "Transfer Learning", val: "Limited cross-domain adaptation" },
        { label: "Autonomy", val: "Requires explicit goal boundaries" },
      ],
      presets: [
        "Analyze why modern medical imaging diagnostic models excel as Narrow AI but cannot generalize to prescribing oncology regimens",
        "Formulate the performance frontier and loss-function boundaries of Narrow AI in automated high-frequency algorithmic trading",
        "Explain how recommendation engines (e.g., YouTube, Netflix) optimize engagement within rigid dimensional vector spaces",
      ],
    },
    {
      id: "general_ai",
      title: "General AI (AGI / Strong AI)",
      badge: "Hypothetical Frontier",
      status: "Active R&D Milestone",
      icon: <BrainCircuit className="w-5 h-5 text-indigo-400" />,
      color: "border-indigo-500/40 bg-indigo-950/20",
      desc: "Hypothetical AI systems that possess the generalized cognitive ability to understand, learn, and apply knowledge across any intellectual domain at a human level, formulating novel hypotheses autonomously.",
      specs: [
        { label: "Scope", val: "Universal Cross-Domain Cognition" },
        { label: "Transfer Learning", val: "Zero-shot generalized abstraction" },
        { label: "Autonomy", val: "Formulates goals & self-directed learning" },
      ],
      presets: [
        "Evaluate the ARC-AGI benchmark and why current transformers struggle with novel fluid reasoning without explicit training data",
        "Synthesize the theoretical computational and thermodynamic minimums required to support true human-parity Artificial General Intelligence",
        "Analyze how neuro-symbolic reasoning and test-time compute scaling may bridge the gap between LLMs and General AI",
      ],
    },
    {
      id: "superintelligence",
      title: "Superintelligence (ASI)",
      badge: "Theoretical Horizon",
      status: "Singularity Horizon",
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      color: "border-purple-500/40 bg-purple-950/20",
      desc: "Theoretical AI that vastly surpasses human intelligence, creativity, scientific synthesis, and general problem-solving across all intellectual and creative fields simultaneously.",
      specs: [
        { label: "Scope", val: "Trans-Human Cognitive Supremacy" },
        { label: "Recursive Growth", val: "Continuous self-modifying codebases" },
        { label: "Discovery Speed", val: "Centuries of scientific breakthrough in minutes" },
      ],
      presets: [
        "Model the dynamics of a recursive self-improvement loop (Intelligence Explosion) and its fundamental hardware/energy bottlenecks",
        "Formulate theoretical safety, alignment, and provable verification frameworks designed to constrain Artificial Superintelligence",
        "Hypothesize how an ASI system would solve the Grand Unified Theory in theoretical physics combining quantum mechanics and general relativity",
      ],
    },
  ];

  /* -------------------------------------------------------------------------- */
  /*               2. CORE AI TYPES BY ARCHITECTURE & CAPABILITY                */
  /* -------------------------------------------------------------------------- */
  const architectureTypes = [
    {
      id: "llm",
      title: "Large Language Models (LLMs)",
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
      desc: "Specialized in understanding, processing, and generating human-like text, code, and structured data with multi-turn reasoning.",
      traits: ["Decoder-only attention", "KV Cache optimization", "JSON / Code synthesis"],
      presets: [
        "Detail the mathematical formulation of FlashAttention-3 and how it eliminates memory bandwidth bottlenecks in LLM inference",
        "Explain the trade-offs between dense model scaling vs Mixture of Experts (MoE) routing in modern frontier architectures",
      ],
    },
    {
      id: "multimodal",
      title: "Multimodal AI",
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      desc: "Capable of simultaneously processing and synthesizing multiple types of data inputs—text, audio, images, video, and code.",
      traits: ["Early vs late token fusion", "Shared latent embeddings", "Native multimodal pretraining"],
      presets: [
        "Explain how native multimodal models (e.g. Gemini) fuse video frames and audio waveforms directly in the token space without separate encoders",
        "Design a multimodal pipeline that ingests a 60-second video of a factory floor and detects OSHA safety violations in real time",
      ],
    },
    {
      id: "vision",
      title: "Computer Vision AI",
      icon: <Eye className="w-4 h-4 text-emerald-400" />,
      desc: "Interprets, analyzes, and extracts meaningful insights from digital images, live video streams, and spatial environments.",
      traits: ["Vision Transformers (ViT)", "Zero-shot segmentation", "Spatial depth & OCR"],
      presets: [
        "Compare Vision Transformers (ViT) patch-embeddings against convolutional networks for medical CT/MRI anomaly detection",
        "Formulate a zero-shot open-vocabulary object detection pipeline for robotic warehouse arm picking",
      ],
    },
    {
      id: "speech",
      title: "Speech & Audio AI",
      icon: <Mic className="w-4 h-4 text-amber-400" />,
      desc: "Automatic speech recognition (ASR), real-time voice synthesis, multi-language translation, and acoustic pattern analysis.",
      traits: ["Conformer ASR backbones", "Neural flow matching vocoders", "Emotional SSML prosody"],
      presets: [
        "Detail the architecture of modern end-to-end speech-to-speech models that preserve vocal timbre and emotional inflection across translations",
        "Analyze latency optimization strategies to achieve sub-200ms glass-to-glass conversational speech interaction",
      ],
    },
    {
      id: "genai",
      title: "Generative AI (GenAI)",
      icon: <Sparkles className="w-4 h-4 text-rose-400" />,
      desc: "Built to create entirely new content (text, imagery, video, sound, 3D assets) based on learned patterns and user prompts.",
      traits: ["Latent diffusion & flow matching", "Autoregressive generation", "3D Gaussian splatting"],
      presets: [
        "Explain the mathematical principles of Flow Matching compared to Denoising Diffusion Probabilistic Models (DDPM) in modern video generators",
        "Formulate a prompt-to-3D pipeline that converts single-view text prompts into clean polygonal meshes with PBR materials",
      ],
    },
    {
      id: "edge",
      title: "Edge & On-Device AI",
      icon: <Cpu className="w-4 h-4 text-teal-400" />,
      desc: "Lightweight models optimized to run locally on hardware (smartphones, IoT devices, automotive chips) without cloud servers.",
      traits: ["INT4 / FP4 quantization", "NPU execution kernels", "Zero cloud latency & privacy"],
      presets: [
        "Evaluate modern quantization algorithms (AWQ, GPTQ, SmoothQuant) for running 7B-parameter models on mobile NPUs under 2GB VRAM",
        "Architect an on-device privacy-preserving keyboard autocomplete engine utilizing local neural weights and federated learning",
      ],
    },
    {
      id: "agent",
      title: "Autonomous Agent AI",
      icon: <Bot className="w-4 h-4 text-blue-400" />,
      desc: "Equipped with reasoning loops, memory, and tool-use capabilities to execute multi-step workflows independently.",
      traits: ["ReAct & Plan-and-Solve", "Vector memory retrieval", "Autonomous tool calling & error recovery"],
      presets: [
        "Architect a multi-agent software engineering system with Planner, Coder, Critic, and Security Auditor agents operating in a cyclic DAG",
        "Formulate an autonomous Web Agent that handles dynamic DOM traversal, CAPTCHA avoidance, and multi-step airline booking verification",
      ],
    },
  ];

  /* -------------------------------------------------------------------------- */
  /*                    3. FAMOUS AI MODELS AND ECOSYSTEMS                      */
  /* -------------------------------------------------------------------------- */
  const famousEcosystems = [
    // -------------------------------------------------------------------------
    // 1. PROPRIETARY & FRONTIER LABS
    // -------------------------------------------------------------------------
    {
      id: "gemini",
      name: "Google DeepMind (Gemini Series)",
      developer: "Google DeepMind",
      badge: "Gemini 4 Argon • 3.8 Flash • Nano Banana",
      category: "Proprietary & Frontier Labs",
      color: "border-cyan-500/50 bg-gradient-to-br from-cyan-950/30 to-blue-950/20",
      accent: "text-cyan-400",
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
      desc: "Google DeepMind's flagship intelligence family spans general-purpose frontier systems (Gemini 4 Argon with 1M output context & complex reasoning, Gemini 3.8 Flash for high-speed agentic execution), specialized lightweight models (Gemini 3.8 Live for ultra-low latency voice-to-voice, Gemini 3.5 Flash-Lite for high-volume automation), and Nano Banana 2.1 / Nano Banana 2 Lite for native multimodal image generation.",
      flagships: [
        "Gemini 4 Argon: Complex reasoning, agentic coding, 1,000,000 token output limits & enterprise execution",
        "Gemini 3.8 Flash: High-speed everyday tasks, code debugging, and fast multi-step agent workflows",
        "Gemini 3.8 Live: Ultra-low latency real-time audio-to-audio and voice-first interaction",
        "Gemini 3.5 Pro: Massive multi-million token context windows and advanced scientific STEM reasoning",
        "Gemini 3.5 Flash-Lite: High-volume, cost-sensitive automation, classification & latency-critical tasks",
        "Nano Banana 2.1 / 2 Lite: Multimodal image-to-image and text-to-image generation built on Gemini",
        "Gemini Spark: Always-on autonomous cloud agent integration across Google Workspace"
      ],
      strengths: [
        "1M+ Output Context Window with synchronized multimodal tokens",
        "Live Google Search & Google Maps real-time Grounding",
        "Native audio, video, vision, and code fusion in a single transformer",
        "Deep Google Workspace (Docs, Sheets, Gmail, Drive) integration",
      ],
      presets: [
        "Explain how Gemini 4 Argon natively tokenizes video frames, audio waveforms, and code in a single synchronized transformer layer",
        "Compare Gemini 3.8 Flash vs Gemini 3.5 Flash-Lite for high-throughput enterprise API classification pipelines",
        "Evaluate Nano Banana 2.1 text-to-image latent diffusion mechanics built directly onto the Gemini architecture",
      ],
    },
    {
      id: "openai_gpt",
      name: "OpenAI (GPT Series)",
      developer: "OpenAI",
      badge: "GPT-6 Astra & GPT-5.6 Sol",
      category: "Proprietary & Frontier Labs",
      color: "border-emerald-500/50 bg-gradient-to-br from-emerald-950/30 to-slate-950/20",
      accent: "text-emerald-400",
      icon: <Bot className="w-5 h-5 text-emerald-400" />,
      desc: "Pioneered the modern generative boom with ChatGPT. Flagship frontier models include GPT-6 and GPT-6 Astra for advanced general reasoning and multi-step workflows, alongside GPT-5.6 Sol and GPT-5.5 optimized for fast agentic tool use.",
      flagships: [
        "GPT-6 / GPT-6 Astra: Flagship advanced reasoning & general assistant",
        "GPT-5.6 Sol / GPT-5.5: Optimized for high-speed agentic tasks & tools"
      ],
      strengths: [
        "Test-time compute scaling & complex chain-of-thought logic",
        "Extensive tool-calling JSON schema ecosystem",
        "Advanced Python real-time host execution verification",
        "Broad enterprise adoption & developer toolchains",
      ],
      presets: [
        "Analyze the architectural difference between GPT-6 test-time compute scaling and standard autoregressive token generation",
        "Formulate an autonomous agent DAG with GPT-5.6 Sol executing multi-step tool calls for enterprise logistics",
        "Explain the mathematical mechanics of OpenAI's reasoning tokens during complex multi-step debugging",
      ],
    },
    {
      id: "claude",
      name: "Anthropic (Claude Series)",
      developer: "Anthropic",
      badge: "Claude Opus 5.5 & Sonnet 5.5",
      category: "Proprietary & Frontier Labs",
      color: "border-amber-500/50 bg-gradient-to-br from-amber-950/30 to-slate-950/20",
      accent: "text-amber-400",
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      desc: "Anthropic's flagship Claude models lead the industry in complex software engineering, nuanced writing, and safety. Claude Opus 5.5 handles massive architectural codebases, Claude Sonnet 5.5 offers high performance at low cost, and Claude Fable 5.1 maximizes factual accuracy.",
      flagships: [
        "Claude Opus 5.5: Industry leader for complex coding & software engineering",
        "Claude Sonnet 5.5: High-performance, cost-efficient variant",
        "Claude Fable 5.1: Optimized for factual accuracy & long-form writing"
      ],
      strengths: [
        "Top-tier coding, multi-file refactoring & architecture audits",
        "Publication-grade prose with nuanced tone modulation",
        "Constitutional AI & provable alignment safeguards",
        "Computer Use API for autonomous desktop GUI operation",
      ],
      presets: [
        "Formulate an architecture audit of a 50,000-line distributed state machine using Claude Opus 5.5",
        "Analyze how Claude Fable 5.1 enforces factual citations and eliminates hallucination bias in long-form writing",
        "Explain the mathematical formulation of Constitutional AI and RLAIF compared to standard RLHF",
      ],
    },
    {
      id: "grok",
      name: "xAI (Grok Series)",
      developer: "xAI",
      badge: "Grok 4.7 & Grok 4.6",
      category: "Proprietary & Frontier Labs",
      color: "border-sky-500/50 bg-gradient-to-br from-sky-950/30 to-slate-950/20",
      accent: "text-sky-400",
      icon: <Radio className="w-5 h-5 text-sky-400" />,
      desc: "Deeply integrated with real-time global telemetry and live X feeds. Grok 4.7 and Grok 4.6 focus on instantaneous truth-seeking, live web intelligence, zero-latency tool-use, and direct computational Python execution with flexible guardrails.",
      flagships: [
        "Grok 4.7: Real-time web & social telemetry stream integration",
        "Grok 4.6: Direct computational Python execution & mathematical tool-use"
      ],
      strengths: [
        "Sub-minute real-time global news ingestion",
        "Direct computational Python execution within reasoning loop",
        "Epistemically rigorous, flexible guardrails",
        "Deep multimodal vision and document breakdown",
      ],
      presets: [
        "Examine how real-time social telemetry streams are indexed into Grok 4.7 attention heads for live event synthesis",
        "Demonstrate how Grok 4.6 verifies quantum physics equations using native Python runtime execution",
      ],
    },

    // -------------------------------------------------------------------------
    // 2. OPEN-WEIGHT & GLOBAL POWERHOUSES
    // -------------------------------------------------------------------------
    {
      id: "deepseek",
      name: "DeepSeek (V4 Pro & R1)",
      developer: "DeepSeek AI",
      badge: "DeepSeek V4 Pro",
      category: "Open-Weight & Global Powerhouses",
      color: "border-blue-500/50 bg-gradient-to-br from-blue-950/30 to-indigo-950/20",
      accent: "text-blue-400",
      icon: <BrainCircuit className="w-5 h-5 text-blue-400" />,
      desc: "Gained massive global acclaim for DeepSeek V4 Pro and R1 reasoning architectures, combining Multi-Head Latent Attention (MLA) and fine-grained expert routing to achieve frontier proprietary performance at a fraction of compute cost.",
      flagships: [
        "DeepSeek V4 Pro: High-efficiency reasoning offering frontier benchmark performance",
        "DeepSeek-R1: Pure reinforcement learning without supervised fine-tuning"
      ],
      strengths: [
        "Multi-Head Latent Attention (MLA) 70%+ KV-cache compression",
        "DeepSeekMoE fine-grained expert routing efficiency",
        "Pure RL reasoning discovery without human labeling",
        "Unrivaled open-weight compute and cost economics",
      ],
      presets: [
        "Detail the mathematical architecture of Multi-Head Latent Attention (MLA) and how it compresses KV cache by over 70%",
        "Analyze DeepSeek V4 Pro fine-grained expert routing compared to classic Top-2 MoE gating",
        "Evaluate the competitive economics of running DeepSeek V4 Pro on private enterprise GPU clusters",
      ],
    },
    {
      id: "llama",
      name: "Meta (Llama 4 Series)",
      developer: "Meta AI",
      badge: "Llama 4 Scout & Maverick",
      category: "Open-Weight & Global Powerhouses",
      color: "border-indigo-500/50 bg-gradient-to-br from-indigo-950/30 to-slate-950/20",
      accent: "text-indigo-400",
      icon: <Boxes className="w-5 h-5 text-indigo-400" />,
      desc: "Meta's Llama models form the core backbone of the global open-source community. Llama 4 Scout and Llama 4 Maverick provide developers worldwide with high-capability foundational weights for local deployment, fine-tuning, and large context processing.",
      flagships: [
        "Llama 4 Scout: Core foundational open weights built for local deployment & fine-tuning",
        "Llama 4 Maverick: Optimized for large context windows & advanced agentic tooling"
      ],
      strengths: [
        "Foundation for thousands of fine-tuned derivatives and domain adapters",
        "Permissive weights for private enterprise cloud and on-premise security",
        "First-class optimization across vLLM, Ollama, and llama.cpp runtimes",
        "Extensive tool-use and safety alignment datasets",
      ],
      presets: [
        "Architect a private on-premise deployment of Llama 4 Scout using vLLM with PagedAttention and FP8 quantization",
        "Analyze how Llama 4 Maverick handles multi-turn agent tool calling with structured JSON constraints",
      ],
    },
    {
      id: "qwen",
      name: "Alibaba (Qwen Series)",
      developer: "Alibaba Cloud Intelligence",
      badge: "Qwen3.8 Max",
      category: "Open-Weight & Global Powerhouses",
      color: "border-orange-500/50 bg-gradient-to-br from-orange-950/30 to-amber-950/20",
      accent: "text-orange-400",
      icon: <Layers className="w-5 h-5 text-orange-400" />,
      desc: "Alibaba's flagship intelligence family. Qwen3.8 Max frequently tops international coding, reasoning, and STEM academic benchmarks worldwide, offering massive context windows and native vision-language processing.",
      flagships: [
        "Qwen3.8 Max: Flagship powerhouse for multilingual coding & academic STEM",
        "Qwen 2.5 Coder: Specialized state-of-the-art coding and algorithmic synthesis"
      ],
      strengths: [
        "State-of-the-art multilingual and cross-cultural understanding",
        "Superior mathematics and algorithmic code benchmark execution",
        "Scalable parameter tiers from 0.5B to 72B+ with RoPE scaling",
        "Native vision-language models (Qwen-VL) with high-res OCR",
      ],
      presets: [
        "Compare Qwen3.8 Max against frontier proprietary models on HumanEval and SWE-bench coding benchmarks",
        "Evaluate how Qwen's YaRN RoPE scaling maintains needle-in-a-haystack retrieval over 128k context windows",
      ],
    },
    {
      id: "zhipu",
      name: "Zhipu AI (GLM Series / Z.ai)",
      developer: "Zhipu AI (Z.ai)",
      badge: "GLM-5.3 & GLM-5",
      category: "Open-Weight & Global Powerhouses",
      color: "border-purple-500/50 bg-gradient-to-br from-purple-950/30 to-pink-950/20",
      accent: "text-purple-400",
      icon: <BrainCircuit className="w-5 h-5 text-purple-400" />,
      desc: "A leading international open-weight pioneer. GLM-5.3 and GLM-5 deliver advanced open-weight bilingual reasoning, tool-use loops, and industrial-scale autonomous agents across both enterprise and research workflows.",
      flagships: [
        "GLM-5.3: Advanced open-weight foundation model with bilingual mastery",
        "GLM-5: Deep autonomous agent tool integration and Python execution"
      ],
      strengths: [
        "General Language Model (GLM) bidirectional + autoregressive pretraining",
        "Unified agent loops integrating web browsing, code execution, and data analysis",
        "Exceptional Chinese-English cross-lingual reasoning",
        "High-efficiency inference across distributed heterogeneous clusters",
      ],
      presets: [
        "Detail how GLM-5.3's architecture balances autoregressive generation with bidirectional encoder attention",
        "Evaluate GLM-5's unified agent loop for multi-step data analysis with embedded Python execution engines",
      ],
    },
    {
      id: "kimi",
      name: "Moonshot AI (Kimi Series)",
      developer: "Moonshot AI",
      badge: "Kimi K3.1 Pro",
      category: "Open-Weight & Global Powerhouses",
      color: "border-teal-500/50 bg-gradient-to-br from-teal-950/30 to-emerald-950/20",
      accent: "text-teal-400",
      icon: <Search className="w-5 h-5 text-teal-400" />,
      desc: "Pioneers of ultra-long context windows. Kimi K3.1 Pro specializes in massive lossless multi-million token context windows, instant document corpus retrieval, deep code navigation, and complex mathematical problem solving.",
      flagships: [
        "Kimi K3.1 Pro: Long context reasoning, document synthesis & code navigation",
        "Kimi 2M+ Engine: Lossless KV cache compression for extreme documents"
      ],
      strengths: [
        "Extreme 2M+ token lossless context processing",
        "Zero-degradation long-document needle retrieval",
        "Deep software repository traversal and multi-file debugging",
        "Advanced mathematical and quantitative problem solving",
      ],
      presets: [
        "Analyze Moonshot Kimi's loss-less KV cache compression for processing 2 million consecutive tokens without degradation",
        "Evaluate Kimi K3.1 Pro's code navigation across an entire multi-repo monorepo",
      ],
    },
    {
      id: "mistral",
      name: "Mistral AI (Large 3 & MoE)",
      developer: "Mistral AI",
      badge: "Mistral Large 3",
      category: "Open-Weight & Global Powerhouses",
      color: "border-rose-500/50 bg-gradient-to-br from-rose-950/30 to-orange-950/20",
      accent: "text-rose-400",
      icon: <Cpu className="w-5 h-5 text-rose-400" />,
      desc: "European AI champion delivering Mistral Large 3 and sparse mixture-of-experts (SMoE) architectures that provide sovereign compliance, minimal VRAM footprints, and elite code synthesis.",
      flagships: [
        "Mistral Large 3: European sovereign efficiency and flagship reasoning",
        "Codestral 2: Ultra-fast fill-in-the-middle code completion engine"
      ],
      strengths: [
        "Sparse Mixture of Experts (SMoE) high parameter efficiency",
        "Exceptional fill-in-the-middle code synthesis with Codestral",
        "Adherence to European sovereign AI and GDPR compliance",
        "Ultra-low latency reasoning with minimal memory footprint",
      ],
      presets: [
        "Analyze the routing mechanics of Mistral Large 3 and how sparse experts minimize per-token compute",
        "Evaluate Codestral 2 fill-in-the-middle (FIM) capabilities for real-time IDE code completion",
      ],
    },

    // -------------------------------------------------------------------------
    // 3. SPECIALIZED & ECOSYSTEM PLATFORMS
    // -------------------------------------------------------------------------
    {
      id: "copilot",
      name: "Microsoft Copilot & Office Hub",
      developer: "Microsoft",
      badge: "Enterprise Productivity Bridge",
      category: "Specialized Platforms",
      color: "border-teal-500/50 bg-gradient-to-br from-teal-950/30 to-slate-950/20",
      accent: "text-teal-400",
      icon: <Briefcase className="w-5 h-5 text-teal-400" />,
      desc: "Bridges frontier generative intelligence directly into enterprise tools (Microsoft 365, Word, Excel, Teams, Outlook, and GitHub Copilot) through native Microsoft Graph contextual semantic indexing.",
      flagships: [
        "Microsoft 365 Copilot: Contextual enterprise intelligence across Office suite",
        "GitHub Copilot: Real-time IDE pair programmer & terminal agent"
      ],
      strengths: [
        "Native Microsoft Graph contextual indexing",
        "Deep spreadsheet formula and macro synthesis",
        "GitHub developer pipeline automation",
        "Enterprise-grade tenant data isolation",
      ],
      presets: [
        "Explain how Copilot utilizes Microsoft Graph semantic search to synthesize meetings from Outlook and Teams",
        "Formulate an enterprise workflow automating Excel financial consolidation via natural language directives",
      ],
    },
    {
      id: "perplexity",
      name: "Perplexity AI Discovery",
      developer: "Perplexity AI",
      badge: "Real-Time Web Search Synthesis",
      category: "Specialized Platforms",
      color: "border-cyan-500/50 bg-gradient-to-br from-cyan-950/30 to-teal-950/20",
      accent: "text-cyan-400",
      icon: <Search className="w-5 h-5 text-cyan-400" />,
      desc: "A dominant AI-powered search engine combining real-time multi-source web discovery with conversational synthesis, academic citations, and multi-step query decomposition for instant fact-checked answers.",
      flagships: [
        "Perplexity Pro Search: Multi-step query decomposition & consensus indexing",
        "Sonar API: Real-time web-grounded LLM inference for developers"
      ],
      strengths: [
        "Real-time web crawl and canonical URL citations",
        "Academic corpus filtering (Semantic Scholar, ArXiv)",
        "Pro Search multi-step query decomposition",
        "Zero-latency fact-checked summaries",
      ],
      presets: [
        "Synthesize verified citations comparing recent lithium-sulfur battery energy density breakthroughs from ArXiv and IEEE",
        "Demonstrate how Pro Search multi-step decomposition queries three distinct search engines to build consensus",
      ],
    },
    {
      id: "creative_spatial",
      name: "Creative & Spatial (Veo, Sora, Midjourney, ElevenLabs)",
      developer: "Google DeepMind, OpenAI, Midjourney, ElevenLabs",
      badge: "Generative Art & Spatial Video",
      category: "Specialized Platforms",
      color: "border-rose-500/50 bg-gradient-to-br from-rose-950/30 to-purple-950/20",
      accent: "text-rose-400",
      icon: <Film className="w-5 h-5 text-rose-400" />,
      desc: "Category-defining models engineered for specific high-fidelity modalities: Video generation (Google Veo, OpenAI Sora), Image synthesis (Midjourney), Neural voice (ElevenLabs), and Automotive spatial navigation (LiDAR, ADAS).",
      flagships: [
        "Google Veo & OpenAI Sora: Cinematic high-definition video diffusion",
        "Midjourney v6+: Photorealistic visual synthesis & style coherence",
        "ElevenLabs: Human-indistinguishable neural voice & emotion prosody"
      ],
      strengths: [
        "High-definition temporal video diffusion",
        "Physically grounded spatial fluid dynamics",
        "Human-indistinguishable neural voice synthesis",
        "Real-time LiDAR point-cloud automotive telemetry",
      ],
      presets: [
        "Compare Google Veo and OpenAI Sora: Spatio-temporal patch architectures, cinematic camera control, and physical consistency",
        "Explain how ElevenLabs neural voice models synthesize breath, vocal fry, and emotional inflection from raw text tokens",
        "Detail how spatial automotive AI models fuse real-time LiDAR, radar, and camera feeds to generate dynamic 3D occupancy grids",
      ],
    },
  ];

  /* -------------------------------------------------------------------------- */
  /*                    4. 6 FOUNDATIONAL PILLARS & RAG                         */
  /* -------------------------------------------------------------------------- */
  const foundationalPillars = [
    {
      id: "data_science_rag",
      name: "Data Science & In-Memory RAG",
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      subFeatures: ["rag_analysis", "statistical_inference", "predictive_modeling", "svg_visuals"],
      presets: [
        "Execute strict RAG semantic search on the document corpus: What is the average index resolution time and how does fault tolerance work?",
        "Compute two-sample Kolmogorov-Smirnov test and Welch's t-test formulation for comparing user conversion rates across A/B test cohorts",
      ],
    },
    {
      id: "software_dev",
      name: "Software Development & Systems",
      icon: <Code2 className="w-4 h-4 text-blue-400" />,
      subFeatures: ["code_synthesis", "vulnerability_scan", "live_execution_logic", "tool_schema"],
      presets: [
        "Synthesize a concurrent rate-limiter with sliding-window log algorithm and exponential backoff retry in " + targetLanguage,
        "Implement a lock-free ring buffer queue for high-frequency algorithmic trade order routing with atomic memory ordering",
      ],
    },
    {
      id: "multimodal",
      name: "Multimodal Reasoning & OCR",
      icon: <Eye className="w-4 h-4 text-purple-400" />,
      subFeatures: ["nlp_reasoning", "vision_ocr", "speech_prosody", "multimodal_fusion"],
      presets: [
        "Parse this user intent into a strict JSON schema containing sentiment, entities, and multi-turn conversational goals: 'I need to cancel my annual flight insurance immediately and get a refund receipt via email.'",
        "Synthesize emotional speech synthesis directives (pitch, rate, timbre, SSML markers) for an urgent flight safety announcement",
      ],
    },
    {
      id: "productivity_workflow",
      name: "Productivity & Autonomous Workflows",
      icon: <Workflow className="w-4 h-4 text-amber-400" />,
      subFeatures: ["dag_pipeline", "workspace_sync", "document_summary", "task_routing"],
      presets: [
        "Decompose this enterprise request into a multi-step DAG workflow: 'Ingest vendor invoices from Gmail, validate tax IDs via API, insert rows into Sheets, and notify Slack if total exceeds $10,000.'",
        "Draft an executive Google Docs strategy brief and matching Google Sheets financial formula matrix for Q3 AI infrastructure budget",
      ],
    },
    {
      id: "domain_intelligence",
      name: "Specialized STEM & Bioscience",
      icon: <Microscope className="w-4 h-4 text-rose-400" />,
      subFeatures: ["stem_bioscience", "quant_finance", "creative_screenwriting"],
      presets: [
        "Analyze the molecular binding affinity and residue contacts of Imatinib targeting the BCR-ABL kinase domain with AlphaFold confidence",
        "Calculate the 99% Value at Risk (VaR) and Conditional VaR (Expected Shortfall) using Monte Carlo simulation for a tech-heavy portfolio",
      ],
    },
    {
      id: "web_grounding",
      name: "Real-Time Web Grounding",
      icon: <Globe className="w-4 h-4 text-cyan-400" />,
      subFeatures: ["live_search", "citation_audit", "breaking_intel"],
      presets: [
        "Retrieve live real-time web facts: What are the newest developments, model architectures, or updates announced for Google Gemini 3.8 Flash and DeepMind AI?",
        "Check current market indices (NASDAQ, S&P 500, Gold, Bitcoin) with verified sources and key macroeconomic catalysts from today's live web",
      ],
    },
  ];

  /* -------------------------------------------------------------------------- */
  /*                         5. CONNECTED EDGE SUBSYSTEMS                       */
  /* -------------------------------------------------------------------------- */
  const edgeDomains = [
    {
      id: "mobile",
      label: "Mobile / OS Kernel",
      icon: <Smartphone className="w-4 h-4 text-cyan-400" />,
      desc: "Device kernel optimization, app intents & battery scheduling",
      presets: [
        "Optimize foreground background memory allocation for heavy camera capture",
        "Formulate an Android system intent schema for hands-free audio recording",
      ],
    },
    {
      id: "smarthome",
      label: "Smart Home IoT",
      icon: <Home className="w-4 h-4 text-indigo-400" />,
      desc: "Matter-over-Thread, environmental sensors & energy grid",
      presets: [
        "Design a Matter-over-Thread HVAC automation routine based on ambient lux & temp",
        "Synthesize home energy load-shedding protocol during peak grid tariff hours",
      ],
    },
    {
      id: "automotive",
      label: "Automotive Spatial",
      icon: <Car className="w-4 h-4 text-emerald-400" />,
      desc: "Vehicle telemetry, spatial LiDAR mapping & EV battery curves",
      presets: [
        "Compute optimal regen braking profile for steep mountain descent in wet asphalt",
        "Analyze 800V silicon-carbide inverter thermal efficiency curves during fast charging",
      ],
    },
    {
      id: "aerospace",
      label: "Aerospace Orbit",
      icon: <Rocket className="w-4 h-4 text-rose-400" />,
      desc: "Orbital mechanics, satellite telemetry & trajectory models",
      presets: [
        "Calculate delta-v budget for Hohmann transfer from LEO (400km) to GEO (35786km)",
        "Detail telemetry packet format for CCSDS standard space link protocols",
      ],
    },
    {
      id: "cloud",
      label: "Enterprise Cloud",
      icon: <Cloud className="w-4 h-4 text-blue-400" />,
      desc: "Distributed microservices, zero-trust mesh & serverless scaling",
      presets: [
        "Architect zero-trust service-to-service mTLS gateway topology on Kubernetes",
        "Formulate disaster recovery multi-region failover sequence with sub-second RTO",
      ],
    },
  ];

  /* -------------------------------------------------------------------------- */
  /*                             EXECUTION HANDLER                              */
  /* -------------------------------------------------------------------------- */
  const handleExecute = async (customQuery?: string) => {
    const textToRun = (customQuery || query).trim();
    if (!textToRun && !documentContent) return;
    if (loading) return;

    setLoading(true);
    const start = Date.now();

    try {
      let endpoint = "/api/ai-pillars/execute";
      let bodyPayload: any = {};

      if (activeTab === "assistants") {
        endpoint = "/api/universal/orchestrate";
        bodyPayload = {
          query: textToRun,
          assistant: selectedAssistant,
          contextData: { selectedAssistant },
        };
      } else if (activeTab === "categories") {
        bodyPayload = {
          pillar: "major_categories",
          subFeature: selectedCategory,
          input: textToRun,
          contextData: { selectedCategory },
        };
      } else if (activeTab === "architectures") {
        bodyPayload = {
          pillar: "architecture_types",
          subFeature: selectedArchitecture,
          input: textToRun,
          contextData: { selectedArchitecture },
        };
      } else if (activeTab === "ecosystems") {
        bodyPayload = {
          pillar: "ai_ecosystems",
          subFeature: selectedEcosystem,
          input: textToRun,
          contextData: { selectedEcosystem },
        };
      } else if (activeTab === "capabilities") {
        bodyPayload = {
          pillar: selectedPillar,
          subFeature: selectedSubFeature,
          input: textToRun,
          targetLanguage,
          documentText: selectedPillar === "data_science_rag" ? documentContent : undefined,
          contextData: { selectedPillar, selectedSubFeature },
        };
      } else {
        // edge_subsystems
        endpoint = "/api/universal/orchestrate";
        bodyPayload = {
          query: textToRun,
          domain: selectedDomain,
          contextData: { selectedDomain },
        };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      setLatency(Date.now() - start);
      setOutput(data);
    } catch (err: any) {
      setLatency(Date.now() - start);
      setOutput({
        success: false,
        response: "",
        error: err.message || "Failed to execute orchestration pipeline.",
        timestamp: new Date().toISOString(),
        executionMode: "live_server_side_sdk",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output?.response) return;
    navigator.clipboard.writeText(output.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFormattedMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="text-sm font-bold text-cyan-300 mt-3 mb-1 uppercase tracking-wider flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            {trimmed.slice(4)}
          </h3>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-base font-bold text-white mt-3 mb-1">
            {trimmed.slice(3)}
          </h2>
        );
      }
      if (trimmed.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-lg font-black text-cyan-200 mt-4 mb-2">
            {trimmed.slice(2)}
          </h1>
        );
      }
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote
            key={idx}
            className="p-3 my-2 rounded-lg bg-cyan-950/40 border-l-2 border-cyan-400 text-xs text-cyan-200 font-mono"
          >
            {trimmed.slice(2)}
          </blockquote>
        );
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <div key={idx} className="flex items-start gap-2 pl-2 text-slate-200 my-1 text-xs sm:text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
            <span>{trimmed.slice(2)}</span>
          </div>
        );
      }
      if (trimmed.startsWith("```")) {
        return (
          <div key={idx} className="my-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
            {trimmed}
          </div>
        );
      }
      return (
        <p key={idx} className="text-slate-200 leading-relaxed my-1 text-xs sm:text-sm">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 text-slate-100 max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Globe className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
              SARVAGYA Universal AI Ecosystem
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1 shadow-sm shrink-0">
              🇮🇳 Made in India • Aryan Sharma
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Conceived and created in India by <strong className="text-white font-semibold">Aryan Sharma</strong>. 100% real live server-side multi-model intelligence connecting premier Proprietary Frontier Labs and Open-Weight Powerhouses with zero mock data.
          </p>
        </div>

        {/* Global Hub Navigation Pills */}
        <div className="flex flex-wrap items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800 shrink-0 gap-1">
          <button
            onClick={() => setActiveTab("assistants")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "assistants"
                ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Universal Assistants
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "categories"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            1. Major Categories
          </button>
          <button
            onClick={() => setActiveTab("architectures")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "architectures"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            2. Core AI Types
          </button>
          <button
            onClick={() => setActiveTab("ecosystems")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "ecosystems"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            3. Famous Ecosystems
          </button>
          <button
            onClick={() => setActiveTab("capabilities")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "capabilities"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            4. RAG & Capabilities
          </button>
          <button
            onClick={() => setActiveTab("edge_subsystems")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "edge_subsystems"
                ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            5. Edge Subsystems
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/*                    TAB 0: UNIVERSAL ASSISTANTS MATRIX                     */}
      {/* ========================================================================= */}
      {activeTab === "assistants" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assistantsList.map((asst) => {
              const active = selectedAssistant === asst.id;
              return (
                <button
                  key={asst.id}
                  onClick={() => setSelectedAssistant(asst.id)}
                  className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                    active
                      ? `${asst.color} shadow-lg ring-1 ring-cyan-500/50`
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                        {asst.icon}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-slate-700">
                          {asst.badge}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {asst.company}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
                      {asst.name}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {asst.desc}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-[11px]">
                    {asst.specs.map((sp, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-400">
                        <span>{sp.label}:</span>
                        <span className="font-semibold text-slate-200">{sp.val}</span>
                      </div>
                    ))}
                  </div>

                  {active && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Assistant Presets Bar */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Assistant Prompts ({assistantsList.find((a) => a.id === selectedAssistant)?.name})
              </span>
              <span className="text-[11px] text-slate-400">
                Click any preset to load & execute directly via live server endpoint
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {assistantsList
                .find((a) => a.id === selectedAssistant)
                ?.presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(preset);
                      handleExecute(preset);
                    }}
                    className="text-left px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-cyan-950/60 text-slate-200 hover:text-cyan-300 border border-slate-700/80 text-xs transition-colors"
                  >
                    "{preset}"
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/*                      TAB 1: MAJOR CATEGORIES OF AI                        */}
      {/* ========================================================================= */}
      {activeTab === "categories" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {majorCategories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                    active
                      ? `${cat.color} shadow-lg ring-1 ring-cyan-500/50`
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                        {cat.icon}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-slate-700">
                        {cat.badge}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-[11px]">
                    {cat.specs.map((sp, i) => (
                      <div key={i} className="flex items-center justify-between text-slate-400">
                        <span>{sp.label}:</span>
                        <span className="font-mono text-slate-200 font-semibold">{sp.val}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Operational Presets for Category */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">
              Operational Theoretical Prompts (
              {majorCategories.find((c) => c.id === selectedCategory)?.title}):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {majorCategories
                .find((c) => c.id === selectedCategory)
                ?.presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(preset);
                      handleExecute(preset);
                    }}
                    className="text-left text-xs p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors flex items-start gap-2"
                  >
                    <span className="text-cyan-500 font-mono text-[10px] mt-0.5">#{idx + 1}</span>
                    <span className="leading-snug">{preset}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/*             TAB 2: CORE AI TYPES BY ARCHITECTURE & CAPABILITY             */}
      {/* ========================================================================= */}
      {activeTab === "architectures" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {architectureTypes.map((arch) => {
              const active = selectedArchitecture === arch.id;
              return (
                <button
                  key={arch.id}
                  onClick={() => setSelectedArchitecture(arch.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    active
                      ? "bg-slate-900/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40"
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                        {arch.icon}
                      </span>
                      {active && (
                        <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white mb-1">
                      {arch.title}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                      {arch.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800/60">
                    {arch.traits.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Architectural Analysis Presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">
              Architectural Deep-Dive Presets (
              {architectureTypes.find((a) => a.id === selectedArchitecture)?.title}):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {architectureTypes
                .find((a) => a.id === selectedArchitecture)
                ?.presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(preset);
                      handleExecute(preset);
                    }}
                    className="text-left text-xs p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors flex items-start gap-2"
                  >
                    <span className="text-cyan-500 font-mono text-[10px] mt-0.5">#{idx + 1}</span>
                    <span className="leading-snug">{preset}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/*                 TAB 3: FAMOUS AI MODELS AND ECOSYSTEMS                    */}
      {/* ========================================================================= */}
      {activeTab === "ecosystems" && (
        <div className="space-y-5">
          {/* Specialized Industry Lanes Snapshot */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90 border border-slate-800 space-y-3 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                4 Specialized Strategic AI Lanes
              </span>
              <span className="text-[11px] text-slate-400">Global AI Landscape Overview</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-emerald-400">1. Frontier Reasoning & Agents</span>
                <p className="text-xs text-white font-semibold mt-0.5">OpenAI GPT & Claude</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">Multi-step reasoning, test-time compute, software architecture, and deep agentic workflows.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-cyan-400">2. Native Multimodality</span>
                <p className="text-xs text-white font-semibold mt-0.5">Google Gemini Ecosystem</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">Simultaneous native processing across text, audio, video, vision, and massive 1M+ token codebases.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-blue-400">3. Open-Weights Empowerment</span>
                <p className="text-xs text-white font-semibold mt-0.5">DeepSeek, Qwen, Llama, Mistral</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">Democratized high-performance weights, MoE efficiency, self-hosting, and local private cloud.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-purple-400">4. Ecosystem & Vertical</span>
                <p className="text-xs text-white font-semibold mt-0.5">Copilot, Perplexity, Kimi, GLM</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">Direct enterprise productivity bridges, real-time web discovery, and long-context regional leaders.</p>
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Ecosystems (" + famousEcosystems.length + ")" },
              { id: "Proprietary & Frontier Labs", label: "1. Proprietary & Frontier Labs (4)" },
              { id: "Open-Weight & Global Powerhouses", label: "2. Open-Weight & Global Powerhouses (6)" },
              { id: "Specialized Platforms", label: "3. Specialized Platforms (3)" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setEcosystemCategoryFilter(cat.id)}
                className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all border " + (
                  ecosystemCategoryFilter === cat.id
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {famousEcosystems
              .filter(
                (eco) =>
                  ecosystemCategoryFilter === "all" ||
                  eco.category === ecosystemCategoryFilter
              )
              .map((eco: any) => {
              const active = selectedEcosystem === eco.id;
              return (
                <button
                  key={eco.id}
                  onClick={() => setSelectedEcosystem(eco.id)}
                  className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    active
                      ? `${eco.color} shadow-lg ring-1 ring-cyan-500/50`
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                        {eco.icon}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-slate-700">
                        {eco.badge}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-400 mb-0.5">
                      {eco.developer}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-2">
                      {eco.name}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {eco.desc}
                    </p>
                    {eco.flagships && (
                      <div className="mb-3 p-2 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          Flagship Model Roster
                        </div>
                        {eco.flagships.map((f: string, fi: number) => (
                          <div key={fi} className="text-[11px] text-slate-200 flex items-start gap-1.5 leading-tight">
                            <span className="text-cyan-400 font-bold shrink-0">•</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 pt-2.5 border-t border-slate-800/80">
                    {eco.strengths.map((str: string, i: number) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Ecosystem Comparative Presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">
              Comparative Analysis & Benchmarking Presets (
              {famousEcosystems.find((e) => e.id === selectedEcosystem)?.name}):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {famousEcosystems
                .find((e) => e.id === selectedEcosystem)
                ?.presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(preset);
                      handleExecute(preset);
                    }}
                    className="text-left text-xs p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors flex items-start gap-2"
                  >
                    <span className="text-cyan-500 font-mono text-[10px] mt-0.5">#{idx + 1}</span>
                    <span className="leading-snug">{preset}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/*                 TAB 4: 6 FOUNDATIONAL PILLARS & RAG                       */}
      {/* ========================================================================= */}
      {activeTab === "capabilities" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {foundationalPillars.map((p) => {
              const active = selectedPillar === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPillar(p.id);
                    setSelectedSubFeature(p.subFeatures[0]);
                  }}
                  className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    active
                      ? "bg-slate-900/90 border-cyan-500/50 shadow-lg ring-1 ring-cyan-500/30"
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                      {p.icon}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white">{p.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.subFeatures.map((sf) => (
                      <span
                        key={sf}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300"
                      >
                        {sf}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* RAG In-Memory Corpus (if data_science_rag selected) */}
          {selectedPillar === "data_science_rag" && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  RAG Document Corpus (In-Memory Semantic Index)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {documentContent.length} chars indexed
                </span>
              </div>
              <textarea
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">
              Capability Test Presets:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {foundationalPillars
                .find((p) => p.id === selectedPillar)
                ?.presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(preset);
                      handleExecute(preset);
                    }}
                    className="text-left text-xs p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors flex items-start gap-2"
                  >
                    <span className="text-cyan-500 font-mono text-[10px] mt-0.5">#{idx + 1}</span>
                    <span className="leading-snug">{preset}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/*                      TAB 5: CONNECTED EDGE SUBSYSTEMS                     */}
      {/* ========================================================================= */}
      {activeTab === "edge_subsystems" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {edgeDomains.map((d) => {
              const active = selectedDomain === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDomain(d.id)}
                  className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                    active
                      ? "bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40"
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`p-1.5 rounded-lg border ${
                        active
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {d.icon}
                    </span>
                    {active && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mb-0.5">{d.label}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{d.desc}</div>
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">
              Edge Telemetry Presets:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {edgeDomains
                .find((d) => d.id === selectedDomain)
                ?.presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(preset);
                      handleExecute(preset);
                    }}
                    className="text-left text-xs p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors flex items-start gap-2"
                  >
                    <span className="text-cyan-500 font-mono text-[10px] mt-0.5">#{idx + 1}</span>
                    <span className="leading-snug">{preset}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/*                         UNIVERSAL DISPATCH CONSOLE                        */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Live Execution Console (
            {activeTab === "categories"
              ? majorCategories.find((c) => c.id === selectedCategory)?.title
              : activeTab === "architectures"
              ? architectureTypes.find((a) => a.id === selectedArchitecture)?.title
              : activeTab === "ecosystems"
              ? famousEcosystems.find((e) => e.id === selectedEcosystem)?.name
              : activeTab === "capabilities"
              ? selectedPillar
              : selectedDomain}
            )
          </label>
          <span className="text-[11px] text-slate-500 font-mono">
            Powered by Official Google GenAI SDK • Live Search Grounding
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleExecute();
            }}
            placeholder="Enter custom prompt or click any verified preset above..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
          />
          <button
            onClick={() => handleExecute()}
            disabled={loading || (!query.trim() && !documentContent)}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-slate-950" />
                <span>Dispatch</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/*                            OUTPUT CONSOLE CARD                            */}
      {/* ========================================================================= */}
      {output && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          {/* Telemetry Header */}
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white tracking-wide uppercase">
                {output.pillar || output.domain || "Execution Synthesis"}
              </span>
              {output.subFeature && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {output.subFeature}
                </span>
              )}
              {output.modelUsed && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {output.modelUsed}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {latency && (
                <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  {latency}ms
                </span>
              )}
              <span className="text-slate-500 text-[11px] font-mono">
                {new Date(output.timestamp).toLocaleTimeString()}
              </span>
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                title="Copy Output"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Response Content */}
          <div className="p-5 font-sans text-xs sm:text-sm">
            {output.error ? (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300">
                ⚠️ {output.error}
              </div>
            ) : (
              renderFormattedMarkdown(output.response)
            )}
          </div>

          {/* Real-time Web Grounding Citations */}
          {output.sources && output.sources.length > 0 && (
            <div className="px-5 py-3 bg-slate-950/70 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Real-Time Web Grounding ({output.sources.length} sources retrieved)
              </div>
              <div className="flex flex-wrap gap-2">
                {output.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate max-w-[200px]">{src.title || src.uri}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
