import { ArrowDown, Star, MapPin, Clock } from "lucide-react";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-savoir-hero"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.14 75), transparent)" }} />
        <div className="absolute bottom-1/3 left-1/6 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.16 75), transparent)" }} />
        {/* Decorative lines */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "30px 30px"
          }} />
      </div>

      <div className="container relative z-10 text-center text-white py-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
          <Star size={14} className="text-yellow-300 fill-yellow-300" />
          <span className="font-body text-xs tracking-widest uppercase text-white/90">
            8 Anos de Excelência em Estética
          </span>
          <Star size={14} className="text-yellow-300 fill-yellow-300" />
        </div>

        {/* Main heading */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-tight mb-4 animate-fade-up">
          Savoir
          <br />
          <span className="font-semibold italic" style={{ color: "oklch(0.82 0.14 75)" }}>
            Estética
          </span>
          <span className="font-light text-white/80"> & Massagem</span>
        </h1>

        {/* Tagline */}
        <p className="font-body text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-3 font-light tracking-wide animate-fade-up" style={{ animationDelay: "0.1s" }}>
          O segredo da beleza é se cuidar
        </p>

        {/* Location & Info */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-1.5 text-white/70 text-sm">
            <MapPin size={14} />
            <span>Itapira, SP</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <div className="flex items-center gap-1.5 text-white/70 text-sm">
            <Clock size={14} />
            <span>Seg–Sex 9h–18h | Sáb 9h–13h</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <button
            onClick={() => scrollTo("#agendamento")}
            className="font-semibold px-8 py-4 rounded-full text-base shadow-xl hover:shadow-2xl transition-all duration-200 min-w-[200px]"
            style={{ background: "oklch(0.72 0.14 75)", color: "oklch(0.10 0.005 90)" }}
          >
            Agendar Consulta
          </button>
          <button
            onClick={() => scrollTo("#servicos")}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium px-8 py-4 rounded-full text-base transition-all duration-200 min-w-[200px]"
          >
            Ver Serviços
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-white/10 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          {[
            { value: "8+", label: "Anos de Experiência" },
            { value: "10+", label: "Tratamentos Disponíveis" },
            { value: "500+", label: "Clientes Satisfeitas" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-semibold text-white">{stat.value}</div>
              <div className="font-body text-xs text-white/60 tracking-wide mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo("#sobre")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/80 transition-colors animate-bounce"
        aria-label="Rolar para baixo"
      >
        <ArrowDown size={24} />
      </button>
    </section>
  );
}
