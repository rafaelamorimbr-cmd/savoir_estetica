import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = trpc.testimonials.list.useQuery();
  const createTestimonial = trpc.testimonials.create.useMutation();
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientName: "", rating: 5, comment: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTestimonial.mutateAsync(form);
      toast.success("Obrigada pelo seu depoimento! Ele será publicado após aprovação.");
      setShowForm(false);
      setForm({ clientName: "", rating: 5, comment: "" });
    } catch {
      toast.error("Erro ao enviar depoimento. Tente novamente.");
    }
  };

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  // Default testimonials for display when DB is empty
  const defaultTestimonials = [
    { id: -1, clientName: "Ana Paula S.", rating: 5, comment: "Fiz a dermaplanagem com a Éricka e o resultado foi incrível! Pele lisinha, sem penugem, hidratada. Super recomendo a Savoir Estética!", serviceName: "Dermaplanagem" },
    { id: -2, clientName: "Mariana L.", rating: 5, comment: "Atendimento maravilhoso, ambiente aconchegante e resultados reais. Faço massagem relaxante toda semana e me sinto uma nova pessoa!", serviceName: "Massagem Relaxante" },
    { id: -3, clientName: "Fernanda C.", rating: 5, comment: "O BB Glow transformou minha pele! Base permanente que dura meses. Éricka é muito profissional e atenciosa. Voltarei com certeza!", serviceName: "BB Glow" },
    { id: -4, clientName: "Juliana M.", rating: 5, comment: "Fiz a micropigmentação dos olhos e ficou perfeito! Traço natural, exatamente o que eu queria. Profissional incrível!", serviceName: "Micropigmentação" },
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;
  const safeIndex = current % displayTestimonials.length;

  return (
    <section id="depoimentos" className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-primary font-semibold mb-3">Depoimentos</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            O que nossas clientes
            <span className="italic text-primary"> dizem</span>
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-xl mx-auto">
            A satisfação das nossas clientes é a nossa maior conquista.
          </p>
        </div>

        {isLoading ? (
          <div className="max-w-2xl mx-auto h-48 rounded-3xl bg-muted animate-pulse" />
        ) : (
          <>
            {/* Featured testimonial */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative bg-muted/40 rounded-3xl p-8 md:p-10 text-center">
                <Quote size={40} className="text-primary/20 mx-auto mb-4" />
                <StarRating rating={displayTestimonials[safeIndex].rating} />
                <p className="font-display text-xl md:text-2xl font-light text-foreground leading-relaxed mt-4 mb-6 italic">
                  "{displayTestimonials[safeIndex].comment}"
                </p>
                <div>
                  <p className="font-body font-semibold text-foreground">{displayTestimonials[safeIndex].clientName}</p>
                  {(displayTestimonials[safeIndex] as any).serviceName && (
                    <p className="font-body text-xs text-primary mt-0.5">{(displayTestimonials[safeIndex] as any).serviceName}</p>
                  )}
                </div>

                {/* Navigation */}
                {displayTestimonials.length > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <button onClick={prev} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <div className="flex gap-1.5">
                      {displayTestimonials.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrent(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === safeIndex ? "bg-primary w-6" : "bg-border"}`}
                        />
                      ))}
                    </div>
                    <button onClick={next} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Grid of other testimonials */}
            {displayTestimonials.length > 1 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {displayTestimonials.slice(0, 3).map((t, i) => (
                  <div key={t.id} className={`p-5 rounded-2xl border transition-all cursor-pointer ${i === safeIndex ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/50"}`} onClick={() => setCurrent(i)}>
                    <StarRating rating={t.rating} />
                    <p className="font-body text-sm text-muted-foreground mt-3 line-clamp-3 italic">"{t.comment}"</p>
                    <p className="font-body text-sm font-semibold text-foreground mt-3">{t.clientName}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Leave a testimonial */}
        <div className="text-center">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-200"
            >
              <Star size={16} />
              Deixar meu depoimento
            </button>
          ) : (
            <div className="max-w-lg mx-auto bg-muted/30 rounded-3xl p-6 text-left">
              <h3 className="font-display text-xl font-semibold mb-4">Compartilhe sua experiência</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={form.clientName}
                  onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  required
                />
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Sua avaliação</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}>
                        <Star size={24} className={n <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Conte sua experiência na Savoir Estética..."
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  required
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                    Cancelar
                  </button>
                  <button type="submit" disabled={createTestimonial.isPending} className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 text-sm">
                    {createTestimonial.isPending ? "Enviando..." : "Enviar Depoimento"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
