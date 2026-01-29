import { prisma } from '../../infra/database/prisma/client.js'
import {
  CreateEvaluationData,
  EvaluationRepository,
} from '../evaluation-repository.js'
import { Evaluation } from '@/domain/entities.js'

export class PrismaEvaluationRepository implements EvaluationRepository {
  async create(data: CreateEvaluationData) {
    return prisma.avaliacao.create({
      data: {
        usuarioId: data.userId,
        carroId: data.carId,
        notaDesempenho: data.notaDesempenho,
        notaConforto: data.notaConforto,
        notaConsumo: data.notaConsumo,
        notaDesign: data.notaDesign,
        notaCustoBeneficio: data.notaCustoBeneficio,
        notaFinal: data.notaFinal,
        comentario: data.comentario ?? null,
      },
    })
  }

  async save(evaluation: Evaluation) {
    return prisma.avaliacao.update({
      where: { id: evaluation.id },
      data: evaluation,
    })
  }

  async delete(id: string) {
    await prisma.avaliacao.delete({
      where: { id },
    })
  }

  async findById(id: string) {
    return prisma.avaliacao.findUnique({
      where: { id },
    })
  }

  async findByUserAndCar(userId: string, carId: string) {
    return prisma.avaliacao.findUnique({
      where: {
        usuarioId_carroId: {
          usuarioId: userId,
          carroId: carId,
        },
      },
    })
  }

  async findManyByCarId(carId: string) {
    return prisma.avaliacao.findMany({
      where: { carroId: carId },
      orderBy: { criadoEm: 'desc' },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        }
      }
    })
  }
}

