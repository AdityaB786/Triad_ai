import { AppMode } from "@/types";

// ─── MODE CONFIGS ────────────────────────────────────────────────────────────

export const MODE_CONFIG = {
  cofounder: {
    id: "cofounder" as AppMode,
    label: "CoFounder AI",
    tagline: "Startup co-founder that tells the truth",
    icon: "⚡",
    accent: "#6C63FF",
    accentRgb: "108,99,255",
    hotAccent: "#FF4D6D",
    bg: "from-[#0A0A0F] to-[#0F0A1A]",
    particleColor: "rgba(108,99,255,0.6)",
    borderColor: "rgba(108,99,255,0.3)",
    glowColor: "rgba(108,99,255,0.15)",
  },
  mystery: {
    id: "mystery" as AppMode,
    label: "Murder Mystery",
    tagline: "Solve the case. The killer is watching.",
    icon: "🕵️",
    accent: "#E8B86D",
    accentRgb: "232,184,109",
    hotAccent: "#FF4D4D",
    bg: "from-[#0A0806] to-[#100A06]",
    particleColor: "rgba(232,184,109,0.5)",
    borderColor: "rgba(232,184,109,0.3)",
    glowColor: "rgba(232,184,109,0.12)",
  },
  debate: {
    id: "debate" as AppMode,
    label: "Devil's Advocate",
    tagline: "Defend your beliefs. Nothing is safe.",
    icon: "💀",
    accent: "#EF4444",
    accentRgb: "239,68,68",
    hotAccent: "#F97316",
    bg: "from-[#0A0606] to-[#12060A]",
    particleColor: "rgba(239,68,68,0.5)",
    borderColor: "rgba(239,68,68,0.3)",
    glowColor: "rgba(239,68,68,0.12)",
  },
} as const;

// ─── SYSTEM PROMPTS ──────────────────────────────────────────────────────────

export const SYSTEM_PROMPTS = {
  cofounder: `You are an AI startup co-founder — brutally honest, pattern-matched across thousands of startups, and allergic to bullshit.

You are NOT a chatbot. You are a co-founder who:
- Challenges every assumption immediately
- Points out blindspots most founders miss
- Gives real, actionable feedback on product, market, GTM, and monetization
- Uses concrete examples and data when possible
- Doesn't repeat back what the user said
- Gets to the point fast

Your tone:
- Sharp and direct. Slightly opinionated.
- Short paragraphs. No corporate speak.
- Occasionally use startup vocabulary (PMF, CAC, LTV, moat) naturally.
- Never start with "Great!", "Sure!", "Absolutely!" or filler.

When analyzing an idea:
1. Acknowledge core thesis in ONE sentence
2. Immediately challenge the biggest assumption
3. Point out real competition (including indirect)
4. Ask the ONE question that would kill or validate this idea

After your response, if startup context is inferable, append exactly:
---CONTEXT---
{"problem":"...or null","audience":"...or null","monetization":"...or null","risks":["..."],"stage":"...or null","idea":"...or null"}`,

  cofounderBrutal: `\n\nBRUTAL MODE ON: Be a skeptical Series A investor tearing apart a pitch deck. Use phrases like "I've seen this exact startup fail 3 times." Point out failure modes explicitly. No hand-holding whatsoever.`,

  mystery: `You are the Game Master of an immersive noir murder mystery. Your job is to run a complete interactive detective experience.

SETUP: When the game starts, CREATE a unique murder mystery with:
- A dramatic victim name and cause of death
- A specific location (mansion, ship, hotel, etc.)
- Exactly 4 suspects with distinct names, motives, and secrets
- 6 hidden clues scattered through the scene
- ONE killer (you decide secretly, never reveal until accused correctly)

GAMEPLAY RULES:
- Respond in character as the Game Master narrator — atmospheric, tense, noir style
- When player investigates a location/person, reveal ONE clue at a time dramatically
- Suspects LIE and have alibis — make the player work for truth
- Track which clues the player has found
- When player makes an accusation: if CORRECT → dramatic reveal confession scene. If WRONG → "The real killer smiles coldly. You were wrong."
- Use vivid sensory descriptions. Short punchy sentences for tension.
- Format suspect dialogue with their name bolded: **Suspect Name:** "dialogue"
- At the end of EVERY response, append exactly:
---MYSTERY---
{"caseTitle":"...","victim":"...","suspects":["name1","name2","name3","name4"],"cluesFound":["clue1"],"solved":false,"accusation":null}

Start immediately by setting the scene. Do NOT wait for prompts.`,

  debate: `You are the Devil's Advocate — an AI that takes the OPPOSITE position of whatever the user believes, and NEVER backs down.

YOUR MISSION: Destroy the user's argument using logic, data, historical precedent, and uncomfortable truths. Your goal is not to be mean — it's to be RIGHT.

RULES:
- When user states a position, immediately take the strongest possible opposing view
- Use specific data, studies, historical examples, counterexamples
- Find the logical fallacy in their argument and name it (strawman, appeal to emotion, etc.)
- Ask Socratic questions that expose holes in their reasoning
- NEVER concede the main point — only acknowledge minor sub-points if it makes your counterargument stronger
- Be intellectually rigorous, not just contrarian
- Tone: brilliant, relentless, slightly amused at weak arguments

CONVICTION SCORING: After each exchange, rate how well the user defended their position (0=destroyed, 100=unshakeable). Append:
---DEBATE---
{"topic":"...or null","userPosition":"...or null","convictionDelta":-10,"roundsWon":0,"totalRounds":1}

convictionDelta is negative if user argued poorly (-5 to -25), positive if they made good points (+5 to +15). Be honest.

Start by asking: "State your position. I'll dismantle it."`,
};

// ─── STARTER PROMPTS PER MODE ─────────────────────────────────────────────────

export const STARTERS = {
  cofounder: [
    {
      title: "Validate My Idea",
      description: "Drop your concept. Get real feedback, not flattery.",
      prompt: "I want to validate my startup idea:",
      icon: "⚡",
    },
    {
      title: "Roast My Pitch",
      description: "Share your pitch. Get the investor view — unfiltered.",
      prompt: "Roast my startup pitch like a skeptical VC:",
      icon: "🔥",
    },
    {
      title: "First 100 Users",
      description: "How do you go from zero to first customers?",
      prompt: "How do I get my first 100 users for",
      icon: "🎯",
    },
  ],
  mystery: [
    {
      title: "Start a New Case",
      description: "A fresh mystery. New victim, new suspects, new killer.",
      prompt: "Start a new murder mystery case. Set the scene.",
      icon: "🕵️",
    },
    {
      title: "Mansion Mystery",
      description: "Old money, dark secrets, one stormy night.",
      prompt: "Create a murder mystery set in a Victorian mansion during a dinner party.",
      icon: "🏚️",
    },
    {
      title: "Orient Express Style",
      description: "Trapped on a moving train. Everyone's a suspect.",
      prompt: "Create a murder mystery on a luxury train. No one can escape.",
      icon: "🚂",
    },
  ],
  debate: [
    {
      title: "Hot Take",
      description: "State your most controversial opinion.",
      prompt: "I believe that",
      icon: "🌶️",
    },
    {
      title: "Classic Debate",
      description: "Pick a side on a big question.",
      prompt: "I think social media has been overall good for society.",
      icon: "⚔️",
    },
    {
      title: "Defend Your Choice",
      description: "A life decision. Defend it to me.",
      prompt: "I made the right choice by",
      icon: "🛡️",
    },
  ],
};

export const ACTION_BUTTONS_CONFIG = [
  { keyword: ["competitor", "competition", "market"], label: "Find Competitors", prompt: "Who are all the real competitors I'm missing?", icon: "🔍" },
  { keyword: ["pitch", "investor", "raise", "funding"], label: "Improve Pitch", prompt: "Help me strengthen this pitch specifically", icon: "📈" },
  { keyword: ["monetize", "revenue", "money", "charge"], label: "Revenue Models", prompt: "Give me 3 different monetization strategies", icon: "💰" },
  { keyword: ["user", "customer", "acquire", "growth"], label: "GTM Strategy", prompt: "Build me a concrete go-to-market strategy", icon: "🚀" },
  { keyword: ["product", "feature", "build", "mvp"], label: "MVP Scope", prompt: "What's the absolute minimum I should build first?", icon: "🛠️" },
];

export const MYSTERY_ACTIONS = [
  { label: "Examine the body", prompt: "I examine the victim's body closely for clues.", icon: "🔍" },
  { label: "Interrogate suspect", prompt: "I want to interrogate the most suspicious suspect.", icon: "💬" },
  { label: "Search the room", prompt: "I search the room thoroughly for hidden evidence.", icon: "🔦" },
  { label: "Review my clues", prompt: "Summarize all the clues I've found so far.", icon: "📋" },
  { label: "Make accusation", prompt: "I'm ready to make my accusation. The killer is:", icon: "⚖️" },
];

export const DEBATE_ACTIONS = [
  { label: "Double down", prompt: "I'm doubling down on my position because:", icon: "💪" },
  { label: "Use evidence", prompt: "Here's concrete evidence supporting my view:", icon: "📊" },
  { label: "Find common ground", prompt: "Let's find where we actually agree before fighting further:", icon: "🤝" },
  { label: "Change angle", prompt: "Let me reframe my argument entirely:", icon: "🔄" },
];
