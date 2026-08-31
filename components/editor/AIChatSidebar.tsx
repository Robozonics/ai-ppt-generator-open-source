"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Loader2, X, Sparkles } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIChatSidebarProps {
  activeCardId: string | null;
  onModifyCard: (instruction: string) => Promise<void>;
}

export function AIChatSidebar({ activeCardId, onModifyCard }: AIChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsLoading(true);

    try {
      await onModifyCard(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "✅ Card updated successfully." },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `❌ Error: ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Floating toggle button when sidebar is closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-2xl shadow-2xl shadow-indigo-900/40 transition-all hover:scale-105"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 z-50 h-screen w-[380px] bg-[#0d1117]/95 backdrop-blur-xl border-l border-white/10 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          AI Editor
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Status bar */}
      <div className="px-5 py-3 border-b border-white/5 text-sm">
        {activeCardId ? (
          <span className="text-indigo-300">
            ● Editing card <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono">{activeCardId}</code>
          </span>
        ) : (
          <span className="text-slate-500">Click a slide to select it first.</span>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm mt-12 space-y-2">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-600 mb-4" />
            <p>Select a slide and describe what you want to change.</p>
            <p className="text-xs text-slate-600">e.g. &quot;Make the title more impactful&quot; or &quot;Change layout to metrics&quot;</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm leading-relaxed rounded-xl px-4 py-3 max-w-[90%] ${
              msg.role === "user"
                ? "bg-indigo-500/20 text-indigo-100 ml-auto"
                : "bg-white/5 text-slate-300"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Modifying slide...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4 shrink-0">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder={activeCardId ? "Describe the change..." : "Select a slide first"}
            disabled={!activeCardId || isLoading}
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500 disabled:opacity-40"
          />
          <button
            onClick={handleSubmit}
            disabled={!activeCardId || !input.trim() || isLoading}
            className="text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 disabled:hover:text-slate-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
