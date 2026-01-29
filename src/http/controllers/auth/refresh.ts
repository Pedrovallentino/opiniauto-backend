import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaAuthRepository } from "@/repositories/prisma/prisma-auth-repository.js";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const refreshToken = request.cookies.refreshToken;

  if (!refreshToken) {
    return reply.status(401).send({ message: "Refresh token not found." });
  }

  const authRepository = new PrismaAuthRepository();
  const storedToken = await authRepository.findRefreshToken(refreshToken);

  if (!storedToken) {
    return reply.status(401).send({ message: "Invalid refresh token." });
  }

  if (storedToken.expiresAt < new Date()) {
    await authRepository.revokeRefreshToken(storedToken.id);
    return reply.status(401).send({ message: "Refresh token expired." });
  }

  // Se o token for válido, gerar novo JWT
  // Precisamos buscar o usuário para saber a role
  // Aqui assumimos que o token tem o usuarioId
  // Idealmente, deveríamos ter um UserService para buscar o usuário
  // Mas para simplificar, vamos assumir que apenas gerar um novo JWT com o ID é suficiente
  // PORÉM, o payload do JWT precisa da ROLE.
  // Então precisamos buscar o usuário.

  // TODO: Buscar usuário para obter a role atualizada
  // Por enquanto, vamos retornar erro 501 Not Implemented ou implementar busca simples
  
  // Vamos implementar busca simples importando PrismaUserRepository
  const { PrismaUserRepository } = await import("@/repositories/prisma/prisma-user-repository");
  const userRepository = new PrismaUserRepository();
  const user = await userRepository.findById(storedToken.usuarioId);

  if (!user) {
    return reply.status(401).send({ message: "User not found." });
  }

  const token = await reply.jwtSign(
    {
      sub: user.id,
      role: user.perfil,
    }
  );

  // Opcional: Rotacionar o refresh token (gerar um novo e invalidar o anterior)
  // Para simplificar, mantemos o mesmo até expirar

  return reply.status(200).send({
    token,
  });
}
