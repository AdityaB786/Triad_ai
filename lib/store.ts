import { create } from "zustand";
import { AppMode, AppState, Message, StartupContext, MysteryState, DebateState } from "@/types";

const defaultStartupContext: StartupContext = {
  problem: null, audience: null, monetization: null,
  risks: [], stage: null, idea: null,
};

const defaultMysteryState: MysteryState = {
  caseTitle: null, victim: null, suspects: [],
  cluesFound: [], solved: false, accusation: null,
};

const defaultDebateState: DebateState = {
  topic: null, userPosition: null, conviction: 50,
  roundsWon: 0, totalRounds: 0,
};

interface AppStore extends AppState {
  setMode: (mode: AppMode) => void;
  addMessage: (msg: Message) => void;
  updateLastMessage: (content: string, done?: boolean) => void;
  setLoading: (v: boolean) => void;
  // CoFounder
  toggleBrutalMode: () => void;
  updateStartupContext: (ctx: Partial<StartupContext>) => void;
  toggleSidebar: () => void;
  // Mystery
  updateMysteryState: (s: Partial<MysteryState>) => void;
  // Debate
  updateDebateState: (s: Partial<DebateState>) => void;
  // Shared
  markLastMessageFailed: (errorMessage?: string) => void;
  removeLastMessage: () => void;
  clearChat: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  mode: "cofounder",
  messages: [],
  isLoading: false,
  brutalMode: false,
  startupContext: defaultStartupContext,
  sidebarOpen: false,
  mysteryState: defaultMysteryState,
  debateState: defaultDebateState,

  setMode: (mode) => set({ mode, messages: [], mysteryState: defaultMysteryState, debateState: defaultDebateState, startupContext: defaultStartupContext }),

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

  updateLastMessage: (content, done = false) =>
    set((s) => {
      const messages = [...s.messages];
      const last = messages[messages.length - 1];
      if (last?.role === "assistant") {
        messages[messages.length - 1] = { ...last, content, isStreaming: !done };
      }
      return { messages };
    }),

  setLoading: (isLoading) => set({ isLoading }),

  toggleBrutalMode: () => set((s) => ({ brutalMode: !s.brutalMode })),
  updateStartupContext: (ctx) => set((s) => ({ startupContext: { ...s.startupContext, ...ctx } })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  updateMysteryState: (ms) => set((s) => ({ mysteryState: { ...s.mysteryState, ...ms } })),
  updateDebateState: (ds) => set((s) => {
    const newConviction = Math.max(0, Math.min(100,
      s.debateState.conviction + (ds.convictionDelta ?? 0)
    ));
    return { debateState: { ...s.debateState, ...ds, conviction: newConviction } };
  }),

  markLastMessageFailed: (errorMessage) =>
    set((s) => {
      const messages = [...s.messages];
      const last = messages[messages.length - 1];
      if (last?.role === "assistant") {
        messages[messages.length - 1] = { ...last, failed: true, isStreaming: false, errorMessage };
      }
      return { messages };
    }),

  removeLastMessage: () =>
    set((s) => {
      const messages = [...s.messages];
      if (messages[messages.length - 1]?.role === "assistant") messages.pop();
      return { messages };
    }),

  clearChat: () => set((s) => ({
    messages: [],
    mysteryState: defaultMysteryState,
    debateState: { ...defaultDebateState },
    startupContext: defaultStartupContext,
    ...(s.mode === "mystery" ? {} : {}),
  })),
}));