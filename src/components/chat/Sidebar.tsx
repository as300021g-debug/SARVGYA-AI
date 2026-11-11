import React, { useState } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Pin,
  Trash2,
  Edit2,
  Sparkles,
  Compass,
  FolderKanban,
  Image as ImageIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  Layers,
  Check,
  X,
  Zap,
} from "lucide-react";
import { ConversationSession, ActiveTab, UserProfile } from "../../types";

interface SidebarProps {
  conversations: ConversationSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onTogglePinChat: (id: string) => void;
  onOpenSettings: () => void;
  onOpenExploreGPTs: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  activeTab: ActiveTab;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userProfile?: UserProfile;
  onSelectAstraMode?: () => void;
  onSelectStandardChat?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onTogglePinChat,
  onOpenSettings,
  onOpenExploreGPTs,
  onNavigateTab,
  activeTab,
  isCollapsed,
  onToggleCollapse,
  userProfile,
  onSelectAstraMode,
  onSelectStandardChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleStartRename = (chat: ConversationSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingChatId(null);
  };

  // Group conversations chronologically: Today, Yesterday, Previous 7 Days, Older
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedChats = filteredConversations.filter((c) => c.pinned);
  const unpinnedChats = filteredConversations.filter((c) => !c.pinned);

  const todayChats = unpinnedChats.filter((c) => now - c.updatedAt < ONE_DAY);
  const yesterdayChats = unpinnedChats.filter(
    (c) => now - c.updatedAt >= ONE_DAY && now - c.updatedAt < 2 * ONE_DAY
  );
  const pastWeekChats = unpinnedChats.filter(
    (c) => now - c.updatedAt >= 2 * ONE_DAY && now - c.updatedAt < 7 * ONE_DAY
  );
  const olderChats = unpinnedChats.filter((c) => now - c.updatedAt >= 7 * ONE_DAY);

  const renderChatGroup = (title: string, list: ConversationSession[]) => {
    if (list.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="px-3 mb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </div>
        <div className="space-y-0.5">
          {list.map((chat) => {
            const isActive = chat.id === activeChatId;
            const isEditingThis = editingChatId === chat.id;

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition ${
                  isActive
                    ? "bg-slate-800 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                {isEditingThis ? (
                  <div
                    className="flex items-center gap-1 w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveRename(chat.id, e);
                        if (e.key === "Escape") setEditingChatId(null);
                      }}
                      autoFocus
                      className="w-full bg-slate-950 text-white px-2 py-1 rounded text-xs border border-slate-700 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleSaveRename(chat.id, e)}
                      className="p-1 text-emerald-400 hover:text-emerald-300"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingChatId(null)}
                      className="p-1 text-slate-400 hover:text-slate-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                      <span className="truncate">{chat.title}</span>
                    </div>

                    {/* Action buttons on hover */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition shrink-0 ml-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePinChat(chat.id);
                        }}
                        className={`p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition ${
                          chat.pinned ? "text-amber-400" : ""
                        }`}
                        title={chat.pinned ? "Unpin chat" : "Pin chat"}
                      >
                        <Pin className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleStartRename(chat, e)}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                        title="Rename chat"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Collapsed Sidebar View (64px)
  if (isCollapsed) {
    return (
      <aside className="w-16 h-full border-r border-slate-800 bg-slate-950 flex flex-col items-center py-3 justify-between z-20 shrink-0">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onNewChat}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition"
            title="New Chat (Ctrl+K)"
          >
            <Plus className="w-5 h-5" />
          </button>

          <div className="w-8 h-[1px] bg-slate-800 my-1" />

          <button
            type="button"
            onClick={() => {
              if (onSelectAstraMode) onSelectAstraMode();
              else onNavigateTab("astra");
            }}
            className={`p-2 rounded-xl transition ${
              activeTab === "astra"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-slate-400 hover:text-amber-300 hover:bg-slate-900"
            }`}
            title="Astra Advanced Mode"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenExploreGPTs}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
            title="Explore GPTs"
          >
            <Compass className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("creative")}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
            title="Images Gallery"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("agent-workbench")}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
            title="Specialist Agent Hub"
          >
            <Bot className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {userProfile?.name?.charAt(0) || "U"}
          </div>
        </div>
      </aside>
    );
  }

  // Expanded Sidebar View (280px)
  return (
    <aside className="w-72 h-full border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between z-20 shrink-0 transition-all select-none">
      {/* Top Header: Logo & Collapse Trigger */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-100 tracking-tight block">
                SARVAGYA
              </span>
              <span className="text-[10px] text-indigo-400 font-mono tracking-wider block -mt-0.5">
                SUPER AI PLATFORM
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
            title="Collapse Sidebar (Ctrl+B)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          type="button"
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white transition shadow-sm text-xs font-semibold group"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400 group-hover:rotate-90 transition-transform duration-200" />
            <span>New chat</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">⌘K</span>
        </button>

        {/* Search Chats Input */}
        <div className="relative mt-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
          />
        </div>
      </div>

      {/* Main Navigation & Chat History */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Quick Modes Section */}
        <div className="space-y-0.5 mb-3 pb-3 border-b border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              if (onSelectStandardChat) onSelectStandardChat();
              else onNavigateTab("chat");
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === "chat"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-900/60"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Standard Chat</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSelectAstraMode) onSelectAstraMode();
              else onNavigateTab("astra");
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === "astra"
                ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md shadow-amber-600/30"
                : "text-amber-300 hover:text-amber-200 hover:bg-amber-950/30"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Astra Advanced Mode</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Pro
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenExploreGPTs}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900/60 transition"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            <span>Explore GPTs</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("creative")}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900/60 transition"
          >
            <ImageIcon className="w-4 h-4 text-slate-400" />
            <span>Images & Creative Studio</span>
          </button>
        </div>

        {/* Chat History Groups */}
        {renderChatGroup("Pinned", pinnedChats)}
        {renderChatGroup("Today", todayChats)}
        {renderChatGroup("Yesterday", yesterdayChats)}
        {renderChatGroup("Previous 7 Days", pastWeekChats)}
        {renderChatGroup("Older", olderChats)}

        {conversations.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-500">
            No conversations yet. Start a new chat to begin.
          </div>
        )}
      </div>

      {/* Footer: User Profile & Settings */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-1">
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
        >
          <Settings className="w-4 h-4" />
          <span>Settings & Preferences</span>
        </button>

        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {userProfile?.name?.charAt(0) || "U"}
            </div>
            <div className="truncate">
              <span className="text-xs font-semibold text-slate-200 block truncate">
                {userProfile?.name || "Commander"}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block">
                Enterprise Active
              </span>
            </div>
          </div>

          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
            v2.4
          </span>
        </div>
      </div>
    </aside>
  );
};
