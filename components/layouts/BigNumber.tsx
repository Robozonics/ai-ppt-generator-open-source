import { Card } from "@/lib/schema";

export function BigNumber({ card }: { card: Card }) {
  const statEl = card.elements?.find((el) => el.type === "stat_metric");
  
  return (
    <div className="w-full h-full flex relative z-10 items-center">
      
      {/* Left side text */}
      <div className="flex-1 pr-12 space-y-6">
        <h2
          className="text-4xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-md text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, rgb(var(--theme-text)), rgba(var(--theme-text), 0.75))`,
          }}
        >
          {card.title}
        </h2>
        {card.subtitle && (
          <p className="text-xl leading-relaxed max-w-xl text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text-muted)), rgba(var(--theme-text-muted), 0.7))` }}>
            {card.subtitle}
          </p>
        )}
        
        {/* Supporting paragraphs with colored accent border */}
        <div className="pt-6 space-y-4">
          {card.elements?.filter(el => el.type === "paragraph").map((p: any, idx: number) => (
            <p
              key={p.id || idx}
              className="text-lg leading-relaxed pl-4 text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, rgb(var(--theme-text-muted)), rgba(var(--theme-text-muted), 0.7))`,
                borderLeft: `2px solid rgba(var(--theme-primary), 0.5)`,
              }}
            >
              {p.content}
            </p>
          ))}
          {card.elements?.filter(el => el.type === "bullet_list").map((el: any, idx: number) => (
            <ul key={el.id || idx} className="space-y-2 text-lg text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text-muted)), rgba(var(--theme-text-muted), 0.7))` }}>
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
          ))}
        </div>
      </div>

      {/* Right side MASSIVE number */}
      <div
        className="flex-1 flex flex-col items-center justify-center backdrop-blur-xl rounded-3xl p-16 relative overflow-hidden group border"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(var(--theme-primary), 0.1), rgba(var(--theme-secondary), 0.05), rgba(var(--theme-accent), 0.1))`,
          borderColor: `rgba(var(--theme-primary), 0.2)`,
          boxShadow: `0 0 60px -15px rgba(var(--theme-primary), 0.2)`,
        }}
      >
        {/* Animated glow pulse */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-glow"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgba(var(--theme-primary), 0.1), rgba(var(--theme-secondary), 0.1), rgba(var(--theme-accent), 0.1))`,
          }}
        />
        
        {statEl ? (
          <>
            <span
              className="text-[110px] font-black drop-shadow-2xl leading-none tracking-tighter hover:scale-105 transition-transform duration-500 z-10 text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(var(--theme-primary), 0.9), rgb(var(--theme-secondary)))`,
              }}
            >
              {statEl.metricValue}
            </span>
            <span
              className="mt-6 text-xl font-bold uppercase tracking-widest text-center z-10 text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))`,
              }}
            >
              {statEl.metricLabel}
            </span>
          </>
        ) : (
          <span style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text-muted)), rgba(var(--theme-text-muted), 0.7))` }} className="italic text-transparent bg-clip-text">No stat_metric found</span>
        )}
      </div>

    </div>
  );
}
