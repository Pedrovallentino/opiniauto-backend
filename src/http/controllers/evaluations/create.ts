import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CreateEvaluationService } from "@/services/evaluations/create-evaluation-service.js";
import { PrismaEvaluationRepository } from "@/repositories/prisma/prisma-evaluation-repository.js";
import { PrismaCarRepository } from "@/repositories/prisma/prisma-car-repository.js";
import {
  ResourceNotFoundError,
  ActionNotAllowedError,
  ConflictError,
} from "@/services/errors";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createEvaluationParamsSchema = z.object({
    carId: z.string(),
  });

  const createEvaluationBodySchema = z.object({
    notaDesempenho: z.number().min(0).max(10),
    notaConforto: z.number().min(0).max(10),
    notaConsumo: z.number().min(0).max(10),
    notaDesign: z.number().min(0).max(10),
    notaCustoBeneficio: z.number().min(0).max(10),
    comentario: z.string().optional(),
  });

  const { carId } = createEvaluationParamsSchema.parse(request.params);
  const {
    notaDesempenho,
    notaConforto,
    notaConsumo,
    notaDesign,
    notaCustoBeneficio,
    comentario,
  } = createEvaluationBodySchema.parse(request.body);

  try {
    const evaluationRepository = new PrismaEvaluationRepository();
    const carRepository = new PrismaCarRepository();
    const createEvaluationService = new CreateEvaluationService(
      evaluationRepository,
      carRepository
    );

    const { evaluation } = await createEvaluationService.execute({
      userId: request.user.sub,
      carId,
      notaDesempenho,
      notaConforto,
      notaConsumo,
      notaDesign,
      notaCustoBeneficio,
      comentario,
    });

    return reply.status(201).send({ evaluation });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof ActionNotAllowedError) {
      return reply.status(403).send({ message: err.message });
    }
    if (err instanceof ConflictError) {
      return reply.status(409).send({ message: err.message });
    }
    throw err;
  }
}
