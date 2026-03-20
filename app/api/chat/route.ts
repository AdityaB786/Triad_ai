import { NextRequest } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPTS } from "@/lib/constants";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not set in .env.local" }), {
        status: 500, headers: { "Content-Type": "application/json" },
      });
    }

    const { messages, mode, brutalMode } = await req.json();

    let systemPrompt = "";
    if (mode === "cofounder") {
      systemPrompt = SYSTEM_PROMPTS.cofounder + (brutalMode ? SYSTEM_PROMPTS.cofounderBrutal : "");
    } else if (mode === "mystery") {
      systemPrompt = SYSTEM_PROMPTS.mystery;
    } else if (mode === "debate") {
      systemPrompt = SYSTEM_PROMPTS.debate;
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";

    const stream = await openai.chat.completions.create({
      model,
      stream: true,
      max_tokens: 1400,
      temperature: mode === "mystery" ? 0.95 : mode === "debate" ? 0.85 : brutalMode ? 0.9 : 0.75,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role, content: m.content,
        })),
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || "";
            if (delta) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const status = (error as { status?: number }).status;
    if (status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit hit. Wait a moment and retry." }), {
        status: 429, headers: { "Content-Type": "application/json" },
      });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}
