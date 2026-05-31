import { Heart, Instagram, Phone } from "lucide-react";

const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#agendamento", label: "Agendamento" },
  { href: "#galeria", label: "Galeria" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#contato", label: "Contato" },
];

const services = [
  "Depilação a Laser",
  "Dermaplanagem",
  "BB Glow",
  "Pelling de Diamante",
  "Micropigmentação",
  "Massagem Relaxante",
  "Ventosaterapia",
  "Limpeza de Pele",
];

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-savoir-dark text-white">
      <div className="container py-14">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <img
                src="/manus-storage/savoir-logo_01d7b15c.jpg"
                alt="Savoir Estética & Massagem"
                className="h-20 w-auto rounded-xl object-contain bg-white/5 p-2"
              />
            </div>
            <p className="font-body text-sm text-white/60 leading-relaxed mb-4">
              O segredo da beleza é se cuidar. Há 8 anos transformando vidas em Itapira/SP.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/savoir_estetica" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://wa.me/5519998813701" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-colors">
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-body font-semibold text-white/90 mb-4 text-sm tracking-wide uppercase">Navegação</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button onClick={() => scrollTo(link.href)}
                    className="font-body text-sm text-white/60 hover:text-primary transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="font-body font-semibold text-white/90 mb-4 text-sm tracking-wide uppercase">Serviços</p>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s}>
                  <button onClick={() => scrollTo("#servicos")}
                    className="font-body text-sm text-white/60 hover:text-primary transition-colors text-left">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-body font-semibold text-white/90 mb-4 text-sm tracking-wide uppercase">Contato</p>
            <div className="space-y-3">
              <div>
                <p className="font-body text-xs text-white/40 uppercase tracking-wide mb-1">WhatsApp</p>
                <a href="https://wa.me/5519998813701" target="_blank" rel="noopener noreferrer"
                  className="font-body text-sm text-white/80 hover:text-primary transition-colors">
                  (19) 99881-3701
                </a>
              </div>
              <div>
                <p className="font-body text-xs text-white/40 uppercase tracking-wide mb-1">Localização</p>
                <p className="font-body text-sm text-white/80">Itapira, SP</p>
              </div>
              <div>
                <p className="font-body text-xs text-white/40 uppercase tracking-wide mb-1">Horários</p>
                <p className="font-body text-sm text-white/80">Seg–Sex: 9h–18h</p>
                <p className="font-body text-sm text-white/80">Sábado: 9h–13h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/40">
            © {new Date().getFullYear()} Savoir Estética & Massagem. Todos os direitos reservados.
          </p>
          <p className="font-body text-xs text-white/40 flex items-center gap-1">
            Feito com <Heart size={12} className="text-primary fill-primary" /> para a Éricka Bertolazzo
          </p>
        </div>
      </div>
    </footer>
  );
}
