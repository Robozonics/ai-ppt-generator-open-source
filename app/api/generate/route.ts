import { NextResponse } from "next/server";
import { groq, GROQ_MODEL, withRetry } from "@/lib/groq";
import { resolveImageUrl } from "@/lib/imageResolver";
import { PresentationDeckSchema } from "@/lib/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Stage 1 System Prompt — Outline Generation
// ─────────────────────────────────────────────────────────────────────────────
const OUTLINE_SYSTEM_PROMPT = `Generate JSON outline for presentation. Format: {"outline":[{"slideNumber":1,"layout":"title_hero","proposedTitle":"...","contentNote":"..."}]}. Layouts: title_hero, two_column_split, three_column_grid, timeline_flow, metric_showcase, comparison_matrix, image_gallery, quote_focus, big_number. 1st slide MUST be title_hero. Vary layouts. Return ONLY valid JSON, no markdown.`;

// ─────────────────────────────────────────────────────────────────────────────
// Stage 2 System Prompt — Full Content Generation (JSON Mode)
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_SYSTEM_PROMPT = `Expand outline into JSON deck matching this structure precisely:
{"title":"","theme":"","cards":[{"id":"","order":1,"layout":"","title":"","subtitle":"","elements":[{"id":"","type":"","content":"","items":[],"metricValue":"","metricLabel":"","iconName":"","imageQuery":""}],"imagePrompt":""}]}
Rules:
- Types: heading, paragraph, bullet_list, stat_metric, callout, image_block.
- Valid icons: brain, zap, shield, users, target.
- imagePrompt: detailed visual description.
- Return ONLY valid JSON, no markdown.`;

// ─────────────────────────────────────────────────────────────────────────────
// POST Handler
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const topic: string = body.topic || body.prompt; // accept both field names
    const slideCount: number = body.slideCount ?? 6;
    const theme: string = body.theme ?? "nebula_dark";
    const verbosity: string = body.verbosity ?? "medium";

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json(
        { error: "A 'topic' string is required." },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    // ── Stage 1: Generate Outline ──────────────────────────────────────────
    const outlineCompletion = await withRetry(() =>
      groq.chat.completions.create({
        messages: [
          { role: "system", content: OUTLINE_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Topic: "${topic}"\nGenerate exactly ${slideCount} slides. The first must be title_hero.`,
          },
        ],
        model: GROQ_MODEL,
        response_format: { type: "json_object" },
        temperature: 0.7,
      })
    );

    const outlineRaw = outlineCompletion.choices[0]?.message?.content;
    if (!outlineRaw) {
      throw new Error("Stage 1 failed: Groq returned an empty outline.");
    }

    let outline: any;
    try {
      outline = JSON.parse(outlineRaw);
    } catch {
      throw new Error(
        "Stage 1 failed: Groq returned malformed JSON for the outline."
      );
    }

    // ── Stage 2: Generate Full Content ─────────────────────────────────────
    const contentCompletion = await withRetry(() =>
      groq.chat.completions.create({
        messages: [
          { role: "system", content: CONTENT_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              `Expand this outline into a full presentation deck.`,
              `Topic: "${topic}"`,
              `Theme: "${theme}"`,
              `Verbosity Preference: "${verbosity}" (Adjust the amount of text generated accordingly. Short = brief bullet points, Detailed = richer paragraphs/more items).`,
              `Outline:\n${JSON.stringify(outline, null, 2)}`,
            ].join("\n"),
          },
        ],
        model: GROQ_MODEL,
        response_format: { type: "json_object" },
        temperature: 0.65,
      })
    );

    const contentRaw = contentCompletion.choices[0]?.message?.content;
    if (!contentRaw) {
      throw new Error("Stage 2 failed: Groq returned empty content.");
    }

    let deck: any;
    try {
      deck = JSON.parse(contentRaw);
    } catch {
      throw new Error(
        "Stage 2 failed: Groq returned malformed JSON for the deck."
      );
    }

    // ── Stage 3: Hydrate images via Pollinations ───────────────────────────
    if (deck.cards && Array.isArray(deck.cards)) {
      deck.cards = deck.cards.map((card: any) => {
        // Resolve card-level image prompt
        if (card.imagePrompt && typeof card.imagePrompt === "string") {
          card.imageUrl = resolveImageUrl(card.imagePrompt);
        }

        // Resolve element-level image queries
        if (card.elements && Array.isArray(card.elements)) {
          card.elements = card.elements.map((el: any) => {
            if (
              el.type === "image_block" &&
              el.imageQuery &&
              typeof el.imageQuery === "string"
            ) {
              el.imageUrl = resolveImageUrl(el.imageQuery);
            }
            return el;
          });
        }

        return card;
      });
    }

    // ── Optional: Validate against Zod (soft — log but don't block) ──────
    const validation = PresentationDeckSchema.safeParse(deck);
    if (!validation.success) {
      console.warn(
        "[generate] Zod validation warnings:",
        validation.error.flatten().fieldErrors
      );
      // We still return the deck — the LLM output is usable even if
      // it has minor schema deviations (e.g. extra fields).
    }

    return NextResponse.json(deck, { status: 200 });
  } catch (error: any) {
    console.error("[generate] Pipeline error:", error);

    const statusCode =
      error?.status === 429
        ? 429
        : error?.status === 503
          ? 503
          : 500;

    return NextResponse.json(
      {
        error: error.message || "Failed to generate presentation.",
        stage: error.message?.includes("Stage 1")
          ? "outline"
          : error.message?.includes("Stage 2")
            ? "content"
            : "unknown",
      },
      { status: statusCode }
    );
  }
}
