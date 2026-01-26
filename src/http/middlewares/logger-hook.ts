import { FastifyRequest, FastifyReply } from 'fastify'

export async function loggerHook(request: FastifyRequest, reply: FastifyReply) {
  const start = Date.now()

  reply.header('x-request-start', start.toString())

  request.log.info({
    method: request.method,
    url: request.url,
  })
}

