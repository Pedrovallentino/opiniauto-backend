import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJwt } from "../middlewares/verify-jwt";
import { create } from "../controllers/evaluations/create";
import { update } from "../controllers/evaluations/update";
import { deleteEvaluation } from "../controllers/evaluations/delete";
import { listByCar } from "../controllers/evaluations/list-by-car";

export async function evaluationsRoutes(app: FastifyInstance) {
  // Public routes
  app.withTypeProvider<ZodTypeProvider>().get("/cars/:carId/evaluations", {
    schema: {
      tags: ["Evaluations"],
      summary: "List evaluations by car",
      params: z.object({
        carId: z.string(),
      }),
      response: {
        200: z.object({
          evaluations: z.array(z.object({
            id: z.string(),
            notaDesempenho: z.number(),
            notaConforto: z.number(),
            notaConsumo: z.number(),
            notaDesign: z.number(),
            notaCustoBeneficio: z.number(),
            notaFinal: z.number(),
            comentario: z.string().nullable().optional(),
            criadoEm: z.date(),
            usuarioId: z.string(),
            carroId: z.string(),
            usuario: z.object({
              id: z.string(),
              nome: z.string(),
              email: z.string(),
            }).optional(),
          })),
        }),
      },
    },
  }, listByCar);

  // Authenticated routes
  app.register(async (authRoutes) => {
    authRoutes.addHook("onRequest", verifyJwt);

    authRoutes.withTypeProvider<ZodTypeProvider>().post("/cars/:carId/evaluations", {
      schema: {
        tags: ["Evaluations"],
        summary: "Create a new evaluation",
        security: [{ bearerAuth: [] }],
        params: z.object({
          carId: z.string(),
        }),
        body: z.object({
          notaDesempenho: z.number().min(0).max(10),
          notaConforto: z.number().min(0).max(10),
          notaConsumo: z.number().min(0).max(10),
          notaDesign: z.number().min(0).max(10),
          notaCustoBeneficio: z.number().min(0).max(10),
          comentario: z.string().optional(),
        }),
        response: {
          201: z.object({
            evaluation: z.object({
              id: z.string(),
              notaDesempenho: z.number(),
              notaConforto: z.number(),
              notaConsumo: z.number(),
              notaDesign: z.number(),
              notaCustoBeneficio: z.number(),
              notaFinal: z.number(),
              comentario: z.string().nullable().optional(),
              criadoEm: z.date(),
              usuarioId: z.string(),
              carroId: z.string(),
            }),
          }),
        },
      },
    }, create);

    authRoutes.withTypeProvider<ZodTypeProvider>().put("/evaluations/:id", {
      schema: {
        tags: ["Evaluations"],
        summary: "Update an evaluation",
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          notaDesempenho: z.number().min(0).max(10).optional(),
          notaConforto: z.number().min(0).max(10).optional(),
          notaConsumo: z.number().min(0).max(10).optional(),
          notaDesign: z.number().min(0).max(10).optional(),
          notaCustoBeneficio: z.number().min(0).max(10).optional(),
          comentario: z.string().optional(),
        }),
        response: {
          200: z.object({
            evaluation: z.object({
              id: z.string(),
              notaDesempenho: z.number(),
              notaConforto: z.number(),
              notaConsumo: z.number(),
              notaDesign: z.number(),
              notaCustoBeneficio: z.number(),
              notaFinal: z.number(),
              comentario: z.string().nullable().optional(),
              criadoEm: z.date(),
              usuarioId: z.string(),
              carroId: z.string(),
            }),
          }),
        },
      },
    }, update);

    authRoutes.withTypeProvider<ZodTypeProvider>().delete("/evaluations/:id", {
      schema: {
        tags: ["Evaluations"],
        summary: "Delete an evaluation",
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z.null(),
        },
      },
    }, deleteEvaluation);
  });
}
