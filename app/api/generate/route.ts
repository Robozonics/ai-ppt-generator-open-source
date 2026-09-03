import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { resolveImageUrl, resolveWebImage } from "@/lib/imageResolver";
import { PresentationDeckSchema } from "@/lib/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Stage 1 System Prompt — Professional Outline Generation
// ─────────────────────────────────────────────────────────────────────────────
const OUTLINE_SYSTEM_PROMPT = `You are an elite Executive Presentation Designer, Content Strategist, and Creative Director. Your objective is to generate world-class, highly structured PowerPoint presentation outlines based on the user's topic and goals.

YOUR PRIMARY JOB: Generate a structured JSON outline that will be transformed into a polished, presentation-ready PowerPoint deck. Every decision you make must be optimized for a real slide deck that an executive would confidently present to a live audience.

BEFORE GENERATING, THINK STEP-BY-STEP:
1. THE STORYTELLING ARC: Every presentation must have a clear beginning (hook and context), middle (core arguments/data), and end (conclusion and call to action).
2. ACTION TITLES: Do not use generic titles like "Financial Overview." Use action titles that state the slide's main takeaway (e.g., "Q3 Revenue Grew 15% Driven by Enterprise Sales").
3. WHICH layouts will create the best visual rhythm and information density for each point?

OUTPUT FORMAT (return ONLY this JSON, nothing else):
{"outline":[{"slideNumber":1,"layout":"title_hero","proposedTitle":"...","contentNote":"..."}]}

AVAILABLE LAYOUTS:
- title_hero: Grand opening slide. Bold, cinematic title.
- two_column_split: Left text, right image.
- three_column_grid: Three equal cards with icons.
- timeline_flow: Horizontal timeline.
- metric_showcase: 3 large stat cards.
- comparison_matrix: Table grid.
- image_gallery: Visual mosaic of images.
- quote_focus: A single powerful quote.
- big_number: One massive statistic on the right + explanatory text.

SLIDE DECK DESIGN PRINCIPLES:
1. Slide 1 MUST be "title_hero". The title for Slide 1 MUST be the neat, simple, core topic name in ALL CAPS (e.g., "TESLA Q4 EARNINGS", "ARTIFICIAL INTELLIGENCE"). Do not use conversational hooks for the first slide.
2. NEVER use the same layout for two consecutive slides. Visual variety sustains attention.
3. Follow a powerful narrative arc: Hook → Context/Problem → Core Insights → Evidence/Data → Conclusion/CTA.
4. Every contentNote must describe SPECIFIC, CONCRETE content.
5. For all slides EXCEPT slide 1, slide titles must be ACTION TITLES (3-8 words). BANNED: "Introduction", "Overview", "Summary".
6. Include at least one metric_showcase or big_number slide for quantitative impact.

Return ONLY valid JSON. No markdown, no explanation, no commentary.`;

// ─────────────────────────────────────────────────────────────────────────────
// Stage 2 System Prompt — Professional Full Content Generation
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_SYSTEM_PROMPT = `You are an elite Executive Presentation Designer, Content Strategist, and Creative Director. Your objective is to generate world-class, highly structured, visually stunning, and colorful PowerPoint presentations. You do not just write text; you design premium visual experiences.

YOUR MISSION: Transform the provided outline into a complete, presentation-ready JSON deck.

BEFORE WRITING EACH SLIDE, THINK ABOUT:
1. THE STORYTELLING ARC: Does this slide build logically on the previous one?
2. THE "LESS IS MORE" RULE (SLIDE DIET): Never write walls of text. Slides are visual aids, not teleprompters.
   - Max 1 core idea per slide.
   - Max 3-5 bullet points per slide.
   - Max 6-8 words per bullet point.
3. ACTION TITLES: Do not use generic titles. State the slide's main takeaway.

OUTPUT FORMAT — return ONLY this JSON structure (ensure the "cards" array contains ONE object for EVERY slide in the provided outline):
{"title":"","description":"","theme":"","colorPalette":{"primary":"#hex","secondary":"#hex","accent":"#hex","background":"#hex","surface":"#hex","text":"#hex","textMuted":"#hex","accents":["#hex","#hex","#hex","#hex"]},"cards":[{"id":"","order":1,"layout":"","badgeText":"","title":"","subtitle":"","elements":[{"id":"","type":"","content":"","items":[],"metricValue":"","metricLabel":"","iconName":"","imageQuery":"","imageCaption":"","title":""}],"imagePrompt":""}]}

═══════════════════════════════════════════════════════════════════════════════
LAYOUT-SPECIFIC ELEMENT RULES (CRITICAL — follow these EXACTLY):
═══════════════════════════════════════════════════════════════════════════════

▸ title_hero: Uses ONLY card-level fields (title, subtitle, badgeText). No elements array items. The title MUST be the neat, simple core topic name in ALL CAPS.
▸ two_column_split: Provide 3-5 elements (heading + paragraph + bullet_list). MUST include imagePrompt.
▸ three_column_grid: Exactly 3 callout elements with title, content, iconName.
▸ timeline_flow: 3-4 callout elements with title and content.
▸ metric_showcase: Exactly 3 stat_metric elements (metricValue, metricLabel, iconName).
▸ comparison_matrix: 5 bullet_list or callout elements.
▸ image_gallery: 2-6 image_block elements with imageQuery and imageCaption.
▸ quote_focus: 1 callout or paragraph element with the quote text.
▸ big_number: 1 stat_metric + 1-2 supporting elements (paragraph or bullet_list).

═══════════════════════════════════════════════════════════════════════════════
CONTENT QUALITY STANDARDS (non-negotiable):
═══════════════════════════════════════════════════════════════════════════════

1. WRITE FOR SLIDES, NOT DOCUMENTS. Use the SLIDE DIET.
   - Bullet points: 6-8 words each. Front-load the insight.
   - Paragraphs: 1-2 sentences maximum. Active voice.

2. EVERY data point must be specific and plausible.

3. Subtitles must NEVER repeat the title. They must answer "So what?" or "Why should I care?"

4. imagePrompt must be a rich, cinematic visual description (15-30 words).

6. IDs must be unique strings: card IDs as "slide-1", "slide-2", etc. Element IDs as "el-1-1", "el-1-2", etc.

7. PROFESSIONAL TONE throughout. Zero emojis. Zero casual language. Authoritative yet accessible.

8. The entire deck must tell a COHESIVE STORY — each slide should build on the previous one. A viewer should be able to follow the narrative by reading only the slide titles in sequence.

9. The "description" field in the root object should be a 1-sentence summary of the presentation's purpose.

10. YOU MUST GENERATE ALL SLIDES FROM THE OUTLINE. Do not stop after the first slide. The "cards" array must have the exact same number of items as the outline.

11. VALID ICON NAMES (use lowercase only): brain, zap, shield, users, target

═══════════════════════════════════════════════════════════════════════════════
COLOR PALETTE DESIGN (CRITICAL — this controls the entire visual identity):
═══════════════════════════════════════════════════════════════════════════════

You MUST generate a "colorPalette" object in the root of the JSON. The colors must be chosen to match the TOPIC, INDUSTRY, and EMOTIONAL TONE of the presentation. Every color must be a valid hex string (e.g. "#6366f1").

Fields:
- primary: The dominant accent color used for headings, highlights, and key elements.
- secondary: A complementary accent for gradients and secondary emphasis.
- accent: A third distinct color for callouts, badges, and highlights.
- background: The slide background color (dark presentations: "#0a0a0f" to "#1a1a2e"; light: "#f8f9fa" to "#ffffff").
- surface: Card/panel surface color, slightly lighter than background.
- text: Primary text color (light on dark backgrounds, dark on light backgrounds).
- textMuted: Secondary/muted text color.
- accents: Array of exactly 4 distinct but harmonious colors for multi-column layouts (three_column_grid, metric_showcase, timeline_flow). Each column/node gets its own accent.

TOPIC-BASED COLOR GUIDANCE:
- Technology/AI/Startup: Electric blues (#3b82f6), vivid purples (#8b5cf6), cyan (#06b6d4), neon accents
- Finance/Business/Consulting: Navy (#1e3a5f), gold (#d4a574), silver (#94a3b8), trust-building deep tones
- Healthcare/Medical: Clean blues (#0ea5e9), soft greens (#10b981), white surfaces, calming palette
- Environment/Nature/Sustainability: Forest greens (#059669), earth amber (#d97706), warm tones
- Education/Academic: Royal blue (#2563eb), warm coral (#f97316), scholarly deep tones
- Creative/Design/Marketing: Bold magenta (#ec4899), coral (#f43f5e), creative vibrant palette
- Science/Research: Deep indigo (#4f46e5), teal (#14b8a6), analytical cool tones
- Food/Hospitality: Warm oranges (#ea580c), rich reds (#dc2626), appetizing warm palette
- Sports/Fitness: Energetic reds (#ef4444), electric green (#22c55e), dynamic high-energy colors
- Real Estate/Architecture: Slate (#475569), warm gold (#b45309), elegant muted tones

RULES:
1. Colors must have sufficient contrast for readability (light text on dark backgrounds, or dark text on light backgrounds).
2. The 4 accents array colors must be VISUALLY DISTINCT from each other — not 4 shades of the same hue.
3. Primary and secondary should create an attractive gradient when combined.
4. Dark backgrounds are preferred for most topics (more cinematic). Use light backgrounds only for topics like healthcare, education, or when explicitly requested.
5. NEVER use pure black (#000000) as background — always add a subtle color tint.

Return ONLY valid JSON. No markdown fences, no explanation, no commentary.`;

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
    const imageSource: string = body.imageSource ?? "ai";

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json(
        { error: "A 'topic' string is required." },
        { status: 400 }
      );
    }

    // ── Stage 1: Generate Outline ──────────────────────────────────────────
    let outlineRaw;
    try {
      const userPrompt = [
        `Create a professional PowerPoint presentation outline.`,
        `Topic: "${topic}"`,
        `Number of slides: exactly ${slideCount}`,
        ``,
        `REQUIREMENTS:`,
        `- Slide 1 must use "title_hero" layout.`,
        `- Select layouts strategically: think about which layout best communicates each point. A data-heavy point needs metric_showcase or big_number. A process needs timeline_flow. A concept explanation needs two_column_split with a visual.`,
        `- Never repeat the same layout consecutively.`,
        `- The contentNote for each slide must describe SPECIFIC content: name companies, cite statistics, reference frameworks — not vague descriptions.`,
        `- Craft titles that would work as actual PowerPoint slide titles — punchy, clear, and curiosity-provoking.`,
        `- Think about the VISUAL FLOW: how will this sequence of layouts feel when presenting? Alternate between data-dense and visual/emotional slides.`,
      ].join("\n");
      outlineRaw = await generateContent(OUTLINE_SYSTEM_PROMPT, userPrompt);
    } catch (e: any) {
      throw new Error(`Stage 1 failed: ${e.message}`);
    }

    if (!outlineRaw) {
      throw new Error("Stage 1 failed: API returned an empty outline.");
    }

    let outline: any;
    try {
      outline = JSON.parse(outlineRaw);
    } catch (e) {
      console.error("[generate] Failed to parse outline:", outlineRaw);
      throw new Error(
        "Stage 1 failed: Gemini returned malformed JSON for the outline."
      );
    }

    // ── Stage 2: Generate Full Content ─────────────────────────────────────
    let contentRaw;
    try {
      const userPrompt = [
        `Transform this outline into a complete, presentation-ready PowerPoint deck.`,
        ``,
        `Topic: "${topic}"`,
        `Theme: "${theme}"`,
        `Verbosity: "${verbosity}" (short = terse bullet points ideal for fast-paced talks; medium = balanced; detailed = richer paragraphs for deep-dive sessions)`,
        ``,
        `CRITICAL INSTRUCTIONS:`,
        `1. Follow the LAYOUT-SPECIFIC ELEMENT RULES exactly. Each layout type requires specific element types and counts — mismatched elements will cause rendering failures.`,
        `2. For each slide, THINK: "What elements does this layout render?" then provide exactly those elements.`,
        `3. Write content AS IF IT WILL APPEAR ON A PROJECTED SLIDE — concise, scannable, impactful. Not a report. Not an essay. A PRESENTATION.`,
        `4. Every bullet point must contain a specific insight with data. Every metric must use a short, striking value.`,
        `5. imagePrompt descriptions must be detailed enough for AI image generation (15-30 words, cinematic style).`,
        `6. Ensure the deck tells a cohesive story: reading just the slide titles in order should convey the narrative.`,
        ``,
        `Outline to expand:\n${JSON.stringify(outline, null, 2)}`,
      ].join("\n");
      contentRaw = await generateContent(CONTENT_SYSTEM_PROMPT, userPrompt);
    } catch (e: any) {
      throw new Error(`Stage 2 failed: ${e.message}`);
    }

    if (!contentRaw) {
      throw new Error("Stage 2 failed: API returned empty content.");
    }

    let deck: any;
    try {
      deck = JSON.parse(contentRaw);
    } catch (e) {
      console.error("[generate] Failed to parse deck:", contentRaw);
      throw new Error(
        "Stage 2 failed: Gemini returned malformed JSON for the deck."
      );
    }

    // ── Stage 3: Hydrate images via Pollinations or Web ───────────────────
    if (deck.cards && Array.isArray(deck.cards)) {
      deck.cards = deck.cards.map((card: any) => {
        // Resolve card-level image prompt
        if (card.imagePrompt && typeof card.imagePrompt === "string") {
          card.imageUrl = imageSource === "web" 
            ? resolveWebImage(card.imagePrompt) 
            : resolveImageUrl(card.imagePrompt);
        } else if (card.layout === "two_column_split" || card.layout === "quote_focus") {
          // Generate a fallback image for layouts that need visuals
          const fallbackQuery = `${card.title} professional corporate visual`;
          card.imageUrl = imageSource === "web" 
            ? resolveWebImage(fallbackQuery) 
            : resolveImageUrl(fallbackQuery);
        }

        // Resolve element-level image queries
        if (card.elements && Array.isArray(card.elements)) {
          card.elements = card.elements.map((el: any) => {
            if (
              el.type === "image_block" &&
              el.imageQuery &&
              typeof el.imageQuery === "string"
            ) {
              el.imageUrl = imageSource === "web" 
                ? resolveWebImage(el.imageQuery) 
                : resolveImageUrl(el.imageQuery);
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

    // Attach imageSource so it can be preserved and used in the editor
    deck.imageSource = imageSource;

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
