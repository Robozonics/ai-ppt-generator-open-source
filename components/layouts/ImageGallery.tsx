import { Card } from "@/lib/schema";

export function ImageGallery({ card }: { card: Card }) {
  const images = card.elements?.filter((el) => el.type === "image_block") || [];
  
  return (
    <div className="w-full h-full flex flex-col pt-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-black text-white tracking-tight mb-4 drop-shadow-md">{card.title}</h2>
        {card.subtitle && (
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">{card.subtitle}</p>
        )}
      </div>

      {/* Masonry-style Grid */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 relative">
        {images.map((img, i) => (
          <div 
            key={img.id} 
            className={`relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-slate-900/50 ${
              images.length === 3 && i === 0 ? "col-span-2 md:col-span-1 md:row-span-2" : ""
            }`}
          >
            {img.imageUrl ? (
              <img 
                src={img.imageUrl} 
                alt={img.imageCaption || "Gallery image"}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-slate-500">Generating...</span>
              </div>
            )}
            
            {img.imageCaption && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <p className="text-white font-medium drop-shadow-sm">{img.imageCaption}</p>
              </div>
            )}
          </div>
        ))}
        {images.length === 0 && (
           <div className="absolute inset-0 flex items-center justify-center text-slate-500 border-2 border-dashed border-white/10 rounded-2xl">
             Add image_block elements to see the gallery.
           </div>
        )}
      </div>
    </div>
  );
}
