import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  appointments,
  businessHours,
  gallery,
  InsertAppointment,
  InsertGallery,
  InsertService,
  InsertTestimonial,
  InsertUser,
  services,
  testimonials,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach((field) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  });
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ── Services ─────────────────────────────────────────────────────────────────
export async function getActiveServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).where(eq(services.active, true)).orderBy(asc(services.category), asc(services.name));
}

export async function getAllServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).orderBy(asc(services.category), asc(services.name));
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result[0];
}

export async function createService(data: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(services).values(data);
}

export async function updateService(id: number, data: Partial<InsertService>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(services).set(data).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(services).set({ active: false }).where(eq(services.id, id));
}

// ── Appointments ─────────────────────────────────────────────────────────────
export async function createAppointment(data: InsertAppointment) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(appointments).values(data);
  return result;
}

export async function getAppointments(filters?: { date?: string; status?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.date) conditions.push(eq(appointments.appointmentDate, filters.date));
  if (filters?.status) conditions.push(eq(appointments.status, filters.status as "pending" | "confirmed" | "cancelled" | "completed"));
  const query = db
    .select({
      appointment: appointments,
      service: services,
    })
    .from(appointments)
    .leftJoin(services, eq(appointments.serviceId, services.id))
    .orderBy(desc(appointments.appointmentDate), asc(appointments.appointmentTime));
  if (conditions.length > 0) {
    return query.where(and(...conditions));
  }
  return query;
}

export async function updateAppointmentStatus(id: number, status: "pending" | "confirmed" | "cancelled" | "completed") {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(appointments).set({ status }).where(eq(appointments.id, id));
}

export async function getAppointmentsByDate(date: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(appointments)
    .where(and(eq(appointments.appointmentDate, date), eq(appointments.status, "confirmed")))
    .orderBy(asc(appointments.appointmentTime));
}

// ── Gallery ───────────────────────────────────────────────────────────────────
export async function getActiveGallery(category?: string) {
  const db = await getDb();
  if (!db) return [];
  if (category && category !== "todos") {
    return db
      .select()
      .from(gallery)
      .where(and(eq(gallery.active, true), eq(gallery.category, category as "facial" | "corporal" | "outros")))
      .orderBy(desc(gallery.createdAt));
  }
  return db.select().from(gallery).where(eq(gallery.active, true)).orderBy(desc(gallery.createdAt));
}

export async function createGalleryItem(data: InsertGallery) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(gallery).values(data);
}

export async function deleteGalleryItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(gallery).set({ active: false }).where(eq(gallery.id, id));
}

// ── Testimonials ──────────────────────────────────────────────────────────────
export async function getApprovedTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).where(eq(testimonials.approved, true)).orderBy(desc(testimonials.createdAt));
}

export async function getAllTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
}

export async function createTestimonial(data: InsertTestimonial) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(testimonials).values(data);
}

export async function updateTestimonialApproval(id: number, approved: boolean) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(testimonials).set({ approved }).where(eq(testimonials.id, id));
}

// ── Business Hours ────────────────────────────────────────────────────────────
export async function getBusinessHours() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(businessHours).orderBy(asc(businessHours.dayOfWeek));
}

export async function seedBusinessHours() {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(businessHours).limit(1);
  if (existing.length > 0) return;
  const defaultHours = [
    { dayOfWeek: 0, openTime: null, closeTime: null, isOpen: false },
    { dayOfWeek: 1, openTime: "09:00", closeTime: "18:00", isOpen: true },
    { dayOfWeek: 2, openTime: "09:00", closeTime: "18:00", isOpen: true },
    { dayOfWeek: 3, openTime: "09:00", closeTime: "18:00", isOpen: true },
    { dayOfWeek: 4, openTime: "09:00", closeTime: "18:00", isOpen: true },
    { dayOfWeek: 5, openTime: "09:00", closeTime: "18:00", isOpen: true },
    { dayOfWeek: 6, openTime: "09:00", closeTime: "13:00", isOpen: true },
  ];
  await db.insert(businessHours).values(defaultHours);
}

export async function seedServices() {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(services).limit(1);
  if (existing.length > 0) return;
  const initialServices: InsertService[] = [
    {
      name: "Depilação a Laser",
      category: "corporal",
      description: "Tecnologia avançada para eliminação progressiva e definitiva dos pelos. Acaba com o incômodo da cera e da lâmina, trata e previne a foliculite (pelos encravados) e deixa a pele perfeitamente lisa.",
      duration: 60,
      active: true,
    },
    {
      name: "Peeling de Diamante",
      category: "facial",
      description: "Microdermoabrasão superficial que realiza uma esfoliação mecânica profunda na pele através de uma ponteira de diamante. Remove células mortas, estimula a produção de colágeno, suaviza linhas finas, fecha os poros e devolve o viço e a luminosidade imediata ao rosto.",
      duration: 60,
      active: true,
    },
    {
      name: "Dermaplaning",
      category: "facial",
      description: "Tratamento de esfoliação superficial feito com uma lâmina cirúrgica esterilizada para remover as células mortas e a penugem facial. Melhora instantaneamente a textura da pele, aumenta a absorção de cosméticos e deixa a aplicação da maquiagem perfeitamente uniforme.",
      duration: 60,
      active: true,
    },
    {
      name: "Tratamento de Mancha Senil",
      category: "facial",
      description: "Protocolos focados na remoção ou clareamento de manchas escuras causadas pelo sol e pelo envelhecimento cronológico, comuns nas mãos, braços e rosto. Uniformiza o tom da pele e promove a renovação celular das áreas expostas.",
      duration: 60,
      active: true,
    },
    {
      name: "Rejuvenescimento Facial",
      category: "facial",
      description: "Combinação de protocolos para combater a flacidez e o envelhecimento. Ameniza rugas e linhas de expressão, devolve a firmeza e redefine o contorno facial através do estímulo de colágeno e elastina.",
      duration: 90,
      active: true,
    },
    {
      name: "BB Glow",
      category: "facial",
      description: "Tratamento estético semipermanente que utiliza a técnica de microagulhamento para infundir ampolas de vitaminas e soro com cor na camada superficial da pele. Efeito de base semipermanente, camufla imperfeições, olheiras e manchas, além de hidratar e iluminar profundamente.",
      duration: 75,
      active: true,
    },
    {
      name: "Remoção de Verrugas",
      category: "facial",
      description: "Procedimento estético seguro para a eliminação de pequenas lesões benignas na pele. Melhora a estética da região, elimina o desconforto causado pelo atrito com roupas ou acessórios e devolve a pele lisa.",
      duration: 45,
      active: true,
    },
    {
      name: "Massagem Relaxante",
      category: "corporal",
      description: "Movimentos firmes e suaves aplicados no corpo todo para aliviar as tensões do dia a dia. Reduz o estresse e a ansiedade, relaxa a musculatura, melhora a circulação sanguínea e promove um sono de melhor qualidade.",
      duration: 60,
      active: true,
    },
    {
      name: "Depilação Comum",
      category: "corporal",
      description: "Remoção tradicional de pelos pela raiz utilizando ceras de alta qualidade, adequadas para diferentes tipos de pele e áreas do corpo. Pele lisinha por semanas, com técnicas que minimizam a dor e cuidam da integridade cutânea.",
      duration: 45,
      active: true,
    },
    {
      name: "Piercing",
      category: "corporal",
      description: "Aplicação de joias corporais e faciais realizada de forma asséptica, segura e com materiais biocompatíveis como titânio ou aço cirúrgico. Foco em biossegurança, precisão na perfuração e acompanhamento para uma cicatrização perfeita.",
      duration: 30,
      active: true,
    },
  ];
  await db.insert(services).values(initialServices);
}

export async function seedTestimonials() {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(testimonials).limit(1);
  if (existing.length > 0) return;
  const initialTestimonials: InsertTestimonial[] = [
    { clientName: "Ana Paula S.", rating: 5, comment: "Atendimento incrível! A Éricka é muito profissional e atenciosa. Fiz o BB Glow e o resultado foi surpreendente. Recomendo demais!", approved: true },
    { clientName: "Mariana C.", rating: 5, comment: "Já faz 2 anos que sou cliente da Savoir Estética. A qualidade dos serviços é impecável. O ambiente é super aconchegante e a Éricka sempre me deixa com a pele maravilhosa!", approved: true },
    { clientName: "Fernanda L.", rating: 5, comment: "Fiz a massagem relaxante e foi uma experiência incrível. Saí completamente renovada. Com certeza voltarei!", approved: true },
    { clientName: "Juliana M.", rating: 5, comment: "O Peeling de Diamante transformou minha pele! Estava com manchas e poros dilatados, e após as sessões minha pele ficou muito mais uniforme e luminosa.", approved: true },
    { clientName: "Camila R.", rating: 5, comment: "Profissional extremamente qualificada e dedicada. O tratamento de mancha senil foi muito eficaz. Recomendo a todos!", approved: true },
    { clientName: "Patrícia A.", rating: 5, comment: "Ambiente lindo, atendimento personalizado e resultados reais. A Éricka tem 8 anos de experiência e isso se vê em cada detalhe do atendimento.", approved: true },
  ];
  await db.insert(testimonials).values(initialTestimonials);
}
