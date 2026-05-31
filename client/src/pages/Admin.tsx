import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  Calendar, CheckCircle, Clock, Image, MessageSquare,
  Settings, Star, Trash2, Upload, Users, X, ChevronDown,
  LayoutDashboard, LogOut
} from "lucide-react";

type Tab = "dashboard" | "appointments" | "gallery" | "testimonials" | "services";

export default function Admin() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="bg-white rounded-3xl border border-border p-8 max-w-sm w-full text-center shadow-xl">
          <img src="/manus-storage/savoir-logo_01d7b15c.jpg" alt="Savoir" className="h-16 mx-auto mb-4 rounded-xl" />
          <h1 className="font-display text-2xl font-semibold text-foreground mb-2">Painel Administrativo</h1>
          <p className="font-body text-sm text-muted-foreground mb-6">Faça login para acessar o painel da Savoir Estética.</p>
          <a href={getLoginUrl()} className="block w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Entrar
          </a>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "appointments" as Tab, label: "Agendamentos", icon: Calendar },
    { id: "gallery" as Tab, label: "Galeria", icon: Image },
    { id: "testimonials" as Tab, label: "Depoimentos", icon: MessageSquare },
    { id: "services" as Tab, label: "Serviços", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 bg-white border-r border-border flex-col">
        <div className="p-5 border-b border-border">
          <img src="/manus-storage/savoir-logo_01d7b15c.jpg" alt="Savoir" className="h-12 rounded-lg" />
          <p className="font-body text-xs text-muted-foreground mt-2">Painel Administrativo</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-display text-sm font-semibold text-primary">É</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs font-semibold text-foreground truncate">{user?.name ?? "Éricka"}</p>
              <p className="font-body text-xs text-muted-foreground">Administradora</p>
            </div>
          </div>
          <button onClick={() => logout()} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden bg-white border-b border-border p-4 flex items-center justify-between">
          <p className="font-display text-lg font-semibold">Admin</p>
          <select
            value={activeTab}
            onChange={e => setActiveTab(e.target.value as Tab)}
            className="text-sm border border-border rounded-lg px-2 py-1"
          >
            {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        <div className="p-6">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "appointments" && <AppointmentsTab />}
          {activeTab === "gallery" && <GalleryTab />}
          {activeTab === "testimonials" && <TestimonialsTab />}
          {activeTab === "services" && <ServicesTab />}
        </div>
      </main>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardTab() {
  const { data: appointments = [] } = trpc.appointments.list.useQuery();
  const { data: testimonials = [] } = trpc.testimonials.listAll.useQuery();
  const { data: gallery = [] } = trpc.gallery.list.useQuery();

  const pending = appointments.filter(a => a.appointment.status === "pending").length;
  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter(a => a.appointment.appointmentDate === today).length;

  const stats = [
    { label: "Agendamentos Pendentes", value: pending, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
    { label: "Consultas Hoje", value: todayAppts, icon: Calendar, color: "text-blue-600 bg-blue-50" },
    { label: "Total de Agendamentos", value: appointments.length, icon: Users, color: "text-green-600 bg-green-50" },
    { label: "Depoimentos para Aprovar", value: testimonials.filter(t => !t.approved).length, icon: Star, color: "text-primary bg-primary/10" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-foreground mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-border p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{s.value}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <h2 className="font-display text-xl font-semibold mb-4">Próximos Agendamentos</h2>
        {appointments.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground text-center py-8">Nenhum agendamento ainda.</p>
        ) : (
          <div className="space-y-3">
          {appointments.slice(0, 5).map((a) => (
            <div key={a.appointment.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div>
                <p className="font-body font-semibold text-sm text-foreground">{a.appointment.clientName}</p>
                <p className="font-body text-xs text-muted-foreground">{a.appointment.appointmentDate} às {a.appointment.appointmentTime}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                a.appointment.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                a.appointment.status === "confirmed" ? "bg-green-100 text-green-700" :
                a.appointment.status === "cancelled" ? "bg-red-100 text-red-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {a.appointment.status === "pending" ? "Pendente" : a.appointment.status === "confirmed" ? "Confirmado" : a.appointment.status === "cancelled" ? "Cancelado" : "Concluído"}
              </span>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Appointments ──────────────────────────────────────────────────────────────
function AppointmentsTab() {
  const { data: appointments = [], refetch } = trpc.appointments.list.useQuery();
  const updateStatus = trpc.appointments.updateStatus.useMutation({ onSuccess: () => refetch() });
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? appointments : appointments.filter(a => a.appointment.status === filter);

  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "pending", label: "Pendentes" },
    { value: "confirmed", label: "Confirmados" },
    { value: "completed", label: "Concluídos" },
    { value: "cancelled", label: "Cancelados" },
  ];

  const handleStatus = async (id: number, status: "pending" | "confirmed" | "cancelled" | "completed") => {
    await updateStatus.mutateAsync({ id, status });
    toast.success("Status atualizado!");
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-foreground mb-6">Agendamentos</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {statusOptions.map(s => (
          <button key={s.value} onClick={() => setFilter(s.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === s.value ? "bg-primary text-white" : "bg-white border border-border text-foreground/70 hover:border-primary"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <Calendar size={40} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-body text-muted-foreground">Nenhum agendamento encontrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a.appointment.id} className="bg-white rounded-2xl border border-border p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-body font-semibold text-foreground">{a.appointment.clientName}</p>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      a.appointment.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      a.appointment.status === "confirmed" ? "bg-green-100 text-green-700" :
                      a.appointment.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {a.appointment.status === "pending" ? "Pendente" : a.appointment.status === "confirmed" ? "Confirmado" : a.appointment.status === "cancelled" ? "Cancelado" : "Concluído"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                    <span>📅 {a.appointment.appointmentDate} às {a.appointment.appointmentTime}</span>
                    <span>📱 {a.appointment.clientPhone}</span>
                    {a.appointment.clientEmail && <span>✉️ {a.appointment.clientEmail}</span>}
                    {a.appointment.notes && <span className="col-span-2">📝 {a.appointment.notes}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {a.appointment.status !== "confirmed" && (
                    <button onClick={() => handleStatus(a.appointment.id, "confirmed")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors">
                      <CheckCircle size={13} /> Confirmar
                    </button>
                  )}
                  {a.appointment.status !== "completed" && (
                    <button onClick={() => handleStatus(a.appointment.id, "completed")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors">
                      <CheckCircle size={13} /> Concluir
                    </button>
                  )}
                  {a.appointment.status !== "cancelled" && (
                    <button onClick={() => handleStatus(a.appointment.id, "cancelled")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors">
                      <X size={13} /> Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────────
function GalleryTab() {
  const { data: items = [], refetch } = trpc.gallery.list.useQuery();
  const uploadImage = trpc.gallery.uploadImage.useMutation();
  const createItem = trpc.gallery.create.useMutation({ onSuccess: () => { refetch(); toast.success("Imagem adicionada!"); } });
  const deleteItem = trpc.gallery.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Imagem removida!"); } });
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ category: "facial" as "facial" | "corporal" | "outros", description: "" });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "after") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = (ev.target?.result as string).split(",")[1];
        const { url } = await uploadImage.mutateAsync({ filename: file.name, contentType: file.type, base64Data: base64 });
        await createItem.mutateAsync({ ...form, afterImageUrl: url });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Erro ao fazer upload.");
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-foreground mb-6">Galeria</h1>

      {/* Upload form */}
      <div className="bg-white rounded-2xl border border-border p-5 mb-6">
        <h2 className="font-display text-lg font-semibold mb-4">Adicionar Imagem</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Categoria</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as any }))}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="facial">Facial</option>
              <option value="corporal">Corporal</option>
              <option value="outros">Outros</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">Descrição (opcional)</label>
            <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Ex: Resultado após 3 sessões de Dermaplanagem"
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <label className={`flex items-center justify-center gap-3 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : "border-border hover:border-primary hover:bg-primary/5"}`}>
          <Upload size={20} className="text-primary" />
          <span className="font-body text-sm text-muted-foreground">{uploading ? "Enviando..." : "Clique para selecionar uma imagem"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, "after")} disabled={uploading} />
        </label>
      </div>

      {/* Gallery grid */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <Image size={40} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-body text-muted-foreground">Nenhuma imagem na galeria ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group rounded-2xl overflow-hidden aspect-square bg-muted">
              <img src={item.afterImageUrl} alt={item.description ?? ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button onClick={() => deleteItem.mutate({ id: item.id })}
                  className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              {item.description && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                  <p className="text-white text-xs truncate">{item.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function TestimonialsTab() {
  const { data: testimonials = [], refetch } = trpc.testimonials.listAll.useQuery();
  const approve = trpc.testimonials.approve.useMutation({ onSuccess: () => { refetch(); toast.success("Depoimento atualizado!"); } });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-foreground mb-6">Depoimentos</h1>
      {testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <MessageSquare size={40} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-body text-muted-foreground">Nenhum depoimento ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-border p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-body font-semibold text-foreground">{t.clientName}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {t.approved ? "Aprovado" : "Pendente"}
                  </span>
                </div>
                <p className="font-body text-sm text-muted-foreground italic">"{t.comment}"</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!t.approved ? (
                  <button onClick={() => approve.mutate({ id: t.id, approved: true })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors">
                    <CheckCircle size={13} /> Aprovar
                  </button>
                ) : (
                  <button onClick={() => approve.mutate({ id: t.id, approved: false })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-semibold hover:bg-yellow-100 transition-colors">
                    <X size={13} /> Rejeitar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────
function ServicesTab() {
  const { data: services = [], refetch } = trpc.services.listAll.useQuery();
  const updateService = trpc.services.update.useMutation({ onSuccess: () => { refetch(); toast.success("Serviço atualizado!"); } });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-foreground mb-6">Serviços</h1>
      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-border p-5 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="font-body font-semibold text-foreground">{s.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.category === "facial" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}>
                  {s.category === "facial" ? "Facial" : "Corporal"}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {s.active ? "Ativo" : "Inativo"}
                </span>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-1">{s.duration} min{s.price ? ` · ${s.price}` : ""}</p>
            </div>
            <button
              onClick={() => updateService.mutate({ id: s.id, active: !s.active })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                s.active
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
            >
              {s.active ? "Desativar" : "Ativar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
