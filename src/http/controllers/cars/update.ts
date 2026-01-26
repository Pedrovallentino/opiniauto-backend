import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UpdateCarService } from "@/services/cars/update-car-service";
import { PrismaCarRepository } from "@/repositories/prisma/prisma-car-repository";
import { ResourceNotFoundError } from "@/services/errors";

/**
 * Updates a car's details.
 * Access restricted to administrators.
 */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateCarParamsSchema = z.object({
    id: z.string(),
  });

  const updateCarBodySchema = z.object({
    marca: z.string().optional(),
    modelo: z.string().optional(),
    ano: z.number().int().optional(),
    categoria: z.string().optional(),
    tipoMotorizacao: z.string().optional(),
    imagem: z.string().url().optional(),
  });

  const { id } = updateCarParamsSchema.parse(request.params);
  const data = updateCarBodySchema.parse(request.body);

  try {
    const carRepository = new PrismaCarRepository();
    const updateCarService = new UpdateCarService(carRepository);

    const { car } = await updateCarService.execute({
      carId: id,
      ...data,
    });

    return reply.status(200).send({ car });
  } catch (err) {
    console.error('Update Controller Error:', err);
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
