import { Card } from "@/lib/schema";
import { getImageUrl } from "@/lib/imageResolver";

export function TwoColumnSplit({ card }: { card?: Card }) {
  const title = card?.title || "Paradigm Shift in Reasoning";

  const items = card?.elements || [
    { id: "1", type: "heading", content: "From Pattern Matching to Planning" },
    { id: "2", type: "paragraph", content: "Next-generation models do not just predict the next token. They maintain an internal state, formulate multi-step plans, and self-correct during execution." },
    { id: "3", type: "bullet_list", items: ["Chain of Thought execution", "Tool use and API integration", "Memory and context window expansion"] }
  ];

  const imageUrl = card?.imageUrl || getImageUrl(card?.imagePrompt || "futuristic AI glowing neural network abstract");

  return (
    <div className="w-full h-full flex flex-col">
      {/* Title with gradient accent underline */}
      <div className="mb-10">
        <h2
          className="text-3xl font-bold tracking-tight mb-3 text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, rgb(var(--theme-text)), rgba(var(--theme-text), 0.75))`,
          }}
        >
          {title}
        </h2>
        <div
          className="w-20 h-1 rounded-full"
          style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))` }}
        />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-12 min-h-0">
        {/* Content Column */}
        <div className="flex flex-col justify-center space-y-6 overflow-y-auto">
          {items.map((el: any, idx: number) => (
            <div key={el.id || idx}>
              {el.type === "heading" && (
                <h3
                  className="text-xl font-semibold mb-2 text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))`,
                  }}
                >
                  {el.content}
                </h3>
              )}
              {el.type === "paragraph" && (
                <p style={{ color: `rgb(var(--theme-text-muted))` }} className="text-lg leading-relaxed">
                  {el.content}
                </p>
              )}
              {el.type === "bullet_list" && (
                <ul className="space-y-3 text-lg leading-relaxed" style={{ color: `rgb(var(--theme-text-muted))` }}>
                  {el.items?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="mt-2 w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundImage: `linear-gradient(to bottom right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))`,
                          boxShadow: `0 0 8px rgba(var(--theme-primary), 0.5)`,
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {el.type === "callout" && (
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: `rgba(var(--theme-primary), 0.1)`,
                    borderColor: `rgba(var(--theme-primary), 0.2)`,
                    border: `1px solid rgba(var(--theme-primary), 0.2)`,
                    color: `rgb(var(--theme-text))`,
                  }}
                >
                  {el.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Image Column */}
        <div
          className="relative rounded-2xl overflow-hidden border"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgba(var(--theme-primary), 0.15), rgba(var(--theme-secondary), 0.15))`,
            borderColor: `rgba(var(--theme-text), 0.1)`,
            boxShadow: `0 0 40px -10px rgba(var(--theme-primary), 0.15)`,
          }}
        >
          <img
            src={imageUrl}
            alt="Slide visual"
            className="rounded-2xl object-cover w-full h-full"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          {/* Fallback gradient if image doesn't load */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: `linear-gradient(to bottom right, rgba(var(--theme-primary), 0.2), rgba(var(--theme-secondary), 0.2), rgba(var(--theme-accent), 0.2))`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
