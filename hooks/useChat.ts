"use client";

import { useCallback, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { ACTION_BUTTONS_CONFIG } from "@/lib/constants";
import { Message, ActionButton, StartupContext, MysteryState, DebateState } from "@/types";
import { nanoid } from "@/lib/utils";

function parseBlock<T>(content: string, separator: string): { clean: string; data: T | null } {
  const idx = content.indexOf(separator);
  if (idx === -1) return { clean: content, data: null };
  const clean = content.substring(0, idx).trim();
  const jsonStr = content.substring(idx + separator.length).trim();
  try {
    return { clean, data: JSON.parse(jsonStr) };
  } catch {
    return { clean, data: null };
  }
}

function detectActionButtons(content: string, mode: string): ActionButton[] {
  if (mode !== "cofounder") return [];
  const lower = content.toLowerCase();
  const buttons: ActionButton[] = [];
  for (const config of ACTION_BUTTONS_CONFIG) {
    if (config.keyword.some((k) => lower.includes(k))) {
      buttons.push({ label: config.label, prompt: config.prompt, icon: config.icon });
      if (buttons.length >= 2) break;
    }
  }
  return buttons;
}

export function useChat() {
  const abortRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef(false);

  const sendMessage = useCallback(async (userContent: string) => {
    if (!userContent.trim()) return;
    const state = useAppStore.getState();
    if (state.isLoading || inFlightRef.current) return;

    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;
    inFlightRef.current = true;

    const userMessage: Message = {
      id: nanoid(), role: "user", content: userContent.trim(), timestamp: new Date(),
    };

    const historySnapshot = state.messages
      .filter((m) => m.content.trim() !== "")
      .map((m) => ({ role: m.role, content: m.content }));

    useAppStore.getState().addMessage(userMessage);
    useAppStore.getState().setLoading(true);
    useAppStore.getState().addMessage({
      id: nanoid(), role: "assistant", content: "", timestamp: new Date(), isStreaming: true,
    });

    try {
      const messagesToSend = [...historySnapshot, { role: "user", content: userMessage.content }];
      const { mode, brutalMode } = useAppStore.getState();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesToSend, mode, brutalMode }),
        signal: abort.signal,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errBody.error || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value, { stream: true }).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") {
            const currentMode = useAppStore.getState().mode;
            let clean = accumulated;

            if (currentMode === "cofounder") {
              const parsed = parseBlock<Partial<StartupContext>>(accumulated, "---CONTEXT---");
              clean = parsed.clean;
              if (parsed.data) useAppStore.getState().updateStartupContext(parsed.data);
            } else if (currentMode === "mystery") {
              const parsed = parseBlock<Partial<MysteryState>>(accumulated, "---MYSTERY---");
              clean = parsed.clean;
              if (parsed.data) useAppStore.getState().updateMysteryState(parsed.data);
            } else if (currentMode === "debate") {
              const parsed = parseBlock<Partial<DebateState>>(accumulated, "---DEBATE---");
              clean = parsed.clean;
              if (parsed.data) useAppStore.getState().updateDebateState(parsed.data);
            }

            const buttons = detectActionButtons(clean, currentMode);
            useAppStore.setState((s) => {
              const messages = [...s.messages];
              const last = messages[messages.length - 1];
              if (last?.role === "assistant") {
                messages[messages.length - 1] = { ...last, content: clean, isStreaming: false, actionButtons: buttons };
              }
              return { messages };
            });
            break;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.delta) {
              accumulated += parsed.delta;
              useAppStore.getState().updateLastMessage(accumulated, false);
            }
          } catch { /* skip */ }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") return;
      const msg = (err as Error).message || "";
      const errorMessage = msg.includes("429") || msg.toLowerCase().includes("rate")
        ? "Rate limit hit — wait a few seconds and retry."
        : msg.includes("401") || msg.includes("403")
        ? "Invalid API key. Check GEMINI_API_KEY in .env.local."
        : "Something went wrong. Hit retry.";
      useAppStore.getState().markLastMessageFailed(errorMessage);
    } finally {
      useAppStore.getState().setLoading(false);
      inFlightRef.current = false;
    }
  }, []);

  const retry = useCallback(async () => {
    const messages = useAppStore.getState().messages;
    let lastUserMsg = "";
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") { lastUserMsg = messages[i].content; break; }
    }
    if (!lastUserMsg) return;
    useAppStore.setState((s) => {
      const msgs = [...s.messages];
      if (msgs[msgs.length - 1]?.role === "assistant") msgs.pop();
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === "user") { msgs.splice(i, 1); break; }
      }
      return { messages: msgs };
    });
    await sendMessage(lastUserMsg);
  }, [sendMessage]);

  return { sendMessage, retry };
}
