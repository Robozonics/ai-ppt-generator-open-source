/**
 * Image Resolver
 *
 * Primary: Gemini AI image generation via /api/generate-image (gemini-3.1-flash-image)
 * Fallback: Pollinations.ai URLs (zero-auth, instant)
 *
 * resolveImageUrl() returns a Pollinations URL synchronously (used during SSR/generation).
 * generateAIImage() calls Gemini asynchronously for higher quality AI-generated images.
 */

const AESTHETIC_SUFFIXES = [
  "photorealistic",
  "8k",
  "highly detailed",
  "cinematic lighting",
  "professional photography",
  "sharp focus",
];

/**
 * Synchronous fallback — returns a Pollinations.ai image URL instantly.
 * Used when Gemini image generation is unavailable or during initial hydration.
 */
export function resolveImageUrl(prompt: string): string {
  const cleaned = prompt.trim().replace(/\s+/g, " ");

  if (!cleaned) {
    return resolveImageUrl("abstract gradient dark background professional");
  }

  const enhanced = `${cleaned}, ${AESTHETIC_SUFFIXES.join(", ")}`;
  const encoded = encodeURIComponent(enhanced);
  const seed = Math.floor(Math.random() * 10000);

  return `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&seed=${seed}`;
}

/**
 * Backwards-compatible alias used by layout components.
 */
export function getImageUrl(query: string, width = 1280, height = 720): string {
  const cleaned = query.trim().replace(/\s+/g, " ");
  if (!cleaned) return resolveImageUrl("abstract gradient dark background professional");

  const enhanced = `${cleaned}, ${AESTHETIC_SUFFIXES.join(", ")}`;
  const encoded = encodeURIComponent(enhanced);
  const seed = Math.floor(Math.random() * 10000);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
}

/**
 * Async Gemini-powered image generation.
 * Calls /api/generate-image which uses gemini-3.1-flash-image.
 * Returns a base64 data URL on success, or falls back to Pollinations URL.
 *
 * NOTE: This is meant to be called from the server-side (API routes).
 *       For client-side, use resolveImageUrl() as the fallback.
 */
export async function generateAIImage(prompt: string, baseUrl: string): Promise<string> {
  try {
    const response = await fetch(`${baseUrl}/api/generate-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      console.warn(`[imageResolver] Gemini image gen failed (${response.status}), falling back to Pollinations`);
      return resolveImageUrl(prompt);
    }

    const data = await response.json();

    if (data.imageUrl) {
      return data.imageUrl;
    }

    return resolveImageUrl(prompt);
  } catch (error) {
    console.warn("[imageResolver] Gemini image gen error, falling back to Pollinations:", error);
    return resolveImageUrl(prompt);
  }
}
