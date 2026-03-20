export type AppMode = "cofounder" | "mystery" | "debate";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  failed?: boolean;
  errorMessage?: string;
  actionButtons?: ActionButton[];
  // Mystery-specific
  clue?: boolean;
  suspect?: string;
  // Debate-specific
  convictionDelta?: number;
}

export interface ActionButton {
  label: string;
  prompt: string;
  icon: string;
}

export interface StartupContext {
  problem: string | null;
  audience: string | null;
  monetization: string | null;
  risks: string[];
  stage: string | null;
  idea: string | null;
}

export interface MysteryState {
  caseTitle: string | null;
  victim: string | null;
  suspects: string[];
  cluesFound: string[];
  solved: boolean;
  accusation: string | null;
}

export interface DebateState {
  topic: string | null;
  userPosition: string | null;
  conviction: number; // 0-100, starts at 50
  roundsWon: number;
  totalRounds: number;
}

export interface AppState {
  mode: AppMode;
  messages: Message[];
  isLoading: boolean;
  // CoFounder
  brutalMode: boolean;
  startupContext: StartupContext;
  sidebarOpen: boolean;
  // Mystery
  mysteryState: MysteryState;
  // Debate
  debateState: DebateState;
}
