/**
 * @module AuthRoutes
 * @description Definição das rotas de autenticação e gestão de usuários.
 * Utiliza Zod para validação de esquemas (body e response).
 * 
 * @requires fastify - Instância e tipos.
 * @requires fastify-type-provider-zod - Tipagem e validação.
 * @requires zod - Definição de esquemas.
 */

import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { register } from "../controllers/auth/register.js";
import { authenticate } from "../controllers/auth/authenticate.js";
import { refresh } from "../controllers/auth/refresh.js";

/**
 * @function authRoutes
 * @description Plugin de rotas de autenticação.
 * 
 * Rotas:
 * - POST /users: Cadastro de novos usuários (Público).
 * - POST /sessions: Autenticação de usuários (Login) (Público).
 * - PATCH /token/refresh: Atualização do token de acesso via refresh token (Público).
 * 
 * @param {FastifyInstance} app - Instância do servidor Fastify.
 */
export async function authRoutes(app: FastifyInstance) {
  // Rota de Cadastro de Usuário
  app.withTypeProvider<ZodTypeProvider>().post("/users", {
    schema: {
      tags: ["Auth"],
      summary: "Create a new user",
      body: z.object({
        nome: z.string(),
        email: z.string().email(),
        senha: z.string().min(6),
        perfil: z.enum(["USER", "ADMIN"]).default("USER"),
      }),
      response: {
        201: z.null(),
      },
    },
  }, register);

  // Rota de Login (Autenticação)
  app.withTypeProvider<ZodTypeProvider>().post("/sessions", {
    schema: {
      tags: ["Auth"],
      summary: "Authenticate a user",
      body: z.object({
        email: z.string().email(),
        senha: z.string().min(6),
      }),
      response: {
        200: z.object({
          token: z.string(),
          user: z.object({
            id: z.string(),
            nome: z.string(),
            email: z.string().email(),
            perfil: z.enum(["USER", "ADMIN"]),
          }),
        }),
      },
    },
  }, authenticate);

  // Rota de Refresh Token
  app.withTypeProvider<ZodTypeProvider>().patch("/token/refresh", {
    schema: {
      tags: ["Auth"],
      summary: "Refresh access token",
      response: {
        200: z.object({
          token: z.string(),
        }),
      },
    },
  }, refresh);
}
