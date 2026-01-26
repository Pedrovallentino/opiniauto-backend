import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodSchema } from 'zod'

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = schema.safeParse(request.body)

    if (!parseResult.success) {
      reply.status(400).send({
        message: 'Dados inválidos',
        errors: parseResult.error.flatten(),
      })
      return
    }

    request.body = parseResult.data as unknown
  }
}

