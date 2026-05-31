import { Award, Heart, Sparkles, Shield } from "lucide-react";

const diferenciais = [
  {
    icon: Award,
    title: "8 Anos de Experiência",
    desc: "Uma trajetória sólida no mercado de estética, com centenas de clientes satisfeitas e resultados comprovados.",
  },
  {
    icon: Sparkles,
    title: "Equipamentos Modernos",
    desc: "Tecnologia de ponta para oferecer tratamentos seguros, eficazes e com resultados superiores.",
  },
  {
    icon: Heart,
    title: "Atendimento Personalizado",
    desc: "Cada cliente é única. Protocolos individualizados para atender às suas necessidades específicas.",
  },
  {
    icon: Shield,
    title: "Biossegurança Total",
    desc: "Rigorosos protocolos de higiene e esterilização para garantir sua saúde e segurança em todos os procedimentos.",
  },
];

export default function AboutSection() {
  return (
    <section id="sobre" className="section-padding bg-white">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-primary font-semibold mb-3">
              Sobre a Clínica
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
              Sua beleza em mãos
              <span className="italic text-primary"> experientes</span>
            </h2>
            <p className="font-body text-base text-muted-foreground leading-relaxed mb-5">
              A <strong>Savoir Estética & Massagem</strong> nasceu da paixão de <strong>Éricka Bertolazzo</strong> pela arte de cuidar. Com mais de 8 anos de atuação no mercado estético, a clínica se consolidou em Itapira/SP como referência em tratamentos faciais, corporais e bem-estar.
            </p>
            <p className="font-body text-base text-muted-foreground leading-relaxed mb-8">
              Nossa filosofia é simples: cada cliente merece um atendimento único, com protocolos personalizados, equipamentos de última geração e, acima de tudo, o cuidado humano que faz toda a diferença. Aqui, você não é apenas uma cliente — você é nossa prioridade.
            </p>

            {/* Diferenciais grid */}
            <div className="grid grid-cols-2 gap-4">
              {diferenciais.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-sm text-foreground">{item.title}</p>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Photos */}
          <div className="relative">
            {/* Main photo — Éricka */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
              <img
                src="/manus-storage/savoir-ericka-real_35a1f3fe.jpg"
                alt="Éricka Bertolazzo — Savoir Estética & Massagem"
                className="w-full h-full object-cover object-top"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {/* Name badge */}
              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3">
                  <p className="font-display text-lg font-semibold text-foreground">Éricka Bertolazzo</p>
                  <p className="font-body text-xs text-muted-foreground">Esteticista Responsável · 8 anos de experiência</p>
                </div>
              </div>
            </div>

            {/* Floating clinic photo */}
            <div className="absolute -bottom-6 -right-6 w-44 h-44 rounded-2xl overflow-hidden shadow-xl border-4 border-white hidden md:block">
              <img
                src="/manus-storage/savoir-clinic_2ecd8d09.jpg"
                alt="Consultório Savoir Estética"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -left-4 bg-primary text-white rounded-2xl px-4 py-3 shadow-lg hidden md:block">
              <p className="font-display text-2xl font-bold leading-none">8+</p>
              <p className="font-body text-xs mt-0.5 opacity-90">Anos de<br/>Experiência</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
