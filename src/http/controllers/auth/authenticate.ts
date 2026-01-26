import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AuthenticateUserService } from "@/services/auth/authenticate-user-service";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { PrismaAuthRepository } from "@/repositories/prisma/prisma-auth-repository";
import { InvalidCredentialsError } from "@/services/errors";

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
