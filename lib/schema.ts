import { z } from "zod";

export const ElementSchema = z.object({
  id: z.string(),
  type: z.enum(["heading", "paragraph", "bullet_list", "stat_metric", "callout", "image_block"]),
  content: z.string().optional(),
  items: z.array(z.string()).optional(),
  metricValue: z.string().optional(),
  metricLabel: z.string().optional(),
  iconName: z.string().optional(),
  imageQuery: z.string().optional(),
  imageCaption: z.string().optional(),
  imageUrl: z.string().optional(),
  title: z.string().optional()
});

export const CardLayoutEnum = z.enum([
  "title_hero",
  "two_column_split",
  "three_column_grid",
  "timeline_flow",
  "metric_showcase",
  "comparison_matrix",
  "image_gallery",
  "quote_focus",
  "big_number"
]);

export const CardSchema = z.object({
  id: z.string(),
  order: z.number(),
  layout: CardLayoutEnum,
  badgeText: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  elements: z.array(ElementSchema),
  imagePrompt: z.string().optional(),
  themeOverride: z.string().optional(),
  imageUrl: z.string().optional()
});

export const ColorPaletteSchema = z.object({
  primary: z.string(),       // Main accent — e.g. "#6366f1"
  secondary: z.string(),     // Secondary accent — e.g. "#ec4899"
  accent: z.string(),        // Highlight/callout — e.g. "#10b981"
  background: z.string(),    // Slide background — e.g. "#0b0f19"
  surface: z.string(),       // Card/panel surface — e.g. "#1a1a2e"
  text: z.string(),          // Primary text color — e.g. "#f8fafc"
  textMuted: z.string(),     // Secondary text — e.g. "#94a3b8"
  accents: z.array(z.string()).optional()  // 3-4 distinct accents for multi-column layouts
});

export const PresentationDeckSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  theme: z.enum(["nebula_dark", "cyber_obsidian", "aurora_glass", "minimal_light", "editorial_serif"]),
  colorPalette: ColorPaletteSchema.optional(),
  imageSource: z.enum(["ai", "web"]).optional(),
  cards: z.array(CardSchema)
});

export type PresentationDeck = z.infer<typeof PresentationDeckSchema>;
export type Card = z.infer<typeof CardSchema>;
export type Element = z.infer<typeof ElementSchema>;
export type ColorPalette = z.infer<typeof ColorPaletteSchema>;

