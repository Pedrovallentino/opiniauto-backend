import { prisma } from '../../infra/database/prisma/client'
import { CarRepository, CreateCarData, UpdateCarData } from '../car-repository'

export class PrismaCarRepository implements CarRepository {
  async create(data: CreateCarData) {
    return prisma.carro.create({
      data,
    })
  }

  async update(id: string, data: UpdateCarData) {
    return prisma.carro.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    await prisma.carro.delete({
      where: { id },
    })
  }

  async findById(id: string) {
    return prisma.carro.findUnique({
      where: { id },
    })
  }

  async listActive() {
    return prisma.carro.findMany({
      where: { status: 'ATIVO' },
      orderBy: { criadoEm: 'desc' },
    })
  }

  async listAll() {
    return prisma.carro.findMany({
      orderBy: { criadoEm: 'desc' },
    })
  }
}

