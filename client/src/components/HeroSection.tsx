import { useEffect, useState } from "react";
import { ArrowDown, Star, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/manus-storage/hero-1_d7949dd7.webp",
    title: "Savoir",
    subtitle: "Estética",
    suffix: "& Massagem",
    caption: "Tratamentos faciais com técnica e dedicação",
  },
  {
    image: "/manus-storage/hero-2_337b85de.jpg",
    title: "Savoir",
    subtitle: "Estética",
    suffix: "& Massagem",
    caption: "Massagens relaxantes e terapêuticas",
  },
  {
    image: "/manus-storage/hero-3_cc6522c6.webp",
    title: "Savoir",
    subtitle: "Estética",
    suffix: "& Massagem",
    caption: "Ambiente moderno e acolhedor em Itapira/SP",
  },
  {
    image: "/manus-storage/hero-4_1b8d755a.jpg",
    title: "Savoir",
    subtitle: "Estética",
    suffix: "& Massagem",
    caption: "Saúde e bem-estar com a Éricka Bertolazzo",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 400);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  useEffect(() => {
    const interval = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Slides de fundo */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current && !isTransitioning ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt={slide.caption}
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          {/* Overlay escuro dourado */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, rgba(10,8,5,0.78) 0%, rgba(18,14,6,0.65) 50%, rgba(10,8,5,0.80) 100%)",
            }}
          />
          {/* Brilho dourado sutil */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 65% 35%, oklch(0.72 0.14 75 / 0.18) 0%, transparent 60%)",
            }}
          />
        </div>
      ))}

      {/* Padrão diagonal sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Conteúdo */}
      <div className="container relative z-10 text-center text-white py-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="font-body text-xs tracking-widest uppercase text-white/90">
            8 Anos de Excelência em Estética
          </span>
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
        </div>

        {/* Título principal */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-tight mb-4 animate-fade-up">
          Savoir
          <br />
          <span
            className="font-semibold italic"
            style={{ color: "oklch(0.82 0.14 75)" }}
          >
            Estética
          </span>
          <span className="font-light text-white/80"> & Massagem</span>
        </h1>

        {/* Caption do slide atual */}
        <p
          key={current}
          className="font-body text-base md:text-lg text-white/70 max-w-xl mx-auto mb-2 font-light tracking-wide animate-fade-in"
        >
          {slides[current].caption}
        </p>

        {/* Tagline */}
        <p className="font-body text-sm text-white/50 max-w-lg mx-auto mb-3 italic">
          O segredo da beleza é se cuidar
        </p>

        {/* Localização & horário */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 mb-10 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center gap-1.5 text-white/65 text-sm">
            <MapPin size={14} />
            <span>Itapira, SP</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <div className="flex items-center gap-1.5 text-white/65 text-sm">
            <Clock size={14} />
            <span>Seg–Sex 9h–18h | Sáb 9h–13h</span>
          </div>
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <button
            onClick={() => scrollTo("#agendamento")}
            className="font-body font-semibold px-8 py-4 rounded-full text-base shadow-xl hover:shadow-2xl transition-all duration-200 min-w-[200px] hover:scale-105"
            style={{
              background: "oklch(0.72 0.14 75)",
              color: "oklch(0.10 0.005 90)",
            }}
          >
            Agendar Consulta
          </button>
          <button
            onClick={() => scrollTo("#servicos")}
            className="font-body bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium px-8 py-4 rounded-full text-base transition-all duration-200 min-w-[200px] hover:scale-105"
          >
            Ver Serviços
          </button>
        </div>

        {/* Stats */}
        <div
          className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-white/10 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          {[
            { value: "8+", label: "Anos de Experiência" },
            { value: "10+", label: "Tratamentos Disponíveis" },
            { value: "500+", label: "Clientes Satisfeitas" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-display text-3xl font-semibold"
                style={{ color: "oklch(0.82 0.14 75)" }}
              >
                {stat.value}
              </div>
              <div className="font-body text-xs text-white/55 tracking-wide mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles do carrossel */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        aria-label="Próximo slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicadores (dots) */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300"
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background:
                i === current
                  ? "oklch(0.82 0.14 75)"
                  : "rgba(255,255,255,0.35)",
            }}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo("#sobre")}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/70 transition-colors animate-bounce z-20"
        aria-label="Rolar para baixo"
      >
        <ArrowDown size={22} />
      </button>
    </section>
  );
}
