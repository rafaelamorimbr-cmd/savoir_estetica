import { Award, Heart, Sparkles, Shield } from "lucide-react";

const diferenciais = [
  {
    icon: Award,
    title: "8 Anos de Experiência",
    desc: "Trajetória sólida com centenas de clientes satisfeitas e resultados comprovados.",
  },
  {
    icon: Sparkles,
    title: "Equipamentos Modernos",
    desc: "Tecnologia de ponta para tratamentos seguros, eficazes e com resultados superiores.",
  },
  {
    icon: Heart,
    title: "Atendimento Personalizado",
    desc: "Protocolos individualizados para atender às necessidades únicas de cada cliente.",
  },
  {
    icon: Shield,
    title: "Biossegurança Total",
    desc: "Rigorosos protocolos de higiene e esterilização para sua saúde e segurança.",
  },
];

export default function AboutSection() {
  return (
    <section id="sobre" className="section-padding" style={{ background: "oklch(0.97 0.004 85)" }}>
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            {/* Label dourado */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10" style={{ background: "oklch(0.76 0.17 75)" }} />
              <p className="font-body text-xs tracking-[0.3em] uppercase font-semibold" style={{ color: "oklch(0.68 0.18 75)" }}>
                Sobre a Clínica
              </p>
            </div>

            <h2 className="font-display text-5xl md:text-6xl font-semibold text-foreground mb-6 leading-tight">
              Sua beleza em mãos
              <br />
              <span className="italic" style={{ color: "oklch(0.68 0.18 75)" }}>experientes</span>
            </h2>

            <p className="font-body text-base text-muted-foreground leading-relaxed mb-5">
              A <strong className="text-foreground">Savoir Estética & Massagem</strong> nasceu da paixão de{" "}
              <strong className="text-foreground">Éricka Bertolazzo</strong> pela arte de cuidar. Com mais de 8 anos de
              atuação em Itapira/SP, a clínica é referência em tratamentos faciais, corporais e bem-estar.
            </p>
            <p className="font-body text-base text-muted-foreground leading-relaxed mb-10">
              Nossa filosofia: cada cliente merece um atendimento único, com protocolos personalizados e equipamentos de
              última geração. Aqui, você não é apenas uma cliente — você é nossa prioridade.
            </p>

            {/* Diferenciais */}
            <div className="grid grid-cols-2 gap-5">
              {diferenciais.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-white shadow-sm border"
                  style={{ borderColor: "oklch(0.88 0.012 80)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "oklch(0.76 0.17 75 / 0.12)" }}
                  >
                    <item.icon size={18} style={{ color: "oklch(0.68 0.18 75)" }} />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-sm text-foreground">{item.title}</p>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Photo */}
          <div className="relative flex justify-center">
            {/* Decoração dourada atrás */}
            <div
              className="absolute -top-6 -right-6 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: "oklch(0.76 0.17 75)" }}
            />
            <div
              className="absolute -bottom-6 -left-6 w-48 h-48 rounded-full opacity-15 blur-2xl pointer-events-none"
              style={{ background: "oklch(0.68 0.18 75)" }}
            />

            {/* Borda dourada decorativa */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none z-10"
              style={{
                margin: "-6px",
                border: "2px solid oklch(0.76 0.17 75 / 0.35)",
                borderRadius: "28px",
              }}
            />

            {/* Foto principal */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl w-full aspect-[3/4] max-w-sm">
              <img
                src="/manus-storage/savoir-ericka-real_35a1f3fe.jpg"
                alt="Éricka Bertolazzo — Savoir Estética & Massagem"
                className="w-full h-full object-cover object-top"
              />
              {/* Overlay gradiente dourado */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, oklch(0.12 0.008 80 / 0.75) 0%, transparent 55%)",
                }}
              />
              {/* Badge nome */}
              <div className="absolute bottom-5 left-5 right-5 z-10">
                <div
                  className="backdrop-blur-md rounded-2xl px-5 py-4 border"
                  style={{
                    background: "oklch(1 0 0 / 0.88)",
                    borderColor: "oklch(0.76 0.17 75 / 0.3)",
                  }}
                >
                  <p className="font-display text-xl font-semibold text-foreground">Éricka Bertolazzo</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">
                    Esteticista Responsável · 8 anos de experiência
                  </p>
                </div>
              </div>
            </div>

            {/* Badge flutuante dourado */}
            <div
              className="absolute -top-4 -left-4 rounded-2xl px-5 py-4 shadow-xl hidden md:block z-20"
              style={{
                background: "linear-gradient(135deg, oklch(0.82 0.18 75), oklch(0.68 0.20 72))",
                color: "oklch(0.08 0.005 90)",
              }}
            >
              <p className="font-display text-3xl font-bold leading-none">8+</p>
              <p className="font-body text-xs mt-1 opacity-80 font-medium">Anos de<br />Experiência</p>
            </div>

            {/* Foto consultório flutuante */}
            <div
              className="absolute -bottom-6 -right-6 w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-4 hidden md:block z-20"
              style={{ borderColor: "oklch(0.76 0.17 75 / 0.5)" }}
            >
              <img
                src="/manus-storage/savoir-clinic_2ecd8d09.jpg"
                alt="Consultório Savoir Estética"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
