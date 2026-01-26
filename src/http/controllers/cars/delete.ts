import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { DeleteCarService } from "@/services/cars/delete-car-service";
import { PrismaCarRepository } from "@/repositories/prisma/prisma-car-repository";
import { ResourceNotFoundError, ForbiddenError } from "@/services/errors";

/**
 * Deletes a car.
 * Access restricted to administrators.
 */
export async function deleteCar(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const deleteCarParamsSchema = z.object({
    id: z.string(),
  });

  const { id } = deleteCarParamsSchema.parse(request.params);

  try {
    const carRepository = new PrismaCarRepository();
    const deleteCarService = new DeleteCarService(carRepository);

    await deleteCarService.execute({
      carId: id,
      currentUserPerfil: request.user.role,
    });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof ForbiddenError) {
      return reply.status(403).send({ message: err.message });
    }
    throw err;
  }
}
