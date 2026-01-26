import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CreateCarService } from "@/services/cars/create-car-service";
import { PrismaCarRepository } from "@/repositories/prisma/prisma-car-repository";
import { ConflictError } from "@/services/errors";

/**
 * Creates a new car.
 * Access restricted to administrators.
 */
export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCarBodySchema = z.object({
    marca: z.string(),
    modelo: z.string(),
    ano: z.number().int(),
    categoria: z.string(),
    tipoMotorizacao: z.string(),
    imagem: z.string().url(),
  });

  const { marca, modelo, ano, categoria, tipoMotorizacao, imagem } =
    createCarBodySchema.parse(request.body);

  try {
    const carRepository = new PrismaCarRepository();
    const createCarService = new CreateCarService(carRepository);

    const { car } = await createCarService.execute({
      marca,
      modelo,
      ano,
      categoria,
      tipoMotorizacao,
      imagem,
    });

    return reply.status(201).send({ car });
  } catch (err) {
    if (err instanceof ConflictError) {
      return reply.status(409).send({ message: err.message });
    }
    throw err;
  }
}
