import { Evaluation } from '../domain/entities'

export interface CreateEvaluationData {
  userId: string
  carId: string
  notaDesempenho: number
  notaConforto: number
  notaConsumo: number
  notaDesign: number
  notaCustoBeneficio: number
  notaFinal: number
  comentario?: string
}

export interface EvaluationRepository {
  create(data: CreateEvaluationData): Promise<Evaluation>
  save(evaluation: Evaluation): Promise<Evaluation>
  delete(id: string): Promise<void>
  findById(id: string): Promise<Evaluation | null>
  findByUserAndCar(userId: string, carId: string): Promise<Evaluation | null>
  findManyByCarId(carId: string): Promise<Evaluation[]>
}

