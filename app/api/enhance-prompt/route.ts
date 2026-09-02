import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";

const ENHANCE_SYSTEM_PROMPT = `You are an expert prompt engineer. Your job is to take a short, rough, or poorly written user prompt for a presentation topic and rewrite it into a highly detailed, comprehensive, and professional prompt. 
Fix any typos, grammatical errors, and expand on the core idea to make it sound professional and structured.
Do not include any pleasantries or conversational filler. Return ONLY the enhanced prompt text itself.`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "A 'prompt' string is required." },
        { status: 400 }
      );
    }

    const enhancedPrompt = await generateContent(
      ENHANCE_SYSTEM_PROMPT,
      `Enhance this presentation prompt:\n\n${prompt}`
    );

    return NextResponse.json({ enhancedPrompt: enhancedPrompt.trim() }, { status: 200 });
  } catch (error: any) {
    console.error("[enhance-prompt] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to enhance prompt." },
      { status: 500 }
    );
  }
}
