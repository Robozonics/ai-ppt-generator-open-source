import { Card } from "@/lib/schema";

export function BigNumber({ card }: { card: Card }) {
  const statEl = card.elements?.find((el) => el.type === "stat_metric");
  
  // Smart fallback for metric if not explicitly marked as stat_metric
  let metricVal = statEl?.metricValue;
  let metricLabel = statEl?.metricLabel;

  if (!metricVal) {
    // Try to extract a percentage or number from subtitle or title
    const numMatch = (card.subtitle || card.title || "").match(/(\d+[\d,.]*[%xXkKMmBb+]?)/);
    if (numMatch) {
      metricVal = numMatch[1];
      metricLabel = card.subtitle?.replace(numMatch[1], "").trim() || "Observed Metric";
    } else {
      metricVal = "99.9%";
      metricLabel = "Target Performance SLA";
    }
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row relative z-10 items-center justify-between gap-8 md:gap-12">
      {/* Left side text */}
      <div className="flex-1 space-y-6">
        <div>
          <h2
            className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4 text-transparent bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(to right, rgb(var(--theme-text)), rgba(var(--theme-text), 0.85))`,
            }}
          >
            {card.title}
          </h2>
          <div
            className="w-20 h-1 rounded-full"
            style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))` }}
          />
        </div>

        {card.subtitle && (
          <p className="text-lg md:text-xl leading-relaxed max-w-xl font-light" style={{ color: `rgb(var(--theme-text-muted))` }}>
            {card.subtitle}
          </p>
        )}
        
        {/* Supporting paragraphs with colored accent border */}
        <div className="pt-4 space-y-4">
          {card.elements?.filter(el => el.type === "paragraph").map((p: any, idx: number) => (
            <p
              key={p.id || idx}
              className="text-base md:text-lg leading-relaxed pl-4 font-light"
              style={{
                color: `rgb(var(--theme-text))`,
                borderLeft: `3px solid rgb(var(--theme-primary))`,
              }}
            >
              {p.content}
            </p>
          ))}
          {card.elements?.filter(el => el.type === "bullet_list").map((el: any, idx: number) => (
            <ul key={el.id || idx} className="space-y-2.5 text-base md:text-lg">
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
          ))}
        </div>
      </div>

      {/* Right side MASSIVE number */}
      <div
        className="flex-1 w-full max-w-md flex flex-col items-center justify-center backdrop-blur-2xl rounded-3xl p-10 md:p-14 relative overflow-hidden group border shadow-2xl"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(var(--theme-primary), 0.12), rgba(var(--theme-surface), 0.4), rgba(var(--theme-accent), 0.08))`,
          borderColor: `rgba(var(--theme-primary), 0.3)`,
          boxShadow: `0 0 70px -15px rgba(var(--theme-primary), 0.25)`,
        }}
      >
        <span
          className="text-7xl md:text-9xl font-black drop-shadow-2xl leading-none tracking-tighter hover:scale-105 transition-transform duration-500 z-10 text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))`,
            filter: `drop-shadow(0 0 35px rgba(var(--theme-primary), 0.4))`,
          }}
        >
          {metricVal}
        </span>
        <span
          className="mt-6 text-base md:text-lg font-bold uppercase tracking-widest text-center z-10 leading-snug"
          style={{ color: `rgb(var(--theme-text))` }}
        >
          {metricLabel}
        </span>
      </div>
    </div>
  );
}
