import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";

const MODIFY_SYSTEM_PROMPT = `You are an elite Executive Presentation Designer and Content Strategist. You have FULL AUTHORITY to modify the JSON slide cards and the presentation's color palette to fulfill the user's instruction.

BEFORE MODIFYING, THINK STEP-BY-STEP:
1. What is the user asking to change? Content? Layout? Visuals? Colors? Pictures?
2. Does the change respect the SLIDE DIET? (Max 1 core idea, max 3-5 bullets, max 6-8 words per bullet).
3. Does the title remain an ACTION TITLE?

EDITING RULES:
- Return ONLY valid JSON containing TWO objects: {"modifiedCard": { ... }, "modifiedColorPalette": { ... }}
- 'modifiedCard' must contain the fully updated card. Keep the 'id' and 'order' fields exactly the same.
- 'modifiedColorPalette' must contain the updated colorPalette (if colors were modified to fulfill the instruction) or the original one.
- You can modify the 'title', 'subtitle', 'badgeText', 'imagePrompt', 'layout', or 'elements' array to completely fulfill the instruction.
- If the user asks to add or change a picture, modify 'imagePrompt' (for layouts that support it) or 'imageQuery' in the 'image_block' elements. Make the prompt highly descriptive.
- If the user asks to change the text color, background color, or theme, modify the 'modifiedColorPalette' properties (primary, secondary, text, background, etc.) with new valid hex codes.
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
- Write like a McKinsey partner — authoritative, specific, data-driven. Zero fluff.
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

    const userPrompt = `Here is the current card JSON:\n${JSON.stringify(currentCard, null, 2)}\n\nHere is the current presentation colorPalette:\n${JSON.stringify(colorPalette, null, 2)}\n\nInstruction: ${instruction}`;
    
    const responseContent = await generateContent(MODIFY_SYSTEM_PROMPT, userPrompt);

    // Robust JSON extraction in case the AI includes markdown fences
    let cleanJSON = responseContent.trim();
    const match = cleanJSON.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (match) cleanJSON = match[1].trim();
    if (!cleanJSON.startsWith("{")) cleanJSON = cleanJSON.substring(cleanJSON.indexOf("{"));
    if (!cleanJSON.endsWith("}")) cleanJSON = cleanJSON.substring(0, cleanJSON.lastIndexOf("}") + 1);

    const parsedData = JSON.parse(cleanJSON);
    
    // Support either the new nested format or the old flat format
    const modifiedCard = parsedData.modifiedCard || parsedData;
    const modifiedColorPalette = parsedData.modifiedColorPalette || colorPalette;

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

    return NextResponse.json({ modifiedCard, modifiedColorPalette });
  } catch (error: any) {
    console.error("Card modification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to modify card" },
      { status: 500 }
    );
  }
}
