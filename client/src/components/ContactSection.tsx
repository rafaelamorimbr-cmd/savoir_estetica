import { MapPin, Phone, Clock, Instagram, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const horarios = [
  { dia: "Segunda a Sexta", hora: "09:00 – 18:00" },
  { dia: "Sábado", hora: "09:00 – 13:00" },
  { dia: "Domingo", hora: "Fechado" },
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Preencha seu nome e telefone.");
      return;
    }
    setSending(true);
    const text = encodeURIComponent(
      `Olá! Meu nome é ${form.name}.\n📱 Telefone: ${form.phone}\n\n${form.message || "Gostaria de mais informações sobre os serviços da Savoir Estética."}`
    );
    window.open(`https://wa.me/5519998813701?text=${text}`, "_blank");
    setSending(false);
    toast.success("Redirecionando para o WhatsApp...");
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <section id="contato" className="section-padding bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-primary font-semibold mb-3">Contato</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Fale
            <span className="italic text-primary"> conosco</span>
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-xl mx-auto">
            Estamos prontas para atender você. Entre em contato pelo WhatsApp ou preencha o formulário abaixo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Info + Map */}
          <div className="space-y-6">
            {/* Contact cards */}
            <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-body font-semibold text-foreground text-sm">WhatsApp</p>
                  <a href="https://wa.me/5519998813701" target="_blank" rel="noopener noreferrer"
                    className="font-body text-primary hover:underline font-medium">(19) 99881-3701</a>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">Somente WhatsApp</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-body font-semibold text-foreground text-sm">Localização</p>
                  <p className="font-body text-muted-foreground">Itapira, São Paulo — SP</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Instagram size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-body font-semibold text-foreground text-sm">Instagram</p>
                  <a href="https://www.instagram.com/savoir_estetica" target="_blank" rel="noopener noreferrer"
                    className="font-body text-primary hover:underline">@savoir_estetica</a>
                </div>
              </div>
            </div>

            {/* Business hours */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-primary" />
                <p className="font-body font-semibold text-foreground">Horários de Funcionamento</p>
              </div>
              <div className="space-y-3">
                {horarios.map((h) => (
                  <div key={h.dia} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="font-body text-sm text-muted-foreground">{h.dia}</span>
                    <span className={`font-body text-sm font-medium ${h.hora === "Fechado" ? "text-red-400" : "text-foreground"}`}>
                      {h.hora}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden h-52">
              <iframe
                title="Localização Savoir Estética — Itapira/SP"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58898.97!2d-46.8!3d-22.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8b0b0b0b0b0b0%3A0x0!2sItapira%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Contact form */}
          <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Envie uma mensagem</h3>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Preencha o formulário e clique em "Enviar pelo WhatsApp" para falar diretamente com a Éricka.
            </p>
            <form onSubmit={handleWhatsApp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nome *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">WhatsApp / Telefone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="(19) 99999-9999"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Mensagem (opcional)</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Qual serviço você tem interesse? Alguma dúvida?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="whatsapp-btn w-full justify-center text-base"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Enviar pelo WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
