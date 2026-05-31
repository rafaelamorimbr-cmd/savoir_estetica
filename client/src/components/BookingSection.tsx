import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, User, Phone, Mail, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DAY_NAMES = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

export default function BookingSection() {
  const { data: services = [] } = trpc.services.list.useQuery();
  const createAppointment = trpc.appointments.create.useMutation();

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  // Rola para o topo do formulário ao trocar de passo
  const goToStep = (newStep: number) => {
    setStep(newStep);
    // pequeno delay para o React renderizar o novo passo antes do scroll
    setTimeout(() => {
      const el = document.getElementById("agendamento");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 50);
  };

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const isDateDisabled = (day: number) => {
    const d = new Date(calYear, calMonth, day);
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    if (d < todayStart) return true;
    if (d.getDay() === 0) return true; // domingo fechado
    return false;
  };

  const formatDateStr = (day: number) =>
    `${calYear}-${String(calMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

  const handleDateClick = (day: number) => {
    if (isDateDisabled(day)) return;
    setSelectedDate(formatDateStr(day));
    setSelectedTime("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !form.name || !form.phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await createAppointment.mutateAsync({
        serviceId: parseInt(selectedService),
        clientName: form.name,
        clientEmail: form.email || undefined,
        clientPhone: form.phone,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        notes: form.notes || undefined,
      });
      setSubmitted(true);
    } catch {
      toast.error("Erro ao enviar agendamento. Tente novamente ou entre em contato pelo WhatsApp.");
    }
  };

  const selectedServiceObj = services.find(s => s.id === parseInt(selectedService));

  if (submitted) {
    return (
      <section id="agendamento" className="section-padding bg-white">
        <div className="container max-w-lg mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-foreground mb-3">Agendamento Recebido!</h2>
          <p className="font-body text-muted-foreground mb-2">
            Obrigada, <strong>{form.name}</strong>! Seu agendamento foi enviado com sucesso.
          </p>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Entraremos em contato pelo número <strong>{form.phone}</strong> para confirmar sua consulta.
          </p>
          <div className="bg-muted/50 rounded-2xl p-5 text-left mb-8 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Serviço:</span>
              <span className="font-medium">{selectedServiceObj?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Data:</span>
              <span className="font-medium">{selectedDate.split("-").reverse().join("/")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Horário:</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
          </div>
          <a
            href="https://wa.me/5519998813701"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn inline-flex mx-auto"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Confirmar pelo WhatsApp
          </a>
          <button onClick={() => { setSubmitted(false); setStep(1); setSelectedDate(""); setSelectedTime(""); setSelectedService(""); setForm({ name:"", email:"", phone:"", notes:"" }); }}
            className="block mx-auto mt-4 text-sm text-muted-foreground hover:text-primary underline">
            Fazer novo agendamento
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="agendamento" className="section-padding bg-white">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-primary font-semibold mb-3">Agendamento Online</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Reserve seu
            <span className="italic text-primary"> horário</span>
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-md mx-auto">
            Escolha o serviço, data e horário de sua preferência. Entraremos em contato para confirmar.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step >= s ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}>{s}</div>
              {s < 3 && <div className={`w-12 h-0.5 transition-all ${step > s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-16 mb-8 text-xs text-muted-foreground">
          <span className={step >= 1 ? "text-primary font-medium" : ""}>Serviço</span>
          <span className={step >= 2 ? "text-primary font-medium" : ""}>Data & Hora</span>
          <span className={step >= 3 ? "text-primary font-medium" : ""}>Seus Dados</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-border shadow-sm p-6 md:p-10">
          {/* Step 1: Service */}
          {step === 1 && (
            <div>
              <h3 className="font-display text-2xl font-semibold mb-6">Escolha o serviço</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedService(String(s.id))}
                    className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedService === String(s.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-body font-semibold text-sm text-foreground">{s.name}</p>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">
                          {s.category === "facial" ? "Facial" : "Corporal"} · {s.duration} min
                        </p>
                      </div>
                      {selectedService === String(s.id) && (
                        <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  disabled={!selectedService}
                  onClick={() => goToStep(2)}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold disabled:opacity-40 hover:bg-primary/90 transition-all"
                >
                  Próximo <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div>
              <h3 className="font-display text-2xl font-semibold mb-6">Escolha a data e horário</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={prevMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <ChevronLeft size={18} />
                    </button>
                    <span className="font-body font-semibold text-sm">{MONTH_NAMES[calMonth]} {calYear}</span>
                    <button type="button" onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAY_NAMES.map(d => (
                      <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = formatDateStr(day);
                      const disabled = isDateDisabled(day);
                      const selected = selectedDate === dateStr;
                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={disabled}
                          onClick={() => handleDateClick(day)}
                          className={`aspect-square rounded-lg text-sm font-medium transition-all duration-150 ${
                            selected ? "bg-primary text-white shadow-md" :
                            disabled ? "text-muted-foreground/40 cursor-not-allowed" :
                            "hover:bg-primary/10 hover:text-primary text-foreground"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                    <Calendar size={12} /> Domingos não disponíveis
                  </p>
                </div>

                {/* Time slots */}
                <div>
                  <p className="font-body font-semibold text-sm mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    {selectedDate ? `Horários para ${selectedDate.split("-").reverse().join("/")}` : "Selecione uma data primeiro"}
                  </p>
                  {selectedDate ? (
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                            selectedTime === t
                              ? "bg-primary text-white shadow-md"
                              : "bg-muted hover:bg-primary/10 hover:text-primary text-foreground"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                      Selecione uma data no calendário
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button type="button" onClick={() => goToStep(1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-3 rounded-full font-medium transition-colors">
                  <ChevronLeft size={16} /> Voltar
                </button>
                <button
                  type="button"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => goToStep(3)}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold disabled:opacity-40 hover:bg-primary/90 transition-all"
                >
                  Próximo <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Personal data */}
          {step === 3 && (
            <div>
              <h3 className="font-display text-2xl font-semibold mb-2">Seus dados</h3>
              <p className="font-body text-sm text-muted-foreground mb-6">Preencha seus dados para finalizar o agendamento.</p>

              {/* Summary */}
              <div className="bg-muted/50 rounded-xl p-4 mb-6 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Serviço</p>
                  <p className="font-medium text-foreground truncate">{selectedServiceObj?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Data</p>
                  <p className="font-medium text-foreground">{selectedDate.split("-").reverse().join("/")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Horário</p>
                  <p className="font-medium text-foreground">{selectedTime}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    <User size={14} className="inline mr-1.5 text-primary" />Nome completo *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    <Phone size={14} className="inline mr-1.5 text-primary" />WhatsApp / Telefone *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="(19) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    <Mail size={14} className="inline mr-1.5 text-primary" />E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Observações (opcional)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Alguma informação adicional ou preferência..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button type="button" onClick={() => goToStep(2)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-3 rounded-full font-medium transition-colors">
                  <ChevronLeft size={16} /> Voltar
                </button>
                <button
                  type="submit"
                  disabled={createAppointment.isPending}
                  className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 shadow-lg hover:shadow-xl"
                >
                  {createAppointment.isPending ? "Enviando..." : "Confirmar Agendamento"}
                  {!createAppointment.isPending && <CheckCircle size={16} />}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* WhatsApp alternative */}
        <div className="text-center mt-8">
          <p className="font-body text-sm text-muted-foreground mb-3">Prefere agendar pelo WhatsApp?</p>
          <a
            href="https://wa.me/5519998813701?text=Olá! Gostaria de agendar um horário na Savoir Estética."
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn inline-flex"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Agendar pelo WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
