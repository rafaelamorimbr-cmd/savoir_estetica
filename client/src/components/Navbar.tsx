import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#agendamento", label: "Agendar" },
  { href: "#galeria", label: "Galeria" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#contato", label: "Contato" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleNav = (href: string) => {
    setIsOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/97 backdrop-blur-md shadow-lg py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container flex items-center justify-between gap-4">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <button
            onClick={() => handleNav("#inicio")}
            className="flex items-center gap-3 flex-shrink-0"
            aria-label="Savoir Estética & Massagem — Início"
          >
            <img
              src="/manus-storage/savoir-logo_01d7b15c.jpg"
              alt="Savoir Estética"
              className={`object-contain rounded-lg transition-all duration-300 ${scrolled ? "w-9 h-9" : "w-11 h-11"}`}
            />
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className={`font-display font-semibold transition-all duration-300 ${scrolled ? "text-base text-primary" : "text-lg text-white"}`}>
                Savoir
              </span>
              <span className={`font-body text-[10px] tracking-[0.18em] uppercase transition-all duration-300 ${scrolled ? "text-foreground/50" : "text-white/70"}`}>
                Estética & Massagem
              </span>
            </div>
          </button>

          {/* ── Desktop Links ─────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`font-body text-sm font-medium transition-colors duration-200 hover:text-primary relative group ${
                  scrolled ? "text-foreground/70" : "text-white/90"
                }`}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-200 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* ── Desktop CTA ───────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <a
              href="https://wa.me/5519998813701?text=Olá! Gostaria de agendar um horário na Savoir Estética."
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 ${
                scrolled
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-white/15 backdrop-blur-sm border border-white/30 text-white hover:bg-white/25"
              }`}
            >
              <Phone size={14} />
              <span className="hidden lg:inline">Agendar Agora</span>
              <span className="lg:hidden">Agendar</span>
            </a>
          </div>

          {/* ── Mobile Hamburger ──────────────────────────────────── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-xl transition-all duration-200 active:scale-95 ${
              scrolled
                ? "text-foreground bg-muted hover:bg-muted/80"
                : "text-white bg-white/10 hover:bg-white/20"
            }`}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Overlay ──────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* ── Mobile Drawer ───────────────────────────────────────────── */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-white shadow-2xl md:hidden flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src="/manus-storage/savoir-logo_01d7b15c.jpg"
              alt="Savoir"
              className="w-10 h-10 rounded-lg object-contain"
            />
            <div>
              <p className="font-display text-base font-semibold text-primary leading-tight">Savoir</p>
              <p className="font-body text-[9px] text-muted-foreground tracking-widest uppercase">Estética & Massagem</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Nav Links */}
        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-left py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-150 active:scale-[0.98]"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Drawer Footer CTA */}
        <div className="p-5 border-t border-border">
          <a
            href="https://wa.me/5519998813701?text=Olá! Gostaria de agendar um horário na Savoir Estética."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-white text-sm transition-all active:scale-95 shadow-lg"
            style={{ background: "#25D366" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Agendar pelo WhatsApp
          </a>
          <p className="text-center text-xs text-muted-foreground mt-3">(19) 99881-3701 · Itapira/SP</p>
        </div>
      </div>
    </>
  );
}
