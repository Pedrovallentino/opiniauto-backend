import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GetCarMetricsService } from "@/services/cars/get-car-metrics-service.js";
import { PrismaCarRepository } from "@/repositories/prisma/prisma-car-repository.js";
import { PrismaEvaluationRepository } from "@/repositories/prisma/prisma-evaluation-repository.js";
import { ResourceNotFoundError } from "@/services/errors.js";

export async function getMetrics(request: FastifyRequest, reply: FastifyReply) {
  const getMetricsParamsSchema = z.object({
    id: z.string(),
  });

  const { id } = getMetricsParamsSchema.parse(request.params);

  try {
    const carRepository = new PrismaCarRepository();
    const evaluationRepository = new PrismaEvaluationRepository();
    const getCarMetricsService = new GetCarMetricsService(
      carRepository,
      evaluationRepository
    );

    const { metrics } = await getCarMetricsService.execute({
      carId: id,
    });

    return reply.status(200).send({ metrics });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
