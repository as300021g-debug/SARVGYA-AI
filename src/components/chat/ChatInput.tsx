import React, { useRef, useEffect } from "react";
import {
  ArrowUp,
  Square,
  Plus,
  Image as ImageIcon,
  FileText,
  X,
  Mic,
  MicOff,
  Globe,
  Sparkles,
} from "lucide-react";

interface Attachment {
  data: string;
  mimeType: string;
  name?: string;
  previewUrl?: string;
}

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  onStop?: () => void;
  isStreaming: boolean;
  attachments: Attachment[];
  onAddAttachment: (att: Attachment) => void;
  onRemoveAttachment: (index: number) => void;
  enableSearch: boolean;
  onToggleSearch: () => void;
  isListening: boolean;
  onToggleVoice: () => void;
  activeModelName?: string;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  isStreaming,
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  enableSearch,
  onToggleSearch,
  isListening,
  onToggleVoice,
  activeModelName = "Standard AI",
  placeholder = "Message SARVAGYA AI... (Shift+Enter for newline)",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const nextHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${Math.max(nextHeight, 48)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && (input.trim() || attachments.length > 0)) {
        onSend();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const isImg = file.type.startsWith("image/");

      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        onAddAttachment({
          data: base64,
          mimeType: file.type || "application/octet-stream",
          name: file.name,
          previewUrl: isImg ? result : undefined,
        });
      };

      reader.readAsDataURL(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          {attachments.map((att, i) => (
            <div
              key={i}
              className="group relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200"
            >
              {att.previewUrl ? (
                <img
                  src={att.previewUrl}
                  alt={att.name || "Preview"}
                  className="w-7 h-7 object-cover rounded-md"
                />
              ) : (
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
              )}
              <span className="truncate max-w-[120px] font-mono text-[11px]">
                {att.name || "Attachment"}
              </span>
              <button
                type="button"
                onClick={() => onRemoveAttachment(i)}
                className="p-0.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Floating Composer Container */}
      <div className="relative flex flex-col rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl transition-all focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,text/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full px-5 pt-3.5 pb-2 bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none resize-none leading-relaxed min-h-[48px] max-h-[200px]"
        />

        {/* Bottom Bar: Action buttons & Send trigger */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800/60">
          {/* Left Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Attach Images or Documents"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Web Search Grounding Toggle */}
            <button
              type="button"
              onClick={onToggleSearch}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition border ${
                enableSearch
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  : "bg-slate-800/50 text-slate-500 border-slate-700/50 hover:text-slate-300"
              }`}
              title="Live Google Search Grounding"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Search {enableSearch ? "On" : "Off"}</span>
            </button>

            {/* Model Badge */}
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-950/60 border border-slate-800">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{activeModelName}</span>
            </span>
          </div>

          {/* Right Buttons: Voice & Send */}
          <div className="flex items-center gap-2">
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={onToggleVoice}
              className={`p-2 rounded-full transition ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
              title={isListening ? "Listening... Click to stop" : "Speak message"}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Send / Stop Button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-md"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSend}
                disabled={!input.trim() && attachments.length === 0}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-md ${
                  input.trim() || attachments.length > 0
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed"
                }`}
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-2">
        <span className="text-[11px] text-slate-400">
          SARVAGYA AI can make mistakes. Verify critical facts & financial quotes.
        </span>
      </div>
    </div>
  );
};
