import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { register } from "../controllers/auth/register";
import { authenticate } from "../controllers/auth/authenticate";
import { refresh } from "../controllers/auth/refresh";

export async function authRoutes(app: FastifyInstance) {
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
