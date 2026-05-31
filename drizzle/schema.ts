import {
  boolean,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Serviços oferecidos pela clínica
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  category: mysqlEnum("category", ["facial", "corporal"]).notNull(),
  description: text("description"),
  duration: int("duration").notNull().default(60), // minutos
  price: decimal("price", { precision: 10, scale: 2 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

// Agendamentos
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  serviceId: int("serviceId").notNull(),
  clientName: varchar("clientName", { length: 200 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }),
  clientPhone: varchar("clientPhone", { length: 20 }).notNull(),
  appointmentDate: varchar("appointmentDate", { length: 10 }).notNull(), // YYYY-MM-DD
  appointmentTime: varchar("appointmentTime", { length: 5 }).notNull(),  // HH:MM
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "completed"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

// Galeria de antes e depois
export const gallery = mysqlTable("gallery", {
  id: int("id").autoincrement().primaryKey(),
  category: mysqlEnum("category", ["facial", "corporal", "outros"]).notNull().default("outros"),
  serviceId: int("serviceId"),
  beforeImageUrl: text("beforeImageUrl"),
  afterImageUrl: text("afterImageUrl").notNull(),
  description: text("description"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Gallery = typeof gallery.$inferSelect;
export type InsertGallery = typeof gallery.$inferInsert;

// Depoimentos de clientes
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  clientName: varchar("clientName", { length: 200 }).notNull(),
  rating: int("rating").notNull().default(5), // 1-5
  comment: text("comment").notNull(),
  serviceId: int("serviceId"),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// Horários de funcionamento
export const businessHours = mysqlTable("business_hours", {
  id: int("id").autoincrement().primaryKey(),
  dayOfWeek: int("dayOfWeek").notNull(), // 0=Dom, 1=Seg, ..., 6=Sáb
  openTime: varchar("openTime", { length: 5 }),  // HH:MM
  closeTime: varchar("closeTime", { length: 5 }), // HH:MM
  isOpen: boolean("isOpen").default(true).notNull(),
});

export type BusinessHours = typeof businessHours.$inferSelect;
