import { FastifyReply, FastifyRequest } from 'fastify'

type Perfil = 'USER' | 'ADMIN'

export function verifyUserRole(required: Perfil) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch {
      reply.status(401).send({ message: 'Token inválido ou ausente' })
      return
    }

    const user = request.user

    if (!user || user.role !== required) {
      reply.status(403).send({ message: 'Permissão negada' })
      return
    }
  }
}

