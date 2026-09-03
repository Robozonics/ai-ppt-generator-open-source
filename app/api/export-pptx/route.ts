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
        bold: true,
        wrap: true,
        autoFit: true,
        valign: "top"
      });

      // Add Card Subtitle
      if (card.subtitle) {
        slide.addText(card.subtitle, {
          x: DEFAULT_MARGIN, y: TITLE_Y + 0.8, w: 9, h: 0.5,
          color: "94a3b8", // slate-400
          fontSize: 18,
          italic: true,
          wrap: true,
          autoFit: true
        });
      }

      // 3. Layout Mapping Algorithm
      // This is a basic approximate mapping. Complex layouts require sophisticated coordinates.
      
      let currentY = CONTENT_Y_START;

      if (card.layout === "title_hero") {
        // Centered layout
        currentY += 0.8;
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
          if (el.type === "heading") {
            slide.addText(el.content || "", { 
              x: DEFAULT_MARGIN, y: textY, w: 4.8, h: 0.6,
              color: "ffffff", fontSize: 22, bold: true, wrap: true, valign: "top"
            });
            textY += 0.7;
          } else if (el.type === "paragraph") {
            slide.addText(el.content || "", { 
              x: DEFAULT_MARGIN, y: textY, w: 4.8, h: 1.2,
              color: "cbd5e1", fontSize: 16, wrap: true, valign: "top"
            });
            textY += 1.3;
          } else if (el.type === "bullet_list" && el.items) {
            const bullets = el.items.map(item => ({ text: item, options: { bullet: true } }));
            slide.addText(bullets as any, { x: DEFAULT_MARGIN, y: textY, w: 4.8, h: 2, color: "cbd5e1", fontSize: 16, wrap: true, valign: "top" });
            textY += (el.items.length * 0.45);
          } else if (el.type === "callout") {
            slide.addText(el.content || "", {
              x: DEFAULT_MARGIN, y: textY, w: 4.8, h: 1.0,
              color: "e2e8f0", fontSize: 14, italic: true,
              fill: { color: "1e293b" }, line: { color: "38bdf8", width: 1 }
            });
            textY += 1.2;
          }
        });

        // Add image on right side if available
        const imgUrl = card.imageUrl || card.elements?.find(e => e.type === "image_block")?.imageUrl;
        if (imgUrl) {
          try {
            slide.addImage({ x: 5.4, y: 2.0, w: 4.2, h: 4.2, path: imgUrl });
          } catch(e) {
            // Ignore image load errors
          }
        }
      } else if (card.layout === "three_column_grid") {
        // 3 side-by-side cards
        const items = card.elements?.slice(0, 3) || [];
        items.forEach((el: any, i: number) => {
          const colX = 0.5 + i * 3.1;
          // Card background shape
          slide.addShape(pres.ShapeType.roundRect, {
            x: colX, y: 2.2, w: 2.9, h: 4.2,
            fill: { color: "131c31" }, line: { color: "2563eb", width: 1 }
          });
          // Card Title
          slide.addText(el.title || el.content?.slice(0, 25) || `Pillar ${i + 1}`, {
            x: colX + 0.2, y: 2.4, w: 2.5, h: 0.6,
            color: "38bdf8", fontSize: 18, bold: true, align: "left"
          });
          // Card Description
          slide.addText(el.content || "", {
            x: colX + 0.2, y: 3.1, w: 2.5, h: 3.0,
            color: "cbd5e1", fontSize: 14, wrap: true, valign: "top"
          });
        });
      } else if (card.layout === "metric_showcase") {
        // 3 horizontal metric stat boxes
        const metrics = card.elements?.filter(e => e.type === "stat_metric").slice(0, 3) || [];
        metrics.forEach((el: any, i: number) => {
          const colX = 0.5 + i * 3.1;
          slide.addShape(pres.ShapeType.roundRect, {
            x: colX, y: 2.5, w: 2.9, h: 3.5,
            fill: { color: "131c31" }, line: { color: "38bdf8", width: 1 }
          });
          slide.addText(el.metricValue || "100%", {
            x: colX + 0.1, y: 2.8, w: 2.7, h: 1.4,
            color: "38bdf8", fontSize: 44, bold: true, align: "center"
          });
          slide.addText(el.metricLabel || "Key Metric", {
            x: colX + 0.2, y: 4.3, w: 2.5, h: 1.4,
            color: "ffffff", fontSize: 15, bold: true, align: "center", wrap: true
          });
        });
      } else if (card.layout === "big_number") {
        // Left text, right massive stat
        let textY = 2.4;
        card.elements?.forEach(el => {
          if (el.type === "paragraph") {
            slide.addText(el.content || "", { x: DEFAULT_MARGIN, y: textY, w: 5.0, h: 1.2, color: "cbd5e1", fontSize: 16, wrap: true });
            textY += 1.3;
          } else if (el.type === "bullet_list" && el.items) {
            const bullets = el.items.map(item => ({ text: item, options: { bullet: true } }));
            slide.addText(bullets as any, { x: DEFAULT_MARGIN, y: textY, w: 5.0, h: 2, color: "cbd5e1", fontSize: 16, wrap: true });
            textY += (el.items.length * 0.45);
          }
        });

        const statEl = card.elements?.find(e => e.type === "stat_metric");
        slide.addShape(pres.ShapeType.roundRect, {
          x: 5.6, y: 2.2, w: 3.9, h: 4.2,
          fill: { color: "131c31" }, line: { color: "38bdf8", width: 1 }
        });
        slide.addText(statEl?.metricValue || "99.9%", {
          x: 5.7, y: 2.6, w: 3.7, h: 2.0,
          color: "38bdf8", fontSize: 64, bold: true, align: "center"
        });
        slide.addText(statEl?.metricLabel || card.subtitle || "Primary Metric", {
          x: 5.8, y: 4.8, w: 3.5, h: 1.2,
          color: "ffffff", fontSize: 16, bold: true, align: "center", wrap: true
        });
      } else if (card.layout === "timeline_flow") {
        // 4 milestone boxes
        const steps = card.elements?.slice(0, 4) || [];
        steps.forEach((el: any, i: number) => {
          const colX = 0.5 + i * 2.3;
          slide.addShape(pres.ShapeType.roundRect, {
            x: colX, y: 2.6, w: 2.1, h: 3.8,
            fill: { color: "131c31" }, line: { color: "38bdf8", width: 1 }
          });
          slide.addText(el.title || `Phase ${i + 1}`, {
            x: colX + 0.1, y: 2.8, w: 1.9, h: 0.8,
            color: "38bdf8", fontSize: 15, bold: true, align: "center", wrap: true
          });
          slide.addText(el.content || "", {
            x: colX + 0.1, y: 3.7, w: 1.9, h: 2.4,
            color: "cbd5e1", fontSize: 12, wrap: true, valign: "top"
          });
        });
      } else if (card.layout === "quote_focus") {
        const quoteEl = card.elements?.find(e => e.type === "callout" || e.type === "paragraph");
        slide.addText(`"${quoteEl?.content || card.subtitle}"`, {
          x: 1.0, y: 2.6, w: 8.0, h: 2.5,
          color: "ffffff", fontSize: 26, italic: true, align: "center", wrap: true
        });
        if (card.subtitle) {
          slide.addText(`— ${card.subtitle}`, {
            x: 2.0, y: 5.2, w: 6.0, h: 0.6,
            color: "38bdf8", fontSize: 18, bold: true, align: "center"
          });
        }
      } else if (card.layout === "data_chart") {
        // Left insights, right native PowerPoint chart
        let textY = 2.2;
        card.elements?.forEach(el => {
          if (el.type === "paragraph" || el.type === "callout") {
            slide.addText(el.content || "", { x: DEFAULT_MARGIN, y: textY, w: 4.2, h: 1.2, color: "cbd5e1", fontSize: 15, wrap: true, valign: "top" });
            textY += 1.3;
          }
        });

        // Extract labels and values
        const stats = card.elements?.filter(e => e.type === "stat_metric") || [];
        const labels = stats.map(s => s.metricLabel || "Metric");
        const values = stats.map(s => parseFloat((s.metricValue || "50").replace(/[^0-9.]/g, "")) || 50);

        const chartData = [
          {
            name: "Performance",
            labels: labels.length > 0 ? labels : ["Q1", "Q2", "Q3", "Q4"],
            values: values.length > 0 ? values : [25, 48, 72, 95]
          }
        ];

        try {
          slide.addChart(pres.ChartType.bar, chartData, {
            x: 4.8, y: 2.0, w: 4.8, h: 4.2,
            chartColors: ["38bdf8"],
            plotArea: { fill: { color: "131c31" } }
          });
        } catch(e) {
          // Fallback if chart fails
        }
      } else {
        // Default sequential vertical stack for any other layout
        card.elements?.forEach(el => {
          if (el.type === "paragraph") {
            slide.addText(el.content || "", { x: DEFAULT_MARGIN, y: currentY, w: 9, h: 1.2, color: "cbd5e1", fontSize: 16, wrap: true, valign: "top" });
            currentY += 1.1;
          } else if (el.type === "heading") {
            slide.addText(el.content || "", { x: DEFAULT_MARGIN, y: currentY, w: 9, h: 0.6, color: "ffffff", fontSize: 22, bold: true, wrap: true, valign: "top" });
            currentY += 0.8;
          } else if (el.type === "bullet_list" && el.items) {
            const bullets = el.items.map(item => ({ text: item, options: { bullet: true } }));
            slide.addText(bullets as any, { x: DEFAULT_MARGIN, y: currentY, w: 9, h: 2, color: "cbd5e1", fontSize: 16, wrap: true, valign: "top" });
            currentY += (el.items.length * 0.45);
          } else if (el.type === "stat_metric") {
            slide.addText(`${el.metricValue}\n${el.metricLabel}`, { x: DEFAULT_MARGIN, y: currentY, w: 3, h: 1.5, color: "38bdf8", fontSize: 24, bold: true, align: "center", fill: { color: "131c31" } });
            currentY += 1.8;
          }
        });
      }
    }

    // 4. Generate the PPTX file as an ArrayBuffer
    // ArrayBuffer is much safer for Next.js Edge/Serverless responses than nodebuffer
    const buffer = await pres.write({ outputType: "arraybuffer" }) as ArrayBuffer;

    // 5. Return as a downloadable response
    return new NextResponse(buffer, {
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
