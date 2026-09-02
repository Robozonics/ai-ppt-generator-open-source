import { Card } from "@/lib/schema";

export function ImageGallery({ card }: { card: Card }) {
  const images = card.elements?.filter((el) => el.type === "image_block") || [];
  
  return (
    <div className="w-full h-full flex flex-col pt-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2
          className="text-4xl font-black tracking-tight mb-3 drop-shadow-md text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, rgb(var(--theme-text)), rgba(var(--theme-primary), 0.8), rgba(var(--theme-secondary), 0.7))`,
          }}
        >
          {card.title}
        </h2>
        {card.subtitle && (
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: `rgb(var(--theme-text-muted))` }}>
            {card.subtitle}
          </p>
        )}
        <div
          className="mt-4 mx-auto w-20 h-1 rounded-full"
          style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))` }}
        />
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-5 relative">
        {images.map((img, i) => (
          <div 
            key={img.id} 
            className={`relative rounded-2xl overflow-hidden border group transition-all duration-500 ${
              images.length === 3 && i === 0 ? "col-span-2 md:col-span-1 md:row-span-2" : ""
            }`}
            style={{
              borderColor: `rgba(var(--theme-text), 0.1)`,
              backgroundColor: `rgba(var(--theme-surface), 0.5)`,
              boxShadow: `0 0 30px -8px rgba(var(--theme-primary), 0.15)`,
            }}
          >
            {img.imageUrl ? (
              <img 
                src={img.imageUrl} 
                alt={img.imageCaption || "Gallery image"}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center animate-gradient-shift"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, rgba(var(--theme-primary), 0.2), rgba(var(--theme-secondary), 0.2), rgba(var(--theme-accent), 0.2))`,
                  backgroundSize: '200% 200%',
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full animate-pulse" style={{ backgroundColor: `rgba(var(--theme-text), 0.1)` }} />
                  <span className="text-sm" style={{ color: `rgb(var(--theme-text-muted))` }}>Loading...</span>
                </div>
              </div>
            )}
            
            {/* Image number badge */}
            <div
              className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center text-xs font-bold border"
              style={{
                backgroundColor: `rgba(var(--theme-bg), 0.5)`,
                borderColor: `rgba(var(--theme-text), 0.2)`,
                color: `rgb(var(--theme-text))`,
              }}
            >
              {i + 1}
            </div>

            {img.imageCaption && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <p className="font-medium drop-shadow-sm" style={{ color: `rgb(var(--theme-text))` }}>{img.imageCaption}</p>
              </div>
            )}
          </div>
        ))}
        {images.length === 0 && (
           <div
             className="col-span-full flex items-center justify-center border-2 border-dashed rounded-2xl min-h-[200px]"
             style={{ borderColor: `rgba(var(--theme-text), 0.1)`, color: `rgb(var(--theme-text-muted))` }}
           >
             Add image_block elements to see the gallery.
           </div>
        )}
      </div>
    </div>
  );
}
