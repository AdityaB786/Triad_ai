"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { useChat } from "@/hooks/useChat";
import { MODE_CONFIG } from "@/lib/constants";
import { AppMode } from "@/types";

import EmptyState from "@/components/chat/EmptyState";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import SidePanel from "@/components/panels/SidePanel";
import Header from "@/components/ui/Header";
import { ModeSelectionScreen } from "@/components/ui/ModeSwitcher";

export default function Home() {
  const mode = useAppStore((s) => s.mode);
  const messages = useAppStore((s) => s.messages);
  const isLoading = useAppStore((s) => s.isLoading);
  const brutalMode = useAppStore((s) => s.brutalMode);
  const startupContext = useAppStore((s) => s.startupContext);
  const mysteryState = useAppStore((s) => s.mysteryState);
  const debateState = useAppStore((s) => s.debateState);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setMode = useAppStore((s) => s.setMode);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const toggleBrutalMode = useAppStore((s) => s.toggleBrutalMode);
  const clearChat = useAppStore((s) => s.clearChat);

  const { sendMessage, retry } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showModeSelect, setShowModeSelect] = useState(true);
  const cfg = MODE_CONFIG[mode];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleModeSelect = (m: AppMode) => {
    setMode(m);
    setShowModeSelect(false);
  };

  const handleModeSwitch = (m: AppMode) => {
    setMode(m);
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden mode-${mode}`}
      style={{ background: `linear-gradient(160deg, var(--bg-start, #0A0A0F) 0%, var(--bg-end, #0F0A1A) 100%)` }}
    >
      {/* Mode selection overlay */}
      <AnimatePresence>
        {showModeSelect && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50"
          >
            <ModeSelectionScreen onSelect={handleModeSelect} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(${cfg.accentRgb},0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(${cfg.accentRgb},0.025) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${cfg.accent} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-8"
          style={{ background: `radial-gradient(circle, ${cfg.hotAccent} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Header */}
      <Header
        mode={mode}
        onModeSwitch={handleModeSwitch}
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
        onClear={clearChat}
        hasMessages={messages.length > 0}
        brutalMode={brutalMode}
        onToggleBrutal={toggleBrutalMode}
        conviction={debateState.conviction}
      />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Messages or empty state */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <motion.div
                  key={`empty-${mode}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <EmptyState mode={mode} onPromptSelect={sendMessage} />
                </motion.div>
              ) : (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5"
                >
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        mode={mode}
                        onActionClick={sendMessage}
                        onRetry={retry}
                      />
                    ))}
                  </AnimatePresence>
                  <div ref={bottomRef} className="h-2" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div
            className="flex-shrink-0 px-4 pb-5 pt-3"
            style={{ background: `linear-gradient(to top, rgba(6,6,10,0.99) 60%, transparent)` }}
          >
            <div className="max-w-2xl mx-auto">
              <ChatInput
                onSend={sendMessage}
                isLoading={isLoading}
                hasMessages={messages.length > 0}
                mode={mode}
              />
            </div>
          </div>
        </main>

        {/* Side panel */}
        <SidePanel
          mode={mode}
          isOpen={sidebarOpen}
          onClose={toggleSidebar}
          startupContext={startupContext}
          mysteryState={mysteryState}
          debateState={debateState}
          brutalMode={brutalMode}
          onToggleBrutal={toggleBrutalMode}
        />
      </div>
    </div>
  );
}
