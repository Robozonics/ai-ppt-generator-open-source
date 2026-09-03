/**
 * Gemini API Client
 *
 * Calls the Google Generative Language REST API with automatic multi-key rotation
 * and instant failover on 429 Quota Exceeded and 403 Forbidden errors.
 * Server-only — never import into client components.
 */

// gemini-3.5-flash — fast and capable model
const MODEL = "gemini-3.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// In-memory pointer to the currently healthy key index
let currentKeyIndex = 0;

/**
 * Retrieve all configured Gemini API keys from environment variables.
 * Supports comma-separated keys in GEMINI_API_KEY / GEMINI_API_KEYS,
 * as well as indexed variables GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_API_KEY_3, etc.
 */
export function getGeminiApiKeys(): string[] {
  const sources = [
    process.env.GEMINI_API_KEYS,
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GOOGLE_GENAI_API_KEY,
    process.env.GOOGLE_API_KEY,
  ];

  const keys: string[] = [];
  for (const src of sources) {
    if (!src) continue;
    // Support comma, semicolon, or newline separation
    const splitKeys = src.split(/[,;\n]+/).map((k) => k.trim());
    for (const k of splitKeys) {
      if (k && !keys.includes(k)) {
        keys.push(k);
      }
    }
  }

  return keys;
}

/**
 * Extract the first valid JSON object from a string that may contain
 * markdown fences, chain-of-thought reasoning, or other surrounding text.
 */
function extractJSON(raw: string): string {
  // 1. Try parsing the raw string directly first
  try {
    JSON.parse(raw);
    return raw.trim();
  } catch {
    // continue to extraction
  }

  // 2. Try to find content inside ```json ... ``` or ``` ... ``` fences
  const fenceMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    try {
      JSON.parse(fenceMatch[1].trim());
      return fenceMatch[1].trim();
    } catch {
      // continue
    }
  }

  // 3. Find the first '{' and last '}' and try to parse that substring
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = raw.substring(firstBrace, lastBrace + 1);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      // continue
    }
  }

  // 4. Give up — return the raw string (caller will get JSON.parse error with details)
  return raw.trim();
}

export async function generateContent(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const keys = getGeminiApiKeys();

  if (keys.length === 0) {
    throw new Error(
      "No Gemini API key configured. Please set GEMINI_API_KEY or GEMINI_API_KEYS in your environment."
    );
  }

  let lastError: Error | null = null;
  // Allow trying all available keys with retries
  const maxAttempts = Math.max(keys.length * 2, 4);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const keyIdx = (currentKeyIndex + attempt) % keys.length;
    const currentKey = keys[keyIdx];

    try {
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
              parts: [{ text: userPrompt }],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        const error = new Error(
          `Gemini API Error (${MODEL}): ${response.status} ${errorBody}`
        );
        (error as any).status = response.status;
        throw error;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("Empty response from Gemini API");
      }

      // Extract clean JSON from potentially messy output
      const cleanJSON = extractJSON(rawText);

      // Validate it's actually parseable before returning
      JSON.parse(cleanJSON);

      // Successfully used keyIdx; keep it as primary for upcoming requests
      currentKeyIndex = keyIdx;

      return cleanJSON;
    } catch (err: any) {
      lastError = err;
      const isQuotaOrAuth = err?.status === 429 || err?.status === 403;
      const isRetryable =
        isQuotaOrAuth ||
        err instanceof SyntaxError ||
        err?.status === 503 ||
        err?.code === "ECONNRESET" ||
        err?.message?.includes("fetch failed");

      if (!isRetryable || attempt === maxAttempts - 1) throw err;

      if (isQuotaOrAuth) {
        const nextIdx = (keyIdx + 1) % keys.length;
        console.warn(
          `[gemini] Key ${keyIdx + 1}/${keys.length} encountered ${err.status} (${err.message?.includes("quota") ? "Quota exceeded" : "Auth error"}). Instantly switching to key ${nextIdx + 1}/${keys.length}...`
        );
        currentKeyIndex = nextIdx;
        // Instantly try the next key without delay
        continue;
      }

      // Fast linear backoff for network/parse glitches: 600ms, 1200ms...
      const delay = 600 * (attempt + 1);
      console.log(
        `[gemini] Retrying in ${delay}ms (attempt ${attempt + 1}/${maxAttempts})...`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError;
}
