"use client";

import { motion } from "framer-motion";
import { AppMode } from "@/types";
import { MODE_CONFIG } from "@/lib/constants";
import ModeSwitcher from "./ModeSwitcher";

interface HeaderProps {
  mode: AppMode;
  onModeSwitch: (mode: AppMode) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onClear: () => void;
  hasMessages: boolean;
  brutalMode?: boolean;
  onToggleBrutal?: () => void;
  conviction?: number;
}

export default function Header({
  mode, onModeSwitch, onToggleSidebar, sidebarOpen,
  onClear, hasMessages, brutalMode, onToggleBrutal, conviction,
}: HeaderProps) {
  const cfg = MODE_CONFIG[mode];

  return (
    <header
      className="flex items-center justify-between px-3 md:px-4 py-2.5 flex-shrink-0 relative z-10"
      style={{
        background: "rgba(6,6,10,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid rgba(${cfg.accentRgb},0.15)`,
      }}
    >
      {/* Left: logo + mode switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <motion.div
            key={mode}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
            style={{
              background: `rgba(${cfg.accentRgb},0.15)`,
              border: `1px solid rgba(${cfg.accentRgb},0.35)`,
              boxShadow: `0 0 12px rgba(${cfg.accentRgb},0.2)`,
            }}
          >
            {cfg.icon}
          </motion.div>
          <div className="hidden sm:block">
            <motion.div
              key={`label-${mode}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-display font-bold leading-none"
              style={{ color: cfg.accent }}
            >
              {cfg.label}
            </motion.div>
            <div className="text-xs leading-none mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              {mode === "cofounder" && (brutalMode ? "brutal mode" : "mentor mode")}
              {mode === "mystery" && "detective mode"}
              {mode === "debate" && `conviction: ${conviction ?? 50}%`}
            </div>
          </div>
        </div>

        <ModeSwitcher currentMode={mode} onSwitch={onModeSwitch} />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Brutal mode toggle for cofounder */}
        {mode === "cofounder" && onToggleBrutal && (
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onToggleBrutal}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all"
            style={{
              background: brutalMode ? "rgba(255,77,109,0.15)" : "rgba(255,255,255,0.05)",
              border: brutalMode ? "1px solid rgba(255,77,109,0.35)" : "1px solid rgba(255,255,255,0.08)",
              color: brutalMode ? "#FF4D6D" : "rgba(255,255,255,0.4)",
              boxShadow: brutalMode ? "0 0 12px rgba(255,77,109,0.2)" : "none",
            }}
          >
            🔥 <span className="hidden sm:inline">{brutalMode ? "Brutal ON" : "Brutal"}</span>
          </motion.button>
        )}

        {/* Sidebar toggle */}
        {(mode === "cofounder" || mode === "mystery" || mode === "debate") && (
          <button
            onClick={onToggleSidebar}
            className="text-xs px-2.5 py-1.5 rounded-lg transition-all"
            style={{
              background: sidebarOpen ? `rgba(${cfg.accentRgb},0.15)` : "rgba(255,255,255,0.05)",
              border: sidebarOpen ? `1px solid rgba(${cfg.accentRgb},0.35)` : "1px solid rgba(255,255,255,0.08)",
              color: sidebarOpen ? cfg.accent : "rgba(255,255,255,0.4)",
            }}
          >
            {mode === "cofounder" ? "🧠" : mode === "mystery" ? "📋" : "⚖️"}
            <span className="hidden sm:inline ml-1">
              {mode === "cofounder" ? "Insights" : mode === "mystery" ? "Case File" : "Score"}
            </span>
          </button>
        )}

        {hasMessages && (
          <button
            onClick={onClear}
            className="text-xs px-2.5 py-1.5 rounded-lg transition-all hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            New
          </button>
        )}
      </div>
    </header>
  );
}
