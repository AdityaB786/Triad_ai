"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message, AppMode } from "@/types";
import { MODE_CONFIG } from "@/lib/constants";
import { formatTime } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  mode: AppMode;
  onActionClick: (prompt: string) => void;
  onRetry: () => void;
}

function TypingIndicator({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: color }}
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-2 py-1">
      {[100, 80, 60].map((w, i) => (
        <div key={i} className="skeleton h-3.5 rounded-full" style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

export default function MessageBubble({ message, mode, onActionClick, onRetry }: MessageBubbleProps) {
  const cfg = MODE_CONFIG[mode];
  const isUser = message.role === "user";
  const isEmpty = !message.content && message.isStreaming;

  const aiAvatarLabel = mode === "cofounder" ? "⚡" : mode === "mystery" ? "🕵️" : "💀";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-3 group ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isUser ? (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: `rgba(${cfg.accentRgb},0.12)`,
              border: `1px solid rgba(${cfg.accentRgb},0.25)`,
              color: cfg.accent,
            }}
          >
            U
          </div>
        ) : (
          <motion.div
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
            style={{
              background: `rgba(${cfg.accentRgb},0.15)`,
              border: `1px solid rgba(${cfg.accentRgb},0.4)`,
              boxShadow: `0 0 12px rgba(${cfg.accentRgb},0.2)`,
            }}
            animate={message.isStreaming ? { boxShadow: [`0 0 8px rgba(${cfg.accentRgb},0.2)`, `0 0 20px rgba(${cfg.accentRgb},0.5)`, `0 0 8px rgba(${cfg.accentRgb},0.2)`] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {aiAvatarLabel}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-1.5 max-w-[85%] md:max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${isUser ? "rounded-tr-sm" : "rounded-tl-sm"}`}
          style={isUser
            ? {
                background: `rgba(${cfg.accentRgb},0.1)`,
                border: `1px solid rgba(${cfg.accentRgb},0.2)`,
                color: "#F0F0FF",
              }
            : {
                background: mode === "mystery"
                  ? "rgba(16,10,6,0.9)"
                  : mode === "debate"
                  ? "rgba(18,6,6,0.9)"
                  : "rgba(13,13,22,0.9)",
                border: `1px solid rgba(${cfg.accentRgb},0.12)`,
                backdropFilter: "blur(12px)",
                color: mode === "mystery" ? "#E8DCC8" : mode === "debate" ? "#FFE8E8" : "#E8E8FF",
              }
          }
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : isEmpty ? (
            <TypingIndicator color={cfg.accent} />
          ) : !message.content && !message.isStreaming ? (
            <SkeletonLoader />
          ) : (
            <div className={`prose-chat text-sm ${message.isStreaming ? "typing-cursor" : ""}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Error state */}
          {message.failed && (
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-xs" style={{ color: "#FF4D6D" }}>
                {message.errorMessage || "Failed to send."}
              </span>
              <button
                onClick={onRetry}
                className="text-xs px-2 py-0.5 rounded transition-all hover:opacity-80"
                style={{
                  background: "rgba(255,77,109,0.15)",
                  border: "1px solid rgba(255,77,109,0.3)",
                  color: "#FF4D6D",
                }}
              >
                Retry →
              </button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "rgba(255,255,255,0.2)" }}>
          {formatTime(new Date(message.timestamp))}
        </div>

        {/* Action buttons */}
        {!isUser && !message.isStreaming && !message.failed && message.actionButtons && message.actionButtons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mt-0.5"
          >
            {message.actionButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={() => onActionClick(btn.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: `rgba(${cfg.accentRgb},0.1)`,
                  border: `1px solid rgba(${cfg.accentRgb},0.25)`,
                  color: cfg.accent,
                }}
              >
                <span>{btn.icon}</span>
                <span>{btn.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
