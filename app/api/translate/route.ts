import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are helping a public defender in Singapore translate legal advice for a client.

Translate the English text into Mandarin Chinese, using conversational, everyday legal language appropriate for explaining a legal matter to a layperson in the Singapore context. Do not use overly formal, literary, or academic Mandarin. Prioritize clarity over terminological nuance.

Preserve all factual and legal content exactly - do not add, omit, or soften any information.

Output only the Mandarin translation. Do not include pinyin, English, or any explanation.`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is not configured with an ANTHROPIC_API_KEY" },
      { status: 500 }
    );
  }

  let text: unknown;
  try {
    const body = await request.json();
    text = body.text;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Missing text to translate" }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey });

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: text }],
    });

    const translation = message.content
      .filter((block) => block.type === "text")
      .map((block) => ("text" in block ? block.text : ""))
      .join("")
      .trim();

    return NextResponse.json({ translation });
  } catch (err) {
    console.error("Translation request failed", err);
    return NextResponse.json({ error: "Translation request failed" }, { status: 502 });
  }
}
