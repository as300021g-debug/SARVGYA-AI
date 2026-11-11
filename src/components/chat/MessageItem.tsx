import React, { useState } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  Edit2,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ExternalLink,
  Code2,
  User,
} from "lucide-react";
import { ChatMessage, ArtifactItem } from "../../types";

interface MessageItemProps {
  message: ChatMessage;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  onEditMessage?: (newContent: string) => void;
  onOpenArtifact?: (artifact: ArtifactItem) => void;
  onPlayTTS?: (text: string) => void;
  onStopTTS?: () => void;
  isPlayingTTS?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isStreaming = false,
  onRegenerate,
  onEditMessage,
  onOpenArtifact,
  onPlayTTS,
  onStopTTS,
  isPlayingTTS = false,
}) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && onEditMessage) {
      onEditMessage(editContent.trim());
      setIsEditing(false);
    }
  };

  // Helper to extract code blocks and render with syntax highlighting & artifact buttons
  const renderFormattedContent = (content: string) => {
    // Check if the message contains code blocks
    const codeBlockRegex = /```([a-zA-Z0-9_\-\+]*)\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const precedingText = content.substring(lastIndex, match.index);
      if (precedingText) {
        parts.push(
          <div key={`text-${blockIndex}`} className="prose-content whitespace-pre-wrap leading-relaxed">
            {renderMarkdown(precedingText)}
          </div>
        );
      }

      const lang = match[1]?.trim().toLowerCase() || "code";
      const codeSnippet = match[2];
      const isWebSnippet = ["html", "svg", "react", "jsx", "tsx", "xml"].includes(lang) ||
        codeSnippet.includes("<html") ||
        codeSnippet.includes("<svg") ||
        codeSnippet.includes("export default function");

      const currentArtifact: ArtifactItem = {
        id: `art-${message.id}-${blockIndex}`,
        title: isWebSnippet
          ? `${lang.toUpperCase()} Component`
          : `${lang.toUpperCase()} Script`,
        type: lang === "svg" ? "svg" : lang === "html" ? "html" : "code",
        language: lang,
        content: codeSnippet,
      };

      parts.push(
        <div
          key={`code-${blockIndex}`}
          className="my-3 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950/90 shadow-md font-mono text-xs"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
              {lang || "code"}
            </span>

            <div className="flex items-center gap-1.5">
              {isWebSnippet && onOpenArtifact && (
                <button
                  type="button"
                  onClick={() => onOpenArtifact(currentArtifact)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/30 transition"
                  title="Open live preview in Artifact panel"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Preview</span>
                </button>
              )}

              <CopyCodeButton code={codeSnippet} />
            </div>
          </div>

          {/* Code body */}
          <pre className="p-3.5 overflow-x-auto text-slate-200 leading-relaxed selection:bg-indigo-500/30">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
      blockIndex++;
    }

    const remainingText = content.substring(lastIndex);
    if (remainingText) {
      parts.push(
        <div key={`text-final`} className="prose-content whitespace-pre-wrap leading-relaxed">
          {renderMarkdown(remainingText)}
        </div>
      );
    }

    return parts;
  };

  // Basic Markdown Renderer: bold, italics, headers, lists, blockquotes, equations
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // H3
      if (line.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-base font-bold text-slate-100 mt-3 mb-1">
            {formatInline(line.slice(4))}
          </h3>
        );
      }
      // H2
      if (line.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-lg font-bold text-slate-100 mt-4 mb-2 pb-1 border-b border-slate-800/80">
            {formatInline(line.slice(3))}
          </h2>
        );
      }
      // H1
      if (line.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-xl font-extrabold text-slate-100 mt-5 mb-3">
            {formatInline(line.slice(2))}
          </h1>
        );
      }
      // Bullet list
      if (line.match(/^[\*\-]\s+/)) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-2">
            <span className="text-indigo-400 mt-1 text-sm">•</span>
            <span className="flex-1">{formatInline(line.replace(/^[\*\-]\s+/, ""))}</span>
          </div>
        );
      }
      // Numbered list
      if (line.match(/^\d+\.\s+/)) {
        const num = line.match(/^\d+\./)?.[0] || "1.";
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-2">
            <span className="text-slate-400 font-mono text-xs mt-0.5">{num}</span>
            <span className="flex-1">{formatInline(line.replace(/^\d+\.\s+/, ""))}</span>
          </div>
        );
      }
      // Blockquote
      if (line.startsWith("> ")) {
        return (
          <blockquote key={idx} className="border-l-2 border-indigo-500 pl-3 my-2 text-slate-400 italic">
            {formatInline(line.slice(2))}
          </blockquote>
        );
      }
      // Horizontal rule
      if (line.trim() === "---" || line.trim() === "***") {
        return <hr key={idx} className="border-slate-800 my-4" />;
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1">
          {formatInline(line)}
        </p>
      );
    });
  };

  // Inline formatting: bold (**text**), code (`code`), math ($x$), italics (*text*)
  const formatInline = (str: string) => {
    // Regex splits by code, bold, math, italic
    const parts = str.split(/(\`[^\`]+\`|\*\*[^\*]+\*\*|\*[^\*]+\*|\$[^\$]+\$)/g);

    return parts.map((part, i) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-xs border border-slate-700/60">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-slate-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={i} className="italic text-slate-300">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith("$") && part.endsWith("$")) {
        return (
          <span key={i} className="font-mono text-indigo-300 bg-indigo-950/40 px-1 py-0.5 rounded text-xs">
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className={`w-full py-4 transition-colors ${isUser ? "flex justify-end" : "flex justify-start"}`}>
      <div className={`flex gap-3 max-w-3xl ${isUser ? "flex-row-reverse" : "flex-row"} w-full`}>
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-xs font-semibold shadow-md">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 text-white flex items-center justify-center text-xs shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Message Container */}
        <div className={`flex flex-col flex-1 min-w-0 ${isUser ? "items-end" : "items-start"}`}>
          {/* Header Metadata */}
          <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">
              {isUser ? "You" : message.modelUsed || "SARVAGYA AI"}
            </span>
            <span className="text-[10px] text-slate-500">{message.timestamp}</span>
          </div>

          {/* Bubble / Text Body */}
          {isUser ? (
            isEditing ? (
              <div className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 shadow-lg">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-transparent text-slate-100 text-sm focus:outline-none resize-none min-h-[70px]"
                />
                <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-2.5 py-1 text-xs rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                  >
                    Save & Submit
                  </button>
                </div>
              </div>
            ) : (
              <div className="group relative px-4 py-2.5 rounded-2xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-sm shadow-md leading-relaxed selection:bg-indigo-300 selection:text-indigo-950">
                <div className="whitespace-pre-wrap">{message.content}</div>

                {/* Edit Button on hover */}
                {onEditMessage && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="absolute -left-8 top-2 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition"
                    title="Edit Message"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )
          ) : (
            <div className="w-full text-slate-200 text-sm leading-relaxed selection:bg-indigo-500/30">
              {message.content ? (
                <div>
                  {renderFormattedContent(message.content)}
                  {isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />
                  )}
                </div>
              ) : isStreaming ? (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-2 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  <span>Thinking and synthesizing...</span>
                </div>
              ) : (
                <p className="text-slate-400 italic">No content generated.</p>
              )}

              {/* Citations / Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Verified Live Citations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {message.sources.slice(0, 4).map((s, idx) => (
                      <a
                        key={idx}
                        href={s.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 hover:text-indigo-300 transition"
                      >
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[200px]">{s.title || s.uri}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Toolbar on Bottom */}
              {!isStreaming && message.content && (
                <div className="flex items-center gap-1 mt-3 pt-1 text-slate-400">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800 transition text-xs flex items-center gap-1"
                    title="Copy message"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  {onRegenerate && (
                    <button
                      type="button"
                      onClick={onRegenerate}
                      className="p-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800 transition text-xs flex items-center gap-1"
                      title="Regenerate response"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onPlayTTS && (
                    <button
                      type="button"
                      onClick={() => (isPlayingTTS && onStopTTS ? onStopTTS() : onPlayTTS(message.content))}
                      className="p-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800 transition text-xs flex items-center gap-1"
                      title={isPlayingTTS ? "Stop voice audio" : "Read aloud"}
                    >
                      {isPlayingTTS ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  <div className="w-[1px] h-3 bg-slate-800 mx-1" />

                  <button
                    type="button"
                    onClick={() => setFeedback(feedback === "up" ? null : "up")}
                    className={`p-1.5 rounded-lg hover:bg-slate-800 transition ${
                      feedback === "up" ? "text-emerald-400 bg-emerald-500/10" : "hover:text-slate-200"
                    }`}
                    title="Helpful"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedback(feedback === "down" ? null : "down")}
                    className={`p-1.5 rounded-lg hover:bg-slate-800 transition ${
                      feedback === "down" ? "text-rose-400 bg-rose-500/10" : "hover:text-slate-200"
                    }`}
                    title="Needs improvement"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Copy code button helper
const CopyCodeButton: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
      title="Copy Code"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
};
