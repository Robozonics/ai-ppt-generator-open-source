import Groq from "groq-sdk";

/**
 * Groq SDK Client
 *
 * Singleton instance initialized from GROQ_API_KEY.
 * Used by all API routes (/api/generate, /api/modify, etc.)
 *
 * NOTE: This module is server-only. Never import it into client components.
 */

if (!process.env.GROQ_API_KEY) {
  console.warn(
    "[groq.ts] GROQ_API_KEY is not set. AI generation endpoints will fail."
  );
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/** Default model used across all generation endpoints */
export const GROQ_MODEL = "openai/gpt-oss-120b";

/** Retry helper — retries a Groq call up to `maxRetries` times on transient failures */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isRetryable =
        err?.status === 429 || // rate limit
        err?.status === 503 || // service unavailable
        err?.code === "ECONNRESET";

      if (!isRetryable || attempt === maxRetries) throw err;

      // Exponential backoff: 500ms, 1500ms
      const delay = 500 * Math.pow(3, attempt);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError;
}
