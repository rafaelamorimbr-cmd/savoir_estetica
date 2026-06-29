import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createAppointment,
  createGalleryItem,
  createService,
  createTestimonial,
  deleteGalleryItem,
  deleteService,
  getActiveGallery,
  getActiveServices,
  getAllServices,
  getAllTestimonials,
  getAppointments,
  getApprovedTestimonials,
  getBusinessHours,
  getServiceById,
  seedBusinessHours,
  seedServices,
  seedTestimonials,
  updateAppointmentStatus,
  updateService,
  updateTestimonialApproval,
} from "./db";
import { storagePut } from "./storage";
import { z } from "zod";

// ── Seed on startup ───────────────────────────────────────────────────────────
(async () => {
  try {
    await seedServices();
    await seedTestimonials();
    await seedBusinessHours();
  } catch (e) {
    console.warn("[Seed] Failed:", e);
  }
})();

// ── Routers ───────────────────────────────────────────────────────────────────
const servicesRouter = router({
  list: publicProcedure.query(() => getActiveServices()),
  listAll: protectedProcedure.query(() => getAllServices()),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        category: z.enum(["facial", "corporal"]),
        description: z.string().optional(),
        duration: z.number().int().min(15).default(60),
        price: z.string().optional(),
        active: z.boolean().default(true),
      })
    )
    .mutation(({ input }) => createService(input)),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        name: z.string().min(2).optional(),
        category: z.enum(["facial", "corporal"]).optional(),
        description: z.string().optional(),
        duration: z.number().int().min(15).optional(),
        price: z.string().optional(),
        active: z.boolean().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateService(id, data);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(({ input }) => deleteService(input.id)),
});

const appointmentsRouter = router({
  create: publicProcedure
    .input(
      z.object({
        serviceId: z.number().int(),
        clientName: z.string().min(2),
        clientEmail: z.string().email().optional(),
        clientPhone: z.string().min(8),
        appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        appointmentTime: z.string().regex(/^\d{2}:\d{2}$/),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await createAppointment(input);
      // Notify owner
      try {
        const service = await getServiceById(input.serviceId);
        const serviceName = service?.name ?? `Serviço #${input.serviceId}`;
        const dateBR = input.appointmentDate.split("-").reverse().join("/");
        const content = [
          "📋 Novo Agendamento — Savoir Estética & Massagem",
          "",
          `• Nome:        ${input.clientName}`,
          `• Serviço:     ${serviceName}`,
          `• Data:        ${dateBR}`,
          `• Horário:     ${input.appointmentTime}`,
          `• Telefone:    ${input.clientPhone}`,
          `• E-mail:      ${input.clientEmail ?? "não informado"}`,
          `• Observações: ${input.notes ?? "—"}`,
        ].join("\n");
        await notifyOwner({
          title: "Novo Agendamento — Savoir Estética",
          content,
        });
      } catch (e) {
        console.warn("[Notification] Failed to notify owner:", e);
      }
      return { success: true };
    }),
  list: protectedProcedure
    .input(z.object({ date: z.string().optional(), status: z.string().optional() }).optional())
    .query(({ input }) => getAppointments(input)),
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
      })
    )
    .mutation(({ input }) => updateAppointmentStatus(input.id, input.status)),
});

const galleryRouter = router({
  list: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(({ input }) => getActiveGallery(input?.category)),
  create: protectedProcedure
    .input(
      z.object({
        category: z.enum(["facial", "corporal", "outros"]).default("outros"),
        serviceId: z.number().int().optional(),
        beforeImageUrl: z.string().optional(),
        afterImageUrl: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(({ input }) => createGalleryItem(input)),
  uploadImage: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        base64Data: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64Data, "base64");
      const key = `gallery/${Date.now()}-${input.filename}`;
      const { url } = await storagePut(key, buffer, input.contentType);
      return { url };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(({ input }) => deleteGalleryItem(input.id)),
});

const testimonialsRouter = router({
  list: publicProcedure.query(() => getApprovedTestimonials()),
  listAll: protectedProcedure.query(() => getAllTestimonials()),
  create: publicProcedure
    .input(
      z.object({
        clientName: z.string().min(2),
        rating: z.number().int().min(1).max(5).default(5),
        comment: z.string().min(5),
        serviceId: z.number().int().optional(),
      })
    )
    .mutation(({ input }) => createTestimonial({ ...input, approved: false })),
  approve: protectedProcedure
    .input(z.object({ id: z.number().int(), approved: z.boolean() }))
    .mutation(({ input }) => updateTestimonialApproval(input.id, input.approved)),
});

const businessHoursRouter = router({
  list: publicProcedure.query(() => getBusinessHours()),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  services: servicesRouter,
  appointments: appointmentsRouter,
  gallery: galleryRouter,
  testimonials: testimonialsRouter,
  businessHours: businessHoursRouter,
});

export type AppRouter = typeof appRouter;
