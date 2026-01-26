import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ListCarEvaluationsService } from "@/services/evaluations/list-car-evaluations-service";
import { PrismaEvaluationRepository } from "@/repositories/prisma/prisma-evaluation-repository";

export async function listByCar(request: FastifyRequest, reply: FastifyReply) {
  const listByCarParamsSchema = z.object({
    carId: z.string(),
  });

  const { carId } = listByCarParamsSchema.parse(request.params);

  const evaluationRepository = new PrismaEvaluationRepository();
  const listCarEvaluationsService = new ListCarEvaluationsService(
    evaluationRepository
  );

  const { evaluations } = await listCarEvaluationsService.execute({
    carId,
  });

  return reply.status(200).send({ evaluations });
}
