/**
 * @module VerifyJwtMiddleware
 * @description Middleware para proteção de rotas privadas. Verifica a presença e validade
 * do token JWT no cabeçalho Authorization da requisição.
 * 
 * @requires fastify - Tipos de Request e Reply.
 */

import { FastifyReply, FastifyRequest } from 'fastify'

/**
 * @function verifyJwt
 * @description Intercepta a requisição para validar o token JWT.
 * Se inválido ou ausente, retorna erro 401 (Unauthorized).
 * 
 * @param {FastifyRequest} request - Objeto da requisição.
 * @param {FastifyReply} reply - Objeto da resposta.
 */
export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    reply.status(401).send({ message: 'Token inválido ou ausente' })
  }
}

