import { Card } from "@/lib/schema";

export function BigNumber({ card }: { card: Card }) {
  const statEl = card.elements?.find((el) => el.type === "stat_metric");
  
  return (
    <div className="w-full h-full flex relative z-10 items-center">
      
      {/* Left side text */}
      <div className="flex-1 pr-12 space-y-6">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
          {card.title}
        </h2>
        {card.subtitle && (
          <p className="text-2xl text-slate-300 leading-relaxed max-w-xl">
            {card.subtitle}
          </p>
        )}
        
        {/* Supporting paragraphs */}
        <div className="pt-8 space-y-4">
          {card.elements?.filter(el => el.type === "paragraph").map(p => (
            <p key={p.id} className="text-lg text-slate-400 leading-relaxed border-l-2 border-indigo-500/50 pl-4">
              {p.content}
            </p>
          ))}
        </div>
      </div>

      {/* Right side MASSIVE number */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {statEl ? (
          <>
            <span className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-2xl leading-none tracking-tighter hover:scale-105 transition-transform duration-500">
              {statEl.metricValue}
            </span>
            <span className="mt-8 text-2xl font-bold text-indigo-300 uppercase tracking-widest text-center">
              {statEl.metricLabel}
            </span>
          </>
        ) : (
          <span className="text-slate-500 italic">No stat_metric found</span>
        )}
      </div>

    </div>
  );
}
