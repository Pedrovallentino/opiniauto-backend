import { FastifyReply, FastifyRequest } from "fastify";
import { ListAllCarsService } from "@/services/cars/list-all-cars-service";
import { PrismaCarRepository } from "@/repositories/prisma/prisma-car-repository";

/**
 * Lists all cars, including inactive ones.
 * Access restricted to administrators.
 */
export async function listAll(request: FastifyRequest, reply: FastifyReply) {
  const carRepository = new PrismaCarRepository();
  const listAllCarsService = new ListAllCarsService(carRepository);

  const { cars } = await listAllCarsService.execute();

  return reply.status(200).send({ cars });
}
