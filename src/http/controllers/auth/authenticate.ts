/**
 * @module AuthenticateController
 * @description Controlador responsável por gerenciar a requisição de login.
 * Orquestra a validação da entrada, chamada ao serviço de autenticação e resposta HTTP.
 * 
 * @requires fastify
 * @requires zod
 */

import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AuthenticateUserService } from "../../../services/auth/authenticate-user-service.js";
import { PrismaUserRepository } from "../../../repositories/prisma/prisma-user-repository.js";
import { PrismaAuthRepository } from "../../../repositories/prisma/prisma-auth-repository.js";
import { InvalidCredentialsError } from "../../../services/errors.js";

/**
 * @function authenticate
 * @description Manipulador da rota de login (POST /sessions).
 * 
 * Fluxo:
 * 1. Valida o corpo da requisição (email, senha).
 * 2. Instancia repositórios e serviço.
 * 3. Executa a autenticação.
 * 4. Gera o token JWT (Access Token).
 * 5. Define o Refresh Token em um cookie seguro (HttpOnly).
 * 6. Retorna o token e dados do usuário.
 * 
 * @param {FastifyRequest} request - Requisição HTTP.
 * @param {FastifyReply} reply - Resposta HTTP.
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    senha: z.string().min(6),
  });

  const { email, senha } = authenticateBodySchema.parse(request.body);

  try {
    const userRepository = new PrismaUserRepository();
    const authRepository = new PrismaAuthRepository();
    const authenticateUserService = new AuthenticateUserService(
      userRepository,
      authRepository
    );

    const { user, refreshToken } = await authenticateUserService.execute({
      email,
      senha,
      ip: request.ip,
      userAgent: request.headers["user-agent"],
    });

    const token = await reply.jwtSign(
      {
        sub: user.id,
        role: user.perfil,
      }
    );

    reply.setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })

    return reply.status(200).send({
      token,
      user,
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
