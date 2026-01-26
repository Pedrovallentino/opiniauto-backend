import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ToggleCarStatusService } from "@/services/cars/toggle-car-status-service";
import { PrismaCarRepository } from "@/repositories/prisma/prisma-car-repository";
import { ResourceNotFoundError } from "@/services/errors";

/**
 * Toggles a car's status (ATIVO/INATIVO).
 * Access restricted to administrators.
 */
export async function toggleStatus(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const toggleStatusParamsSchema = z.object({
    id: z.string(),
  });

  const { id } = toggleStatusParamsSchema.parse(request.params);

  try {
    const carRepository = new PrismaCarRepository();
    const toggleCarStatusService = new ToggleCarStatusService(carRepository);

    const { car } = await toggleCarStatusService.execute({
      carId: id,
    });

    return reply.status(200).send({ car });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
