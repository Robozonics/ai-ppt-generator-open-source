/**
 * Image Resolver
 *
 * Primary: Gemini AI image generation via /api/generate-image (gemini-3.1-flash-image)
 * AI Web Fallback: Pollinations.ai (zero-auth, instant)
 * Real Web Pictures: Curated high-res Unsplash CDN stock photography (100% reliable, fast CDN)
 */

const AESTHETIC_SUFFIXES = [
  "professional corporate presentation style",
  "clean minimalist",
  "photorealistic",
  "8k resolution",
  "highly detailed",
  "cinematic lighting",
  "award-winning photography",
  "sharp focus",
];

// Curated library of verified high-res Unsplash CDN images categorized by presentation topics
const WEB_STOCK_CATEGORIES: Record<string, string[]> = {
  ai_tech: [
    "photo-1620712943543-bcc4688e7485", // AI robot brain
    "photo-1677442136019-21780ecad995", // AI chip futuristic
    "photo-1451187580459-43490279c0fa", // Global neural network
    "photo-1518770660439-4636190af475", // Motherboard circuit processor
    "photo-1498050108023-c5249f4df085", // Coding and software development
    "photo-1526374965328-7f61d4dc18c5", // Cyber code and security matrix
  ],
  business: [
    "photo-1552664730-d307ca884978", // Strategic boardroom meeting
    "photo-1551836022-d5d88e9218df", // Business professionals collaboration
    "photo-1507679799987-c73779587ccf", // Executive in modern suit
    "photo-1497366216548-37526070297c", // Sleek modern glass office workspace
    "photo-1486406146926-c627a92ad1ab", // Corporate skyscraper architecture
  ],
  finance: [
    "photo-1590283603385-17ffb3a7f29f", // Stock market exchange graphs
    "photo-1559526324-4b87b5e36e44", // Modern banking and growth investment
    "photo-1460925895917-afdab827c52f", // Financial data charts analytics
    "photo-1551288049-bebda4e38f71", // Performance analytics dashboard
  ],
  healthcare: [
    "photo-1576091160399-112ba8d25d1d", // Modern medical research and stethoscope
    "photo-1584515979956-d9f6e5d09982", // Healthcare specialist consultation
    "photo-1532094349884-543bc11b234d", // High-tech scientific laboratory
  ],
  green_energy: [
    "photo-1497435334941-8c899ee9e8e9", // Clean wind turbine energy landscape
    "photo-1451187580459-43490279c0fa", // Earth and global ecology
    "photo-1618005182384-a83a8bd57fbe", // Organic fluid abstract waves
  ],
  teamwork: [
    "photo-1522071820081-009f0129c71c", // High-performing team collaboration
    "photo-1522202176988-66273c2fd55f", // University academic learning group
    "photo-1551836022-d5d88e9218df", // Team workshop discussion
  ],
  industry: [
    "photo-1581091226825-a6a2a5aee158", // Advanced robotics and automation
    "photo-1518770660439-4636190af475", // High-precision engineering
  ],
  abstract: [
    "photo-1618005182384-a83a8bd57fbe", // Sleek 3D digital gradient mesh
    "photo-1451187580459-43490279c0fa", // Deep cyber cosmic connection
    "photo-1486406146926-c627a92ad1ab", // High-contrast architectural geometry
  ],
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  ai_tech: ["ai", "artificial", "intelligence", "neural", "robot", "robotics", "machine", "learning", "algorithm", "software", "code", "tech", "computing", "llm", "deep", "cyber", "hardware"],
  business: ["business", "corporate", "executive", "company", "strategy", "enterprise", "board", "leadership", "management", "consulting", "office", "presentation", "meeting"],
  finance: ["finance", "financial", "stock", "market", "revenue", "profit", "investment", "banking", "money", "capital", "growth", "chart", "metrics", "sales", "economy", "fiscal"],
  healthcare: ["health", "healthcare", "medical", "medicine", "doctor", "hospital", "patient", "clinical", "pharma", "biology", "genomics", "disease", "treatment", "care"],
  green_energy: ["green", "energy", "solar", "wind", "sustainability", "climate", "environment", "nature", "earth", "renewable", "eco", "carbon"],
  teamwork: ["team", "collaboration", "people", "group", "culture", "diversity", "hiring", "talent", "employees", "workers", "partnership"],
  industry: ["factory", "manufacturing", "industry", "industrial", "robotics", "automation", "logistics", "supply", "engineering", "hardware"],
};

/**
 * Synchronous AI image resolver — returns a Pollinations.ai image URL.
 */
export function resolveImageUrl(prompt: string): string {
  const cleaned = prompt.trim().replace(/\s+/g, " ");

  if (!cleaned) {
    return resolveImageUrl("abstract gradient dark background professional corporate");
  }

  const enhanced = `${cleaned}, ${AESTHETIC_SUFFIXES.join(", ")}`;
  const encoded = encodeURIComponent(enhanced);
  const seed = Math.floor(Math.random() * 10000);

  return `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&seed=${seed}`;
}

/**
 * Synchronous Web Picture resolver — returns a high-definition, verified Unsplash CDN photo URL.
 * Matches keywords from the prompt to select the most relevant topic photography.
 */
export function resolveWebImage(prompt: string): string {
  const text = (prompt || "").toLowerCase();
  
  // Detect matching category
  let matchedCategory = "abstract";
  for (const [category, words] of Object.entries(CATEGORY_KEYWORDS)) {
    if (words.some((w) => text.includes(w))) {
      matchedCategory = category;
      break;
    }
  }

  const photos = WEB_STOCK_CATEGORIES[matchedCategory] || WEB_STOCK_CATEGORIES.abstract;
  
  // Pick photo based on simple string hash of the prompt for consistency across renders
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const photoIndex = Math.abs(hash) % photos.length;
  const photoId = photos[photoIndex];

  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1280&h=720&q=80`;
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
