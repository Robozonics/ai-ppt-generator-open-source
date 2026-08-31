import { NextResponse } from "next/server";
import { groq, GROQ_MODEL } from "@/lib/groq";

const MODIFY_SYSTEM_PROMPT = `You are an AI editor modifying a JSON slide card. You MUST deeply apply the user's instruction and return the updated JSON.
Rules:
- Return ONLY valid JSON, no markdown formatting.
- The root must be the modified card object.
- Keep the 'id' and 'order' fields exactly the same.
- Modify the 'title', 'subtitle', 'imagePrompt', 'layout', or 'elements' array to completely fulfill the instruction.`;

export async function POST(req: Request) {
  try {
    const { instruction, currentCard } = await req.json();

    if (!instruction || !currentCard) {
      return NextResponse.json(
        { error: "Both 'instruction' and 'currentCard' are required." },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: MODIFY_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Here is the current card JSON:\n${JSON.stringify(currentCard, null, 2)}\n\nInstruction: ${instruction}`,
        },
      ],
      model: GROQ_MODEL,
      response_format: { type: "json_object" },
      temperature: 0.6,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("No response from Groq.");
    }

    const modifiedCard = JSON.parse(responseContent);

    // Preserve immutable fields from the original card
    modifiedCard.id = currentCard.id;
    modifiedCard.order = currentCard.order;

    // Re-hydrate image URLs via Pollinations if prompts were modified
    if (modifiedCard.imagePrompt && typeof modifiedCard.imagePrompt === "string") {
      const { resolveImageUrl } = await import("@/lib/imageResolver");
      modifiedCard.imageUrl = resolveImageUrl(modifiedCard.imagePrompt);
    }

    if (modifiedCard.elements && Array.isArray(modifiedCard.elements)) {
      const { resolveImageUrl } = await import("@/lib/imageResolver");
      modifiedCard.elements = modifiedCard.elements.map((el: any) => {
        if (el.type === "image_block" && el.imageQuery && typeof el.imageQuery === "string") {
          el.imageUrl = resolveImageUrl(el.imageQuery);
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
