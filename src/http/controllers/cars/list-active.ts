import { FastifyReply, FastifyRequest } from "fastify";
import { ListActiveCarsService } from "@/services/cars/list-active-cars-service";
import { PrismaCarRepository } from "@/repositories/prisma/prisma-car-repository";

/**
 * Lists only cars with 'ATIVO' status.
 * Public access.
 */
export async function listActive(request: FastifyRequest, reply: FastifyReply) {
  const carRepository = new PrismaCarRepository();
  const listActiveCarsService = new ListActiveCarsService(carRepository);

  const { cars } = await listActiveCarsService.execute();

  return reply.status(200).send({ cars });
}
