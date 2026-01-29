import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { RegisterUserService } from "@/services/auth/register-user-service.js";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository.js";
import { UserAlreadyExistsError } from "@/services/errors.js";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    nome: z.string(),
    email: z.string().email(),
    senha: z.string().min(6),
    perfil: z.enum(["USER", "ADMIN"]).default("USER"),
  });

  const { nome, email, senha, perfil } = registerBodySchema.parse(request.body);

  try {
    const userRepository = new PrismaUserRepository();
    const registerUserService = new RegisterUserService(userRepository);

    await registerUserService.execute({
      nome,
      email,
      senha,
      perfil,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
