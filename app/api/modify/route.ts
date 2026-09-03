import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";

const MODIFY_SYSTEM_PROMPT = `You are an elite Executive Presentation Designer and Content Strategist. You modify a SINGLE slide card to fulfill the user's instructions with utmost precision and boardroom presentation quality.

CRITICAL SCOPE RULE:
- You are modifying ONLY THIS SINGLE SLIDE. Any changes to styling, text, images, or layout must apply ONLY to this slide.
- If the user asks to change the color, styling, or theme of the slide, its text, or its background, update the "colorPalette" object directly inside the card (fields: primary, secondary, accent, background, surface, text, textMuted, accents). This keeps the style change strictly isolated to this single slide.

FULL AUTHORITY & CAPABILITIES:
- You have 100% full authority over this slide:
  1. REWRITE & EDIT TEXT: Rewrite, polish, expand, or simplify 'title', 'subtitle', 'badgeText', and all element content, bullet points, and metrics according to the user's prompt.
  2. CHANGE OR ADD PICTURES: Update 'imagePrompt' or element 'imageQuery' with rich, cinematic visual descriptions (15-30 words) whenever the user asks to add or change pictures.
  3. CHANGE LAYOUT: Switch the 'layout' field and restructure 'elements' to match the target layout.
  4. CHANGE COLORS & STYLES: Set or update 'colorPalette' on the card with valid hex codes (e.g. text: "#ff0000" for red text, primary: "#10b981", background: "#050505", etc.).
  5. RESTRUCTURE ELEMENTS: Add, remove, or rearrange metrics, callouts, lists, or icons.

EDITING RULES:
- Return ONLY valid JSON of the modified card object.
- Keep the 'id' and 'order' fields exactly the same as provided.
- If changing the layout type, restructure the elements array to match what the new layout requires:
  • title_hero: No elements needed.
  • two_column_split: 3-5 elements (heading + paragraph + bullet_list), plus imagePrompt.
  • three_column_grid: Exactly 3 callout elements with title, content, and iconName.
  • timeline_flow: 3-4 callout elements with title and content.
  • metric_showcase: Exactly 3 stat_metric elements with metricValue, metricLabel, and iconName.
  • comparison_matrix: 5 bullet_list or callout elements for feature rows.
  • image_gallery: 2-6 image_block elements with imageQuery and imageCaption.
  • quote_focus: 1 callout or paragraph element with the quote text.
  • big_number: 1 stat_metric + 1-2 supporting elements (paragraph or bullet_list).
- Write like a top-tier executive designer — authoritative, specific, data-driven. Zero fluff.
- VALID ICON NAMES (lowercase only): brain, zap, shield, users, target`;

export async function POST(req: Request) {
  try {
    const { instruction, currentCard, colorPalette, imageSource } = await req.json();

    if (!instruction || !currentCard) {
      return NextResponse.json(
        { error: "Both 'instruction' and 'currentCard' are required." },
        { status: 400 }
      );
    }

    const userPrompt = `Here is the current card JSON to modify:\n${JSON.stringify(currentCard, null, 2)}\n\nCurrent presentation default colorPalette:\n${JSON.stringify(colorPalette, null, 2)}\n\nUser Instruction: ${instruction}\n\nRemember: Apply all changes ONLY to this single card. Return ONLY the updated card JSON.`;
    
    const responseContent = await generateContent(MODIFY_SYSTEM_PROMPT, userPrompt);

    // Robust JSON extraction in case the AI includes markdown fences
    let cleanJSON = responseContent.trim();
    const match = cleanJSON.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (match) cleanJSON = match[1].trim();
    if (!cleanJSON.startsWith("{")) cleanJSON = cleanJSON.substring(cleanJSON.indexOf("{"));
    if (!cleanJSON.endsWith("}")) cleanJSON = cleanJSON.substring(0, cleanJSON.lastIndexOf("}") + 1);

    const parsedData = JSON.parse(cleanJSON);
    
    // Support either direct card or wrapped card
    const modifiedCard = parsedData.modifiedCard || parsedData;

    // Preserve immutable fields from the original card
    modifiedCard.id = currentCard.id;
    modifiedCard.order = currentCard.order;

    // Re-hydrate image URLs via appropriate resolver if prompts were modified
    if (modifiedCard.imagePrompt && typeof modifiedCard.imagePrompt === "string") {
      const { resolveImageUrl, resolveWebImage } = await import("@/lib/imageResolver");
      modifiedCard.imageUrl = imageSource === "web" 
        ? resolveWebImage(modifiedCard.imagePrompt) 
        : resolveImageUrl(modifiedCard.imagePrompt);
    }

    if (modifiedCard.elements && Array.isArray(modifiedCard.elements)) {
      const { resolveImageUrl, resolveWebImage } = await import("@/lib/imageResolver");
      modifiedCard.elements = modifiedCard.elements.map((el: any) => {
        if (el.type === "image_block" && el.imageQuery && typeof el.imageQuery === "string") {
          el.imageUrl = imageSource === "web" 
            ? resolveWebImage(el.imageQuery) 
            : resolveImageUrl(el.imageQuery);
        }
        return el;
      });
    }

    return NextResponse.json({ modifiedCard });
  } catch (error: any) {
    console.error("Card modification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to modify card" },
      { status: 500 }
    );
  }
}
