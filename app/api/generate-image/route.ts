import { NextResponse } from "next/server";

const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY || "",
].filter(Boolean);
const IMAGE_MODEL = "gemini-3.1-flash-image";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent`;

const MAX_RETRIES = 2;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "A 'prompt' string is required." },
        { status: 400 }
      );
    }

    // Enhanced prompt for professional slide imagery
    const enhancedPrompt = `Generate a high-quality, professional image for a presentation slide. The image should be clean, modern, and suitable for a corporate/professional presentation. Style: photorealistic, 8K, cinematic lighting, sharp focus, no text overlay, no watermarks. Subject: ${prompt}`;

    let lastError: string = "";

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const currentKey = GEMINI_API_KEYS[attempt % GEMINI_API_KEYS.length] || "";
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": currentKey,
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: enhancedPrompt }],
              },
            ],
            generationConfig: {
              responseModalities: ["IMAGE", "TEXT"],
              temperature: 0.8,
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[generate-image] API error (attempt ${attempt + 1}):`, response.status, errorText);
          lastError = `Image generation failed: ${response.status}`;

          // Don't retry on 4xx errors (client errors) unless it is a 403 or 429 (quota/auth which might be fixed by another key)
          if (response.status >= 400 && response.status < 500 && response.status !== 403 && response.status !== 429) {
            break;
          }

          // Retry on 5xx errors
          if (attempt < MAX_RETRIES) {
            await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
            continue;
          }

          return NextResponse.json(
            { error: lastError },
            { status: response.status }
          );
        }

        const data = await response.json();
        const parts = data.candidates?.[0]?.content?.parts;

        if (!parts || parts.length === 0) {
          console.warn("[generate-image] No parts in response, retrying...");
          if (attempt < MAX_RETRIES) continue;
          return NextResponse.json(
            { error: "No image generated" },
            { status: 500 }
          );
        }

        // Find the image part (inline_data with mimeType image/*)
        const imagePart = parts.find(
          (p: any) => p.inlineData && p.inlineData.mimeType?.startsWith("image/")
        );

        if (imagePart) {
          // Return base64 image data
          return NextResponse.json({
            imageData: imagePart.inlineData.data,
            mimeType: imagePart.inlineData.mimeType,
            imageUrl: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
          });
        }

        // No image part found, try again
        console.warn("[generate-image] No image part in response parts, retrying...");
        if (attempt < MAX_RETRIES) continue;

      } catch (fetchError: any) {
        console.error(`[generate-image] Fetch error (attempt ${attempt + 1}):`, fetchError.message);
        lastError = fetchError.message;
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
      }
    }

    // Fallback: return a Pollinations.ai URL so images always show up
    const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ", photorealistic, 8k, cinematic lighting, professional")}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 10000)}`;
    
    console.warn("[generate-image] All retries failed, returning Pollinations fallback");
    return NextResponse.json({
      imageUrl: fallbackUrl,
      fallback: true,
    });

  } catch (error: any) {
    console.error("[generate-image] Error:", error);
    
    // Even on error, return a fallback image URL
    const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent("abstract professional gradient background")}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 10000)}`;
    
    return NextResponse.json({
      imageUrl: fallbackUrl,
      fallback: true,
      error: error.message || "Image generation failed",
    });
  }
}
