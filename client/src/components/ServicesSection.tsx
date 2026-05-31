import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Clock, ChevronRight, Sparkles, Zap } from "lucide-react";

const categoryLabels: Record<string, string> = {
  facial: "Tratamentos Faciais",
  corporal: "Tratamentos Corporais",
};

const categoryIcons: Record<string, typeof Sparkles> = {
  facial: Sparkles,
  corporal: Zap,
};

const categoryDescriptions: Record<string, string> = {
  facial: "Rejuvenescimento, revitalização e saúde da pele com técnicas avançadas e personalizadas.",
  corporal: "Modelação, relaxamento e bem-estar para o seu corpo com tecnologia e cuidado especializado.",
};

export default function ServicesSection() {
  const { data: services = [], isLoading } = trpc.services.list.useQuery();
  const [activeCategory, setActiveCategory] = useState<"all" | "facial" | "corporal">("all");

  const filtered = activeCategory === "all"
    ? services
    : services.filter((s) => s.category === activeCategory);

  const facialServices = services.filter((s) => s.category === "facial");
  const corporalServices = services.filter((s) => s.category === "corporal");

  const scrollToBooking = (serviceName: string) => {
    const el = document.querySelector("#agendamento");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="servicos" className="section-padding bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-primary font-semibold mb-3">
            Nossos Serviços
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Tratamentos que
            <span className="italic text-primary"> transformam</span>
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-xl mx-auto">
            Cada procedimento é realizado com técnica apurada, equipamentos modernos e total dedicação ao seu bem-estar.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {(["all", "facial", "corporal"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-foreground/70 border border-border hover:border-primary hover:text-primary"
              }`}
            >
              {cat === "all" ? "Todos" : categoryLabels[cat]}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-white animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Category blocks when showing all */}
            {activeCategory === "all" ? (
              <div className="space-y-14">
                {(["facial", "corporal"] as const).map((cat) => {
                  const CatIcon = categoryIcons[cat];
                  const catServices = cat === "facial" ? facialServices : corporalServices;
                  return (
                    <div key={cat}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <CatIcon size={18} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display text-2xl font-semibold text-foreground">{categoryLabels[cat]}</h3>
                          <p className="font-body text-sm text-muted-foreground">{categoryDescriptions[cat]}</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {catServices.map((service) => (
                          <ServiceCard key={service.id} service={service} onBook={scrollToBooking} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((service) => (
                  <ServiceCard key={service.id} service={service} onBook={scrollToBooking} />
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => document.querySelector("#agendamento")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-xl"
          >
            Agendar Meu Tratamento
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, onBook }: { service: any; onBook: (name: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  const categoryColor = service.category === "facial"
    ? "bg-amber-50 text-amber-800 border-amber-200"
    : "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="bg-white rounded-2xl border border-border p-6 card-hover shadow-sm flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryColor}`}>
          {service.category === "facial" ? "Facial" : "Corporal"}
        </span>
        {service.duration && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>{service.duration} min</span>
          </div>
        )}
      </div>

      <h3 className="font-display text-xl font-semibold text-foreground mb-2">{service.name}</h3>

      {service.description && (
        <p className={`font-body text-sm text-muted-foreground leading-relaxed mb-4 flex-1 ${!expanded ? "line-clamp-3" : ""}`}>
          {service.description}
        </p>
      )}

      {service.description && service.description.length > 120 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary font-medium mb-3 text-left hover:underline"
        >
          {expanded ? "Ver menos" : "Ver mais"}
        </button>
      )}

      <button
        onClick={() => onBook(service.name)}
        className="mt-auto w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-200"
      >
        Agendar este serviço
      </button>
    </div>
  );
}
