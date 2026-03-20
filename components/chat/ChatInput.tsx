"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppMode } from "@/types";
import { MODE_CONFIG, MYSTERY_ACTIONS, DEBATE_ACTIONS } from "@/lib/constants";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  hasMessages: boolean;
  mode: AppMode;
}

const COFOUNDER_SUGGESTIONS = [
  "What's my biggest blindspot?",
  "Who are my real competitors?",
  "What would kill this idea?",
  "Give me a 90-day plan",
];

export default function ChatInput({ onSend, isLoading, hasMessages, mode }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cfg = MODE_CONFIG[mode];

  const quickActions =
    mode === "mystery" ? MYSTERY_ACTIONS :
    mode === "debate" ? DEBATE_ACTIONS :
    COFOUNDER_SUGGESTIONS.map((s) => ({ label: s, prompt: s, icon: "→" }));

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value);
    setValue("");
    setShowSuggestions(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  const placeholder =
    mode === "mystery"
      ? hasMessages ? "Investigate, interrogate, or accuse..." : "Start the mystery..."
      : mode === "debate"
      ? hasMessages ? "Counter-argue, present evidence, or double down..." : "State your position..."
      : hasMessages ? "Push back, ask more, or pivot..." : "Describe your startup idea...";

  return (
    <div className="relative">
      {/* Quick actions popup */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full mb-2 left-0 right-0 rounded-xl overflow-hidden"
            style={{
              background: "rgba(8,8,14,0.98)",
              border: `1px solid rgba(${cfg.accentRgb},0.2)`,
              backdropFilter: "blur(20px)",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <div className="px-3 py-2 text-xs font-mono tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.2)", borderBottom: `1px solid rgba(${cfg.accentRgb},0.1)` }}>
              {mode === "mystery" ? "Quick actions" : mode === "debate" ? "Debate moves" : "Suggestions"}
            </div>
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => { onSend(a.prompt); setShowSuggestions(false); }}
                className="w-full text-left px-4 py-2.5 text-sm transition-all hover:bg-white/5 flex items-center gap-2"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                <span style={{ color: cfg.accent }}>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input wrapper */}
      <div
        className="flex items-end gap-2 rounded-2xl p-3 transition-all duration-200"
        style={{
          background: "rgba(12,12,20,0.95)",
          border: `1px solid rgba(${cfg.accentRgb},0.18)`,
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Suggestions toggle */}
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-105 active:scale-95 mb-0.5"
          style={{
            background: showSuggestions ? `rgba(${cfg.accentRgb},0.2)` : `rgba(${cfg.accentRgb},0.08)`,
            border: `1px solid rgba(${cfg.accentRgb},0.2)`,
            color: showSuggestions ? cfg.accent : "rgba(255,255,255,0.3)",
          }}
        >
          {mode === "mystery" ? "🔦" : mode === "debate" ? "⚔️" : "⚡"}
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed"
          style={{
            color: "#F0F0FF",
            minHeight: "36px",
            maxHeight: "160px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />

        {/* Send */}
        <motion.button
          whileHover={!isLoading && value.trim() ? { scale: 1.05 } : {}}
          whileTap={!isLoading && value.trim() ? { scale: 0.95 } : {}}
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all mb-0.5"
          style={{
            background: value.trim() && !isLoading
              ? `linear-gradient(135deg, ${cfg.accent}, ${cfg.hotAccent})`
              : `rgba(${cfg.accentRgb},0.1)`,
            border: value.trim() && !isLoading ? "none" : `1px solid rgba(${cfg.accentRgb},0.2)`,
            color: value.trim() && !isLoading ? "white" : "rgba(255,255,255,0.2)",
            cursor: !value.trim() || isLoading ? "not-allowed" : "pointer",
            boxShadow: value.trim() && !isLoading ? `0 0 16px rgba(${cfg.accentRgb},0.35)` : "none",
          }}
        >
          {isLoading ? (
            <motion.div
              className="w-3 h-3 border-2 rounded-full"
              style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: cfg.accent }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : "↑"}
        </motion.button>
      </div>

      <div className="text-center text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.15)" }}>
        Enter to send · Shift+Enter for new line
      </div>
    </div>
  );
}
