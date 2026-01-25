import { Evaluation } from '../../domain/entities'
import {
  CreateEvaluationData,
  EvaluationRepository,
} from '../evaluation-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryEvaluationRepository implements EvaluationRepository {
  public items: Evaluation[] = []

  async create(data: CreateEvaluationData) {
    const evaluation: Evaluation = {
      id: randomUUID(),
      usuarioId: data.userId,
      carroId: data.carId,
      notaDesempenho: data.notaDesempenho,
      notaConforto: data.notaConforto,
      notaConsumo: data.notaConsumo,
      notaDesign: data.notaDesign,
      notaCustoBeneficio: data.notaCustoBeneficio,
      notaFinal: data.notaFinal,
      comentario: data.comentario ?? '',
      criadoEm: new Date(),
    }

    this.items.push(evaluation)

    return evaluation
  }

  async save(evaluation: Evaluation) {
    const index = this.items.findIndex((item) => item.id === evaluation.id)

    if (index >= 0) {
      this.items[index] = evaluation
    } else {
      this.items.push(evaluation)
    }

    return evaluation
  }

  async delete(id: string) {
    const index = this.items.findIndex((item) => item.id === id)

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async findById(id: string) {
    const evaluation = this.items.find((item) => item.id === id)

    if (!evaluation) {
      return null
    }

    return evaluation
  }

  async findByUserAndCar(userId: string, carId: string) {
    const evaluation = this.items.find(
      (item) => item.usuarioId === userId && item.carroId === carId,
    )

    if (!evaluation) {
      return null
    }

    return evaluation
  }

  async findManyByCarId(carId: string) {
    return this.items.filter((item) => item.carroId === carId)
  }

  async listByCar(carId: string) {
    return this.items.filter((item) => item.carroId === carId)
  }

  async listByUser(userId: string) {
    return this.items.filter((item) => item.usuarioId === userId)
  }

  async listAll() {
    return this.items
  }
}
