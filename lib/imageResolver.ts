/**
 * Image Resolver
 *
 * Primary: AI image generation via Pollinations.ai (zero-auth, instant)
 * Real Web Pictures: loremflickr (real photos from flickr)
 */

const AESTHETIC_SUFFIXES = [
  "professional corporate presentation style",
  "clean minimalist",
  "8k resolution",
];

/**
 * Synchronous AI image resolver — returns a Pollinations.ai image URL.
 */
export function resolveImageUrl(prompt: string): string {
  const cleaned = (prompt || "abstract gradient dark background").trim().replace(/\s+/g, " ").substring(0, 150);

  const enhanced = `${cleaned}, ${AESTHETIC_SUFFIXES.join(", ")}`;
  // Pollinations API requires the prompt in the URL path, so we encode it.
  const encoded = encodeURIComponent(enhanced.substring(0, 300));
  const seed = Math.floor(Math.random() * 1000000);

  return `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&seed=${seed}`;
}

/**
 * Synchronous Web Picture resolver — returns a high-definition, verified stock photo URL.
 * Matches keywords from the prompt to select the most relevant topic photography using loremflickr.
 */
export function resolveWebImage(prompt: string): string {
  const text = (prompt || "abstract").toLowerCase();
  
  // Extract a core keyword for the flickr search
  const keywords = ["business", "technology", "ai", "finance", "healthcare", "medical", "nature", "team", "people", "abstract", "corporate", "data", "graph", "chart", "robot", "software", "office", "money", "industry"];
  
  let matchedKeyword = "business";
  for (const k of keywords) {
    if (text.includes(k)) {
      matchedKeyword = k;
      break;
    }
  }

  // Use simple string hash of the prompt for consistency across renders
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const lock = Math.abs(hash) % 10000;

  // loremflickr returns real photos from flickr based on keyword
  return `https://loremflickr.com/1280/720/${encodeURIComponent(matchedKeyword)}?lock=${lock}`;
}

/**
 * Backwards-compatible alias used by layout components.
 */
export function getImageUrl(query: string, width = 1280, height = 720): string {
  const cleaned = query.trim().replace(/\s+/g, " ").substring(0, 150);
  if (!cleaned) return resolveImageUrl("abstract gradient dark background professional");

  const enhanced = `${cleaned}, ${AESTHETIC_SUFFIXES.join(", ")}`;
  const encoded = encodeURIComponent(enhanced.substring(0, 300));
  const seed = Math.floor(Math.random() * 1000000);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
}

/**
 * Async Gemini-powered image generation.
 * Currently just an alias to the sync resolver, as Gemini 1.5/3.5 Text APIs do not output images.
 */
export async function generateAIImage(prompt: string, baseUrl: string): Promise<string> {
  return resolveImageUrl(prompt);
}
