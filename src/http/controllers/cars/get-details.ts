import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GetCarDetailsService } from "../../../services/cars/get-car-details-service.js";
import { PrismaCarRepository } from "../../../repositories/prisma/prisma-car-repository.js";
import { ResourceNotFoundError } from "../../../services/errors.js";

/**
 * Retrieves details of a specific car by ID.
 * Public access.
 */
export async function getDetails(request: FastifyRequest, reply: FastifyReply) {
  const getDetailsParamsSchema = z.object({
    id: z.string(),
  });

  const { id } = getDetailsParamsSchema.parse(request.params);

  try {
    const carRepository = new PrismaCarRepository();
    const getCarDetailsService = new GetCarDetailsService(carRepository);

    const { car } = await getCarDetailsService.execute({
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
