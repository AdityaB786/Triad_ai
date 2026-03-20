"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AppMode, StartupContext, MysteryState, DebateState } from "@/types";
import { MODE_CONFIG } from "@/lib/constants";

interface SidePanelProps {
  mode: AppMode;
  isOpen: boolean;
  onClose: () => void;
  startupContext: StartupContext;
  mysteryState: MysteryState;
  debateState: DebateState;
  brutalMode: boolean;
  onToggleBrutal: () => void;
}

export default function SidePanel(props: SidePanelProps) {
  const { isOpen, onClose, mode } = props;
  const cfg = MODE_CONFIG[mode];

  const panelContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid rgba(${cfg.accentRgb},0.15)` }}>
        <div className="flex items-center gap-2">
          <span>{mode === "cofounder" ? "🧠" : mode === "mystery" ? "📋" : "⚖️"}</span>
          <span className="text-xs font-mono tracking-wider uppercase font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
            {mode === "cofounder" ? "Startup Context" : mode === "mystery" ? "Case File" : "Debate Score"}
          </span>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded text-xs transition-all hover:bg-white/5" style={{ color: "rgba(255,255,255,0.3)" }}>✕</button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {mode === "cofounder" && <CofounderPanel {...props} />}
        {mode === "mystery" && <MysteryPanel {...props} />}
        {mode === "debate" && <DebatePanel {...props} />}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex flex-col flex-shrink-0 overflow-hidden"
            style={{ background: "rgba(8,8,14,0.97)", borderLeft: `1px solid rgba(${cfg.accentRgb},0.15)` }}
          >
            {panelContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl overflow-hidden"
              style={{ background: "rgba(8,8,14,0.99)", border: `1px solid rgba(${cfg.accentRgb},0.2)`, maxHeight: "75vh" }}
            >
              <div className="flex justify-center py-3 cursor-pointer" onClick={onClose}>
                <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "calc(75vh - 40px)" }}>
                {panelContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ── COFOUNDER PANEL ──────────────────────────────────────────────────────────
function CofounderPanel({ startupContext, brutalMode, onToggleBrutal }: SidePanelProps) {
  const rows = [
    { label: "Problem", value: startupContext.problem, icon: "🎯", color: "rgba(108,99,255,0.6)" },
    { label: "Audience", value: startupContext.audience, icon: "👥", color: "rgba(96,165,250,0.6)" },
    { label: "Revenue", value: startupContext.monetization, icon: "💰", color: "rgba(245,158,11,0.6)" },
    { label: "Stage", value: startupContext.stage, icon: "📍", color: "rgba(52,211,153,0.5)" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Brutal toggle */}
      <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold" style={{ color: "#F0F0FF" }}>Brutal Mode</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{brutalMode ? "Investor-level harsh" : "Mentor-like honesty"}</div>
          </div>
          <motion.button
            whileTap={{ scale: 0.93 }} onClick={onToggleBrutal}
            className="relative w-11 h-6 rounded-full flex-shrink-0"
            style={{
              background: brutalMode ? "linear-gradient(135deg,#FF4D6D,#FF8C00)" : "rgba(255,255,255,0.08)",
              border: brutalMode ? "1px solid rgba(255,77,109,0.4)" : "1px solid rgba(255,255,255,0.1)",
              boxShadow: brutalMode ? "0 0 14px rgba(255,77,109,0.3)" : "none",
            }}
          >
            <motion.div
              className="absolute top-0.5 w-5 h-5 rounded-full shadow-lg"
              animate={{ x: brutalMode ? 22 : 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{ background: brutalMode ? "white" : "rgba(108,99,255,0.6)" }}
            />
          </motion.button>
        </div>
        {brutalMode && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            className="mt-2 text-xs px-2 py-1.5 rounded-lg"
            style={{ background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.2)", color: "#FF6B80" }}
          >
            🔥 Investor mode. No mercy.
          </motion.div>
        )}
      </div>

      {rows.map((row) => (
        <div key={row.label} className="p-3 rounded-xl" style={{
          background: row.value ? "rgba(15,15,24,0.7)" : "rgba(15,15,24,0.3)",
          border: `1px solid ${row.value ? row.color : "rgba(255,255,255,0.05)"}`,
        }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm">{row.icon}</span>
            <span className="text-xs font-mono tracking-wider uppercase" style={{ color: row.color }}>{row.label}</span>
          </div>
          {row.value
            ? <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{row.value}</p>
            : <div className="flex flex-col gap-1.5">
                <div className="skeleton h-2.5 rounded-full" />
                <div className="skeleton h-2.5 rounded-full w-3/4" />
              </div>
          }
        </div>
      ))}

      {/* Risks */}
      <div className="p-3 rounded-xl" style={{
        background: startupContext.risks.length > 0 ? "rgba(15,15,24,0.7)" : "rgba(15,15,24,0.3)",
        border: `1px solid ${startupContext.risks.length > 0 ? "rgba(255,77,109,0.4)" : "rgba(255,255,255,0.05)"}`,
      }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm">⚠️</span>
          <span className="text-xs font-mono tracking-wider uppercase" style={{ color: "rgba(255,77,109,0.7)" }}>Risks</span>
        </div>
        {startupContext.risks.length > 0
          ? <ul className="flex flex-col gap-1">
              {startupContext.risks.map((r, i) => (
                <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <span style={{ color: "#FF4D6D" }} className="flex-shrink-0 mt-0.5">▸</span>{r}
                </li>
              ))}
            </ul>
          : <div className="skeleton h-2.5 rounded-full" />
        }
      </div>
    </div>
  );
}

// ── MYSTERY PANEL ─────────────────────────────────────────────────────────────
function MysteryPanel({ mysteryState }: SidePanelProps) {
  const { caseTitle, victim, suspects, cluesFound, solved } = mysteryState;

  return (
    <div className="flex flex-col gap-3">
      {solved && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-xl text-center"
          style={{ background: "rgba(232,184,109,0.1)", border: "1px solid rgba(232,184,109,0.4)" }}
        >
          <div className="text-xl mb-1">🏆</div>
          <div className="text-sm font-bold" style={{ color: "#E8B86D" }}>Case Solved!</div>
        </motion.div>
      )}

      <InfoBlock label="Case" value={caseTitle} icon="🗂️" color="rgba(232,184,109,0.6)" />
      <InfoBlock label="Victim" value={victim} icon="💀" color="rgba(255,77,77,0.6)" />

      {/* Suspects */}
      <div className="p-3 rounded-xl" style={{ background: "rgba(16,10,6,0.7)", border: "1px solid rgba(232,184,109,0.15)" }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">👤</span>
          <span className="text-xs font-mono tracking-wider uppercase" style={{ color: "rgba(232,184,109,0.6)" }}>Suspects</span>
        </div>
        {suspects.length > 0
          ? <ul className="flex flex-col gap-1">
              {suspects.map((s, i) => (
                <li key={i} className="text-xs flex items-center gap-2" style={{ color: "rgba(232,184,109,0.7)" }}>
                  <span style={{ color: "rgba(255,77,77,0.6)" }}>•</span>{s}
                </li>
              ))}
            </ul>
          : <div className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>No suspects identified yet</div>
        }
      </div>

      {/* Clues */}
      <div className="p-3 rounded-xl" style={{ background: "rgba(16,10,6,0.7)", border: "1px solid rgba(232,184,109,0.15)" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">🔍</span>
            <span className="text-xs font-mono tracking-wider uppercase" style={{ color: "rgba(232,184,109,0.6)" }}>Clues Found</span>
          </div>
          <span className="text-xs font-mono" style={{ color: "rgba(232,184,109,0.4)" }}>{cluesFound.length}/6</span>
        </div>
        {/* Progress bar */}
        <div className="h-1 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#E8B86D,#FF8C42)" }}
            animate={{ width: `${(cluesFound.length / 6) * 100}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        {cluesFound.length > 0
          ? <ul className="flex flex-col gap-1">
              {cluesFound.map((c, i) => (
                <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: "rgba(232,184,109,0.6)" }}>
                  <span style={{ color: "#E8B86D" }}>◆</span>{c}
                </li>
              ))}
            </ul>
          : <div className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Start investigating to find clues</div>
        }
      </div>
    </div>
  );
}

// ── DEBATE PANEL ──────────────────────────────────────────────────────────────
function DebatePanel({ debateState }: SidePanelProps) {
  const { topic, userPosition, conviction, roundsWon, totalRounds } = debateState;
  const convictionColor = conviction > 60 ? "#34D399" : conviction > 35 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col gap-3">
      {/* Conviction meter */}
      <div className="p-4 rounded-xl" style={{ background: "rgba(18,6,6,0.8)", border: "1px solid rgba(239,68,68,0.25)" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono tracking-wider uppercase" style={{ color: "rgba(239,68,68,0.6)" }}>Your Conviction</span>
          <motion.span
            key={conviction}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="text-2xl font-display font-black"
            style={{ color: convictionColor }}
          >
            {conviction}%
          </motion.span>
        </div>
        <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full conviction-bar-fill"
            style={{ background: `linear-gradient(90deg, ${convictionColor}, ${convictionColor}88)`, width: `${conviction}%` }}
            animate={{ width: `${conviction}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
          {conviction >= 70 ? "Holding strong 💪" : conviction >= 45 ? "Under pressure..." : conviction >= 20 ? "Barely hanging on 😬" : "Position crumbling 💀"}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl text-center" style={{ background: "rgba(18,6,6,0.6)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <div className="text-2xl font-display font-black" style={{ color: "#EF4444" }}>{roundsWon}</div>
          <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Rounds Won</div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: "rgba(18,6,6,0.6)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <div className="text-2xl font-display font-black" style={{ color: "rgba(255,255,255,0.5)" }}>{totalRounds}</div>
          <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Total Rounds</div>
        </div>
      </div>

      <InfoBlock label="Topic" value={topic} icon="💬" color="rgba(239,68,68,0.6)" />
      <InfoBlock label="Your Position" value={userPosition} icon="🛡️" color="rgba(249,115,22,0.6)" />

      <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "rgba(255,255,255,0.35)" }}>
        The Devil's Advocate never concedes. Make your arguments count.
      </div>
    </div>
  );
}

function InfoBlock({ label, value, icon, color }: { label: string; value: string | null; icon: string; color: string }) {
  return (
    <div className="p-3 rounded-xl" style={{
      background: value ? "rgba(15,15,20,0.7)" : "rgba(15,15,20,0.3)",
      border: `1px solid ${value ? color : "rgba(255,255,255,0.05)"}`,
    }}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-mono tracking-wider uppercase" style={{ color }}>{label}</span>
      </div>
      {value
        ? <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{value}</p>
        : <div className="skeleton h-2.5 rounded-full w-2/3" />
      }
    </div>
  );
}
