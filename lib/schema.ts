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
  imageUrl: z.string().optional()
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

export const PresentationDeckSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  theme: z.enum(["nebula_dark", "cyber_obsidian", "aurora_glass", "minimal_light", "editorial_serif"]),
  cards: z.array(CardSchema)
});

export type PresentationDeck = z.infer<typeof PresentationDeckSchema>;
export type Card = z.infer<typeof CardSchema>;
export type Element = z.infer<typeof ElementSchema>;
