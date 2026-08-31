/**
 * Pollinations.ai Image Resolver
 *
 * Generates zero-auth image URLs from text prompts.
 * Appends aesthetic modifiers to improve visual quality for presentation slides.
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
 * Sanitizes a raw text prompt, appends aesthetic modifiers, and returns
 * a fully resolved Pollinations.ai image URL.
 *
 * @param prompt - The raw descriptive prompt (e.g. "futuristic AI neural network")
 * @returns A fully formed Pollinations.ai URL ready for <img src="">
 */
export function resolveImageUrl(prompt: string): string {
  // 1. Trim and collapse whitespace
  const cleaned = prompt.trim().replace(/\s+/g, " ");

  if (!cleaned) {
    // Fallback to a generic professional slide background
    return resolveImageUrl("abstract gradient dark background professional");
  }

  // 2. Append aesthetic modifiers for higher quality generation
  const enhanced = `${cleaned}, ${AESTHETIC_SUFFIXES.join(", ")}`;

  // 3. URI-encode the full enhanced prompt
  const encoded = encodeURIComponent(enhanced);

  // 4. Generate a random seed so repeated identical prompts yield variety
  const seed = Math.floor(Math.random() * 10000);

  // 5. Force the stable free endpoint because gen.pollinations.ai throws 401 Unauthorized with the provided key.
  return `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&seed=${seed}`;
}

/**
 * Backwards-compatible alias used by layout components.
 * Delegates directly to resolveImageUrl.
 */
export function getImageUrl(query: string, width = 1280, height = 720): string {
  const cleaned = query.trim().replace(/\s+/g, " ");
  if (!cleaned) return resolveImageUrl("abstract gradient dark background professional");

  const enhanced = `${cleaned}, ${AESTHETIC_SUFFIXES.join(", ")}`;
  const encoded = encodeURIComponent(enhanced);
  const seed = Math.floor(Math.random() * 10000);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
}
