import { Card } from "@/lib/schema";
import { resolveWebImage } from "@/lib/imageResolver";

export function ImageGallery({ card }: { card: Card }) {
  const extractedImages = card.elements?.filter((el) => el.type === "image_block") || [];
  
  // If no image_block elements, generate 3 topic-relevant stock images
  const images = extractedImages.length > 0 ? extractedImages : [
    { id: "img-1", type: "image_block", imageUrl: resolveWebImage(`${card.title} overview`), imageCaption: "Strategic Implementation" },
    { id: "img-2", type: "image_block", imageUrl: resolveWebImage(`${card.title} architecture`), imageCaption: "System Scalability" },
    { id: "img-3", type: "image_block", imageUrl: resolveWebImage(`${card.title} analytics`), imageCaption: "Operational Performance" },
  ];
  
  return (
    <div className="w-full h-full flex flex-col justify-center">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2
          className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, rgb(var(--theme-text)), rgba(var(--theme-text), 0.85))`,
          }}
        >
          {card.title}
        </h2>
        {card.subtitle && (
          <p className="text-base md:text-lg max-w-3xl mx-auto font-light" style={{ color: `rgb(var(--theme-text-muted))` }}>
            {card.subtitle}
          </p>
        )}
        <div
          className="mt-3 mx-auto w-20 h-1 rounded-full"
          style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))` }}
        />
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5 relative max-h-[360px] md:max-h-[420px]">
        {images.map((img: any, i: number) => {
          const src = img.imageUrl || resolveWebImage(`${card.title} photo ${i}`);
          return (
            <div 
              key={img.id || i} 
              className="relative rounded-2xl overflow-hidden border group transition-all duration-500 shadow-xl"
              style={{
                borderColor: `rgba(var(--theme-primary), 0.25)`,
                backgroundColor: `rgba(var(--theme-surface), 0.5)`,
                boxShadow: `0 0 30px -8px rgba(var(--theme-primary), 0.2)`,
              }}
            >
              <img 
                src={src} 
                alt={img.imageCaption || "Gallery image"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://loremflickr.com/1280/720/architecture?lock=1';
                }}
              />
              
              {/* Image number badge */}
              <div
                className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center text-xs font-bold border shadow-md"
                style={{
                  backgroundColor: `rgba(0, 0, 0, 0.65)`,
                  borderColor: `rgba(255, 255, 255, 0.2)`,
                  color: `#ffffff`,
                }}
              >
                {i + 1}
              </div>

              {img.imageCaption && (
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <p className="font-semibold text-sm md:text-base text-white drop-shadow-md">
                    {img.imageCaption}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
