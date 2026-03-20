"use client";

import { motion } from "framer-motion";
import { AppMode } from "@/types";
import { MODE_CONFIG, STARTERS } from "@/lib/constants";

interface EmptyStateProps {
  mode: AppMode;
  onPromptSelect: (prompt: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function EmptyState({ mode, onPromptSelect }: EmptyStateProps) {
  const cfg = MODE_CONFIG[mode];
  const starters = STARTERS[mode];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 overflow-y-auto">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(${cfg.accentRgb},0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(${cfg.accentRgb},0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15" style={{
          background: `radial-gradient(circle, rgba(${cfg.accentRgb},0.4) 0%, transparent 70%)`,
        }} />
      </div>

      <motion.div
        variants={container} initial="hidden" animate="show"
        className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-8"
      >
        {/* Hero icon + title */}
        <motion.div variants={item} className="flex flex-col items-center gap-4 text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl relative"
            style={{
              background: `linear-gradient(135deg, rgba(${cfg.accentRgb},0.2), rgba(${cfg.accentRgb},0.05))`,
              border: `1px solid rgba(${cfg.accentRgb},0.4)`,
              boxShadow: `0 0 40px rgba(${cfg.accentRgb},0.2), inset 0 1px 0 rgba(255,255,255,0.08)`,
            }}
          >
            {cfg.icon}
          </motion.div>

          <div>
            <div className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: cfg.accent }}>
              {cfg.label}
            </div>

            {mode === "cofounder" && (
              <>
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 leading-tight" style={{ color: "#F0F0FF" }}>
                  Your co-founder that <span className="gradient-text">tells the truth</span>
                </h1>
                <p className="text-base max-w-md" style={{ color: "rgba(255,255,255,0.4)" }}>
                  No validation theater. No empty encouragement. Brutally honest startup feedback.
                </p>
              </>
            )}

            {mode === "mystery" && (
              <>
                <h1 className="text-4xl md:text-5xl font-mystery font-bold mb-3 leading-tight" style={{ color: "#E8B86D" }}>
                  The killer is in this room.
                </h1>
                <p className="text-base max-w-md" style={{ color: "rgba(232,184,109,0.6)" }}>
                  Interrogate suspects. Collect clues. Accuse the murderer before they vanish.
                </p>
              </>
            )}

            {mode === "debate" && (
              <>
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 leading-tight" style={{ color: "#F0F0FF" }}>
                  State your belief. <span style={{ color: "#EF4444" }}>I'll destroy it.</span>
                </h1>
                <p className="text-base max-w-md" style={{ color: "rgba(255,255,255,0.4)" }}>
                  The Devil's Advocate never concedes. Defend your position — or watch it crumble.
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* Starter cards */}
        <motion.div variants={item} className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
          {starters.map((starter, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPromptSelect(starter.prompt)}
              className="group relative p-4 rounded-xl text-left transition-all duration-200"
              style={{
                background: `rgba(${cfg.accentRgb},0.06)`,
                border: `1px solid rgba(${cfg.accentRgb},0.2)`,
              }}
            >
              <div className="text-2xl mb-2">{starter.icon}</div>
              <div className="font-display font-semibold text-sm mb-1" style={{ color: "#F0F0FF" }}>
                {starter.title}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                {starter.description}
              </div>
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs" style={{ color: cfg.accent }}>
                →
              </div>
            </motion.button>
          ))}
        </motion.div>

        {mode === "mystery" && (
          <motion.div variants={item} className="text-xs text-center font-mono" style={{ color: "rgba(232,184,109,0.4)" }}>
            ⚠ The AI knows who did it. You don't.
          </motion.div>
        )}
        {mode === "debate" && (
          <motion.div variants={item} className="text-xs text-center" style={{ color: "rgba(239,68,68,0.5)" }}>
            Your conviction starts at 50%. It only goes down from here.
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
