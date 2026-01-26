import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { DeleteEvaluationService } from "@/services/evaluations/delete-evaluation-service";
import { PrismaEvaluationRepository } from "@/repositories/prisma/prisma-evaluation-repository";
import { ResourceNotFoundError, ActionNotAllowedError } from "@/services/errors";

export async function deleteEvaluation(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const deleteEvaluationParamsSchema = z.object({
    id: z.string(),
  });

  const { id } = deleteEvaluationParamsSchema.parse(request.params);

  try {
    const evaluationRepository = new PrismaEvaluationRepository();
    const deleteEvaluationService = new DeleteEvaluationService(
      evaluationRepository
    );

    await deleteEvaluationService.execute({
      evaluationId: id,
      userId: request.user.sub,
    });

    return reply.status(204).send();
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
