import { Card } from "@/lib/schema";
import { getImageUrl } from "@/lib/imageResolver";

export function TwoColumnSplit({ card }: { card?: Card }) {
  const title = card?.title || "Paradigm Shift in Reasoning";

  const items = card?.elements || [
    { id: "1", type: "heading", content: "From Pattern Matching to Planning" },
    { id: "2", type: "paragraph", content: "Next-generation models do not just predict the next token. They maintain an internal state, formulate multi-step plans, and self-correct during execution." },
    { id: "3", type: "bullet_list", items: ["Chain of Thought execution", "Tool use and API integration", "Memory and context window expansion"] }
  ];

  const imageUrl = getImageUrl(card?.imagePrompt || "futuristic AI glowing neural network abstract");

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-10">{title}</h2>

      <div className="flex-1 grid grid-cols-2 gap-12 min-h-0">
        {/* Content Column */}
        <div className="flex flex-col justify-center space-y-6 overflow-y-auto">
          {items.map((el: any) => (
            <div key={el.id}>
              {el.type === "heading" && (
                <h3 className="text-xl font-semibold text-white mb-2">{el.content}</h3>
              )}
              {el.type === "paragraph" && (
                <p className="text-xl leading-relaxed text-slate-300">{el.content}</p>
              )}
              {el.type === "bullet_list" && (
                <ul className="list-disc pl-6 space-y-3 text-xl leading-relaxed text-slate-300">
                  {el.items?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Image Column */}
        <div className="relative rounded-xl overflow-hidden bg-black/40">
          <img
            src={imageUrl}
            alt="Slide image"
            className="rounded-xl object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
