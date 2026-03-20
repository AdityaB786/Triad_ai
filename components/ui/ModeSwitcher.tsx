"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AppMode } from "@/types";
import { MODE_CONFIG } from "@/lib/constants";

interface ModeSwitcherProps {
  currentMode: AppMode;
  onSwitch: (mode: AppMode) => void;
}

const MODES: AppMode[] = ["cofounder", "mystery", "debate"];

export default function ModeSwitcher({ currentMode, onSwitch }: ModeSwitcherProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl" style={{
      background: "rgba(0,0,0,0.4)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      {MODES.map((mode) => {
        const cfg = MODE_CONFIG[mode];
        const active = mode === currentMode;
        return (
          <motion.button
            key={mode}
            onClick={() => onSwitch(mode)}
            whileHover={{ scale: active ? 1 : 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
            style={{
              color: active ? "white" : "rgba(255,255,255,0.4)",
              zIndex: 1,
            }}
          >
            {active && (
              <motion.div
                layoutId="modeActive"
                className="absolute inset-0 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, rgba(${cfg.accentRgb},0.25), rgba(${cfg.accentRgb},0.12))`,
                  border: `1px solid rgba(${cfg.accentRgb},0.4)`,
                  boxShadow: `0 0 16px rgba(${cfg.accentRgb},0.2)`,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cfg.icon}</span>
            <span className="relative z-10 hidden sm:block">{cfg.label.split(" ")[0]}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// Full-screen mode selection overlay for first launch
export function ModeSelectionScreen({ onSelect }: { onSelect: (mode: AppMode) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      background: "radial-gradient(ellipse at 50% 40%, rgba(20,10,40,1) 0%, #06060A 70%)",
    }}>
      {/* Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-3xl"
      >
        {/* Title */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Choose your experience
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-display font-black tracking-tight mb-4"
            style={{ color: "#F0F0FF" }}
          >
            TRIAD
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Three AI experiences. One app.
          </motion.p>
        </div>

        {/* Mode cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODES.map((mode, i) => {
            const cfg = MODE_CONFIG[mode];
            return (
              <motion.button
                key={mode}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(mode)}
                className="group relative p-6 rounded-2xl text-left overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(${cfg.accentRgb},0.12) 0%, rgba(0,0,0,0.3) 100%)`,
                  border: `1px solid rgba(${cfg.accentRgb},0.25)`,
                  boxShadow: `0 0 40px rgba(${cfg.accentRgb},0.05)`,
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 50% 100%, rgba(${cfg.accentRgb},0.15) 0%, transparent 70%)` }}
                />

                {/* Icon */}
                <div
                  className="text-4xl mb-4 w-14 h-14 flex items-center justify-center rounded-xl"
                  style={{
                    background: `rgba(${cfg.accentRgb},0.12)`,
                    border: `1px solid rgba(${cfg.accentRgb},0.25)`,
                    boxShadow: `0 0 20px rgba(${cfg.accentRgb},0.15)`,
                  }}
                >
                  {cfg.icon}
                </div>

                <h3
                  className="text-lg font-display font-bold mb-2 relative z-10"
                  style={{ color: cfg.accent }}
                >
                  {cfg.label}
                </h3>
                <p className="text-sm relative z-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {cfg.tagline}
                </p>

                <div
                  className="mt-4 text-xs font-mono flex items-center gap-1 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: cfg.accent }}
                >
                  Enter → 
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

const modes = MODES; // re-export for use in other files
export { modes };
