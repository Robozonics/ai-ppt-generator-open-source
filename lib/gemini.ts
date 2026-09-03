/**
 * Gemini API Client
 *
 * Calls the Google Generative Language REST API using the user-provided API key.
 * Server-only — never import into client components.
 */

const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY || "",
].filter(Boolean);

// gemini-3.5-flash — fast and capable model
const MODEL = "gemini-3.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const MAX_RETRIES = 4;

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
  let lastError: Error | null = null;

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

      return cleanJSON;
    } catch (err: any) {
      lastError = err;
      const isRetryable =
        err instanceof SyntaxError ||
        err?.status === 429 ||
        err?.status === 403 ||
        err?.status === 503 ||
        err?.code === "ECONNRESET" ||
        err?.message?.includes("fetch failed");

      if (!isRetryable || attempt === MAX_RETRIES) throw err;

      // Exponential backoff: 1s, 3s, 9s, 27s
      const delay = 1000 * Math.pow(3, attempt);
      console.log(
        `[gemini] Retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError;
}
