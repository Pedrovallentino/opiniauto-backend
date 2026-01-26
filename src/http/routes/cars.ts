/**
 * @module CarsRoutes
 * @description Rotas para gerenciamento de carros.
 * Contém rotas públicas para listagem e detalhes, e rotas administrativas protegidas
 * para operações de criação, atualização e remoção.
 * 
 * @requires fastify
 * @requires fastify-type-provider-zod
 * @requires zod
 */

import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJwt } from "../middlewares/verify-jwt";
import { verifyUserRole } from "../middlewares/verify-role";
import { create } from "../controllers/cars/create";
import { update } from "../controllers/cars/update";
import { toggleStatus } from "../controllers/cars/toggle-status";
import { listActive } from "../controllers/cars/list-active";
import { listAll } from "../controllers/cars/list-all";
import { deleteCar } from "../controllers/cars/delete";
import { getDetails } from "../controllers/cars/get-details";
import { getMetrics } from "../controllers/cars/get-metrics";

/**
 * @function carsRoutes
 * @description Plugin de rotas de carros.
 * 
 * Rotas Públicas:
 * - GET /cars: Lista carros ativos.
 * - GET /cars/:id: Detalhes de um carro.
 * - GET /cars/:id/metrics: Métricas de avaliação de um carro.
 * 
 * Rotas Administrativas (Requer JWT + Role ADMIN):
 * - GET /cars/all: Lista todos os carros (incluindo inativos).
 * - POST /cars: Cria um novo carro.
 * - PUT /cars/:id: Atualiza dados de um carro.
 * - PATCH /cars/:id/status: Alterna status (ATIVO/INATIVO).
 * - DELETE /cars/:id: Remove um carro.
 * 
 * @param {FastifyInstance} app - Instância do servidor Fastify.
 */
export async function carsRoutes(app: FastifyInstance) {
  // Public routes
  app.withTypeProvider<ZodTypeProvider>().get("/cars", {
    schema: {
      tags: ["Cars"],
      summary: "List active cars",
      response: {
        200: z.object({
          cars: z.array(z.object({
            id: z.string(),
            marca: z.string(),
            modelo: z.string(),
            ano: z.number(),
            categoria: z.string(),
            tipoMotorizacao: z.string(),
            status: z.string(),
            imagem: z.string(),
            criadoEm: z.date(),
          })),
        }),
      },
    },
  }, listActive);

  app.withTypeProvider<ZodTypeProvider>().get("/cars/:id", {
    schema: {
      tags: ["Cars"],
      summary: "Get car details",
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.object({
          car: z.object({
            id: z.string(),
            marca: z.string(),
            modelo: z.string(),
            ano: z.number(),
            categoria: z.string(),
            tipoMotorizacao: z.string(),
            status: z.string(),
            imagem: z.string(),
            criadoEm: z.date(),
          }),
        }),
      },
    },
  }, getDetails);

  app.withTypeProvider<ZodTypeProvider>().get("/cars/:id/metrics", {
    schema: {
      tags: ["Cars"],
      summary: "Get car metrics",
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.object({
          metrics: z.object({
            averageDesempenho: z.number(),
            averageConforto: z.number(),
            averageConsumo: z.number(),
            averageDesign: z.number(),
            averageCustoBeneficio: z.number(),
            averageFinal: z.number(),
            totalEvaluations: z.number(),
          }),
        }),
      },
    },
  }, getMetrics);

  // Admin routes
  app.register(async (adminRoutes) => {
    adminRoutes.addHook("onRequest", verifyJwt);
    adminRoutes.addHook("onRequest", verifyUserRole("ADMIN"));

    adminRoutes.withTypeProvider<ZodTypeProvider>().get("/cars/all", {
      schema: {
        tags: ["Cars"],
        summary: "List all cars (Admin)",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            cars: z.array(z.object({
              id: z.string(),
              marca: z.string(),
              modelo: z.string(),
              ano: z.number(),
              categoria: z.string(),
              tipoMotorizacao: z.string(),
              status: z.string(),
              imagem: z.string(),
              criadoEm: z.date(),
            })),
          }),
        },
      },
    }, listAll);

    adminRoutes.withTypeProvider<ZodTypeProvider>().post("/cars", {
      schema: {
        tags: ["Cars"],
        summary: "Create a new car",
        security: [{ bearerAuth: [] }],
        body: z.object({
          marca: z.string(),
          modelo: z.string(),
          ano: z.number().int(),
          categoria: z.string(),
          tipoMotorizacao: z.string(),
          imagem: z.string().url(),
        }),
        response: {
          201: z.object({
            car: z.object({
              id: z.string(),
              marca: z.string(),
              modelo: z.string(),
              ano: z.number(),
              categoria: z.string(),
              tipoMotorizacao: z.string(),
              status: z.string(),
              imagem: z.string(),
              criadoEm: z.date(),
            }),
          }),
        },
      },
    }, create);

    adminRoutes.withTypeProvider<ZodTypeProvider>().put("/cars/:id", {
      schema: {
        tags: ["Cars"],
        summary: "Update a car",
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          marca: z.string().optional(),
          modelo: z.string().optional(),
          ano: z.number().int().optional(),
          categoria: z.string().optional(),
          tipoMotorizacao: z.string().optional(),
          imagem: z.string().url().optional(),
        }),
        response: {
          200: z.object({
            car: z.object({
              id: z.string(),
              marca: z.string(),
              modelo: z.string(),
              ano: z.number(),
              categoria: z.string(),
              tipoMotorizacao: z.string(),
              status: z.string(),
              imagem: z.string(),
              criadoEm: z.date(),
            }),
          }),
        },
      },
    }, update);

    adminRoutes.withTypeProvider<ZodTypeProvider>().patch("/cars/:id/status", {
      schema: {
        tags: ["Cars"],
        summary: "Toggle car status",
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            car: z.object({
              id: z.string(),
              marca: z.string(),
              modelo: z.string(),
              ano: z.number(),
              categoria: z.string(),
              tipoMotorizacao: z.string(),
              status: z.string(),
              imagem: z.string(),
              criadoEm: z.date(),
            }),
          }),
        },
      },
    }, toggleStatus);

    adminRoutes.withTypeProvider<ZodTypeProvider>().delete("/cars/:id", {
      schema: {
        tags: ["Cars"],
        summary: "Delete a car",
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z.null(),
        },
      },
    }, deleteCar);
  });
}
