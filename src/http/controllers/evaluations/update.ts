import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UpdateEvaluationService } from "../../../services/evaluations/update-evaluation-service.js";
import { PrismaEvaluationRepository } from "../../../repositories/prisma/prisma-evaluation-repository.js";
import { ResourceNotFoundError, ActionNotAllowedError } from "../../../services/errors.js";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateEvaluationParamsSchema = z.object({
    id: z.string(),
  });

  const updateEvaluationBodySchema = z.object({
    notaDesempenho: z.number().min(0).max(10).optional(),
    notaConforto: z.number().min(0).max(10).optional(),
    notaConsumo: z.number().min(0).max(10).optional(),
    notaDesign: z.number().min(0).max(10).optional(),
    notaCustoBeneficio: z.number().min(0).max(10).optional(),
    comentario: z.string().optional(),
  });

  const { id } = updateEvaluationParamsSchema.parse(request.params);
  const data = updateEvaluationBodySchema.parse(request.body);

  try {
    const evaluationRepository = new PrismaEvaluationRepository();
    const updateEvaluationService = new UpdateEvaluationService(
      evaluationRepository
    );

    const { evaluation } = await updateEvaluationService.execute({
      evaluationId: id,
      userId: request.user.sub,
      ...data,
    });

    return reply.status(200).send({ evaluation });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof ActionNotAllowedError) {
      return reply.status(403).send({ message: err.message });
    }
    throw err;
  }
}
