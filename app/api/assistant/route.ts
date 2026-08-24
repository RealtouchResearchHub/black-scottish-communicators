import { NextRequest, NextResponse } from "next/server";
import { BSC_ASSISTANT_SYSTEM_PROMPT } from "@/lib/bsc-knowledge";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId } = (await req.json()) as {
      messages: ChatMessage[];
      sessionId: string;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "The BSC Assistant isn't fully configured yet (missing ANTHROPIC_API_KEY). Please contact BSC directly for now.",
        },
        { status: 503 }
      );
    }

    const trimmed = messages.slice(-12);

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 600,
        system: BSC_ASSISTANT_SYSTEM_PROMPT,
        messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error("Anthropic API error:", errText);
      return NextResponse.json(
        { error: "The BSC Assistant is temporarily unavailable. Please try again shortly." },
        { status: 502 }
      );
    }

    const data = await anthropicRes.json();
    const replyText = (data.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n")
      .trim();

    try {
      const supabase = await createClient();
      const { data: userData } = await supabase.auth.getUser();

      let { data: conv } = await supabase
        .from("assistant_conversations")
        .select("id")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (!conv) {
        const { data: newConv } = await supabase
          .from("assistant_conversations")
          .insert({ session_id: sessionId, member_id: userData?.user?.id ?? null })
          .select("id")
          .single();
        conv = newConv;
      }

      if (conv) {
        const lastUser = trimmed[trimmed.length - 1];
        await supabase.from("assistant_messages").insert([
          { conversation_id: conv.id, role: "user", content: lastUser.content },
          { conversation_id: conv.id, role: "assistant", content: replyText },
        ]);
      }
    } catch (logErr) {
      console.error("Assistant logging failed (non-fatal):", logErr);
    }

    return NextResponse.json({ reply: replyText });
  } catch (err) {
    console.error("Assistant route error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
