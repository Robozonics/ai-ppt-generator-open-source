import { Card } from "@/lib/schema";
import { resolveWebImage } from "@/lib/imageResolver";

export function TwoColumnSplit({ card }: { card?: Card }) {
  const title = card?.title || "Paradigm Shift in Reasoning";

  const items = card?.elements || [
    { id: "1", type: "heading", content: "From Pattern Matching to Planning" },
    { id: "2", type: "paragraph", content: "Next-generation models do not just predict the next token. They maintain an internal state, formulate multi-step plans, and self-correct during execution." },
    { id: "3", type: "bullet_list", items: ["Chain of Thought execution", "Tool use and API integration", "Memory and context window expansion"] }
  ];

  const imageUrl = card?.imageUrl || resolveWebImage(card?.imagePrompt || card?.title || "technology business innovation");

  return (
    <div className="w-full h-full flex flex-col justify-center">
      {/* Title with gradient accent underline */}
      <div className="mb-8">
        <h2
          className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, rgb(var(--theme-text)), rgba(var(--theme-text), 0.85))`,
          }}
        >
          {title}
        </h2>
        <div
          className="w-20 h-1 rounded-full"
          style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))` }}
        />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 min-h-0 items-center">
        {/* Content Column */}
        <div className="flex flex-col justify-center space-y-6 overflow-y-auto pr-2">
          {items.map((el: any, idx: number) => (
            <div key={el.id || idx}>
              {el.type === "heading" && (
                <h3
                  className="text-xl md:text-2xl font-bold mb-2 text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))`,
                  }}
                >
                  {el.content}
                </h3>
              )}
              {el.type === "paragraph" && (
                <p className="text-base md:text-lg leading-relaxed text-slate-200 font-light" style={{ color: `rgb(var(--theme-text))` }}>
                  {el.content}
                </p>
              )}
              {el.type === "bullet_list" && (
                <ul className="space-y-3 text-base md:text-lg leading-relaxed text-slate-300">
                  {el.items?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="mt-2 w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundImage: `linear-gradient(to bottom right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))`,
                          boxShadow: `0 0 8px rgba(var(--theme-primary), 0.6)`,
                        }}
                      />
                      <span style={{ color: `rgb(var(--theme-text-muted))` }}>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {el.type === "callout" && (
                <div
                  className="p-5 rounded-xl border backdrop-blur-sm shadow-inner"
                  style={{
                    backgroundColor: `rgba(var(--theme-primary), 0.08)`,
                    borderColor: `rgba(var(--theme-primary), 0.25)`,
                    color: `rgb(var(--theme-text))`,
                  }}
                >
                  <p className="font-medium leading-relaxed">{el.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Image Column */}
        <div
          className="relative rounded-2xl overflow-hidden border h-full max-h-[380px] md:max-h-[440px] shadow-2xl group"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgba(var(--theme-primary), 0.15), rgba(var(--theme-secondary), 0.15))`,
            borderColor: `rgba(var(--theme-primary), 0.25)`,
            boxShadow: `0 0 40px -10px rgba(var(--theme-primary), 0.2)`,
          }}
        >
          <img
            src={imageUrl}
            alt="Slide visual"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              // Graceful fallback to Unsplash deep tech visual instead of hiding
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1280&h=720&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
