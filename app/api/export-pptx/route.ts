import { NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";
import { PresentationDeck } from "@/lib/schema";

export async function POST(req: Request) {
  try {
    const deck: PresentationDeck = await req.json();
    
    if (!deck || !deck.cards || !Array.isArray(deck.cards)) {
      return NextResponse.json({ error: "Invalid deck data provided." }, { status: 400 });
    }

    // 1. Initialize PptxGenJS
    const pres = new PptxGenJS();
    pres.layout = "LAYOUT_16x9";

    // Standard styling constants
    const TITLE_Y = 0.5;
    const CONTENT_Y_START = 1.8;
    const DEFAULT_MARGIN = 0.5;

    // 2. Iterate through cards and build slides
    for (const card of deck.cards) {
      const slide = pres.addSlide();

      // Background color (matching Nebula Dark roughly)
      slide.background = { color: "0b0f19" };

      // Add Badge if present
      if (card.badgeText) {
        slide.addText(card.badgeText.toUpperCase(), {
          x: DEFAULT_MARGIN, y: 0.3, w: 2, h: 0.3,
          color: "818cf8", // indigo-400
          fontSize: 12,
          bold: true
        });
      }

      // Add Card Title
      slide.addText(card.title, {
        x: DEFAULT_MARGIN, y: TITLE_Y, w: 9, h: 0.8,
        color: "ffffff",
        fontSize: 32,
        bold: true
      });

      // Add Card Subtitle
      if (card.subtitle) {
        slide.addText(card.subtitle, {
          x: DEFAULT_MARGIN, y: TITLE_Y + 0.8, w: 9, h: 0.5,
          color: "94a3b8", // slate-400
          fontSize: 18,
          italic: true
        });
      }

      // 3. Layout Mapping Algorithm
      // This is a basic approximate mapping. Complex layouts require sophisticated coordinates.
      
      let currentY = CONTENT_Y_START;

      if (card.layout === "title_hero") {
        // Centered layout
        currentY += 1;
        card.elements?.forEach(el => {
          if (el.type === "paragraph") {
            slide.addText(el.content || "", { x: 1, y: currentY, w: 8, color: "cbd5e1", fontSize: 20, align: "center" });
            currentY += 1;
          }
        });
      } else if (card.layout === "two_column_split") {
        // Left text, right image
        let textY = currentY;
        card.elements?.forEach(el => {
          if (el.type === "paragraph" || el.type === "heading") {
            const isHeading = el.type === "heading";
            slide.addText(el.content || "", { 
              x: DEFAULT_MARGIN, y: textY, w: 4.5, 
              color: isHeading ? "ffffff" : "cbd5e1", 
              fontSize: isHeading ? 24 : 18,
              bold: isHeading
            });
            textY += 0.8;
          } else if (el.type === "bullet_list" && el.items) {
            const bullets = el.items.map(item => ({ text: item, options: { bullet: true } }));
            slide.addText(bullets as any, { x: DEFAULT_MARGIN, y: textY, w: 4.5, color: "cbd5e1", fontSize: 18 });
            textY += 1.5;
          } else if (el.type === "image_block" && el.imageUrl) {
            // Put image on the right side
            try {
              slide.addImage({ x: 5.5, y: currentY, w: 4, h: 3, path: el.imageUrl });
            } catch(e) {
              // Ignore image load errors
            }
          }
        });
      } else {
        // Default sequential vertical stack for other layouts
        card.elements?.forEach(el => {
          if (el.type === "paragraph") {
            slide.addText(el.content || "", { x: DEFAULT_MARGIN, y: currentY, w: 9, color: "cbd5e1", fontSize: 16 });
            currentY += 0.8;
          } else if (el.type === "heading") {
            slide.addText(el.content || "", { x: DEFAULT_MARGIN, y: currentY, w: 9, color: "ffffff", fontSize: 22, bold: true });
            currentY += 0.8;
          } else if (el.type === "bullet_list" && el.items) {
            const bullets = el.items.map(item => ({ text: item, options: { bullet: true } }));
            slide.addText(bullets as any, { x: DEFAULT_MARGIN, y: currentY, w: 9, color: "cbd5e1", fontSize: 18 });
            currentY += (el.items.length * 0.4);
          } else if (el.type === "stat_metric") {
            slide.addText(`${el.metricValue}\n${el.metricLabel}`, { x: DEFAULT_MARGIN, y: currentY, w: 3, h: 1.5, color: "818cf8", fontSize: 24, bold: true, align: "center", fill: { color: "1e293b" } });
            currentY += 1.8;
          }
        });
      }
    }

    // 4. Generate the PPTX file as a buffer
    const buffer = await pres.write({ outputType: "nodebuffer" });

    // 5. Return as a downloadable response
    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${deck.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx"`,
      },
    });

  } catch (error: any) {
    console.error("PPTX Export Error:", error);
    return NextResponse.json({ error: "Failed to generate PPTX" }, { status: 500 });
  }
}
