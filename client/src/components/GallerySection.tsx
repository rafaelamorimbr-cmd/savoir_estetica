import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Images, X } from "lucide-react";

const categories = [
  { value: "all", label: "Todos" },
  { value: "facial", label: "Facial" },
  { value: "corporal", label: "Corporal" },
];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightbox, setLightbox] = useState<{ before?: string; after: string; desc?: string } | null>(null);

  const { data: items = [], isLoading } = trpc.gallery.list.useQuery(
    activeCategory !== "all" ? { category: activeCategory } : undefined
  );

  // Placeholder items when gallery is empty
  const clinicPhoto = "/manus-storage/savoir-clinic_2ecd8d09.jpg";
  const placeholders: Array<{
    id: number;
    afterImageUrl: string;
    beforeImageUrl: string | null;
    description: string | null;
    category: string;
  }> = [
    { id: -1, afterImageUrl: clinicPhoto, beforeImageUrl: null, description: "Consultório Savoir Estética — equipamentos modernos", category: "outros" },
  ];

  const displayItems: Array<{
    id: number;
    afterImageUrl: string;
    beforeImageUrl?: string | null;
    description?: string | null;
    category?: string;
  }> = items.length > 0 ? items : placeholders;

  return (
    <section id="galeria" className="section-padding bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-primary font-semibold mb-3">Galeria</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Resultados que
            <span className="italic text-primary"> encantam</span>
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-xl mx-auto">
            Veja as transformações reais de nossas clientes. Cada resultado é fruto de técnica, dedicação e cuidado personalizado.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-foreground/70 border border-border hover:border-primary hover:text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-white animate-pulse" />
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-16">
            <Images size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">Nenhuma imagem nesta categoria ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setLightbox({ before: item.beforeImageUrl ?? undefined, after: item.afterImageUrl, desc: item.description ?? undefined })}
                className="group relative rounded-2xl overflow-hidden aspect-square bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {item.beforeImageUrl ? (
                  <div className="flex h-full">
                    <div className="relative w-1/2 before-after-overlay overflow-hidden">
                      <img src={item.beforeImageUrl} alt="Antes" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="relative w-1/2 after-overlay overflow-hidden">
                      <img src={item.afterImageUrl} alt="Depois" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  </div>
                ) : (
                  <div className="relative h-full">
                    <img src={item.afterImageUrl} alt={item.description ?? "Resultado"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                )}
                {item.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-body text-white text-xs font-medium">{item.description}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/savoir_estetica"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Ver mais no Instagram
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2" onClick={() => setLightbox(null)}>
            <X size={28} />
          </button>
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            {lightbox.before ? (
              <div className="flex gap-2 rounded-2xl overflow-hidden">
                <div className="relative flex-1 before-after-overlay">
                  <img src={lightbox.before} alt="Antes" className="w-full object-cover max-h-[80vh]" />
                </div>
                <div className="relative flex-1 after-overlay">
                  <img src={lightbox.after} alt="Depois" className="w-full object-cover max-h-[80vh]" />
                </div>
              </div>
            ) : (
              <img src={lightbox.after} alt={lightbox.desc ?? "Resultado"} className="w-full rounded-2xl object-contain max-h-[80vh]" />
            )}
            {lightbox.desc && (
              <p className="text-white/80 text-center mt-4 font-body text-sm">{lightbox.desc}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
