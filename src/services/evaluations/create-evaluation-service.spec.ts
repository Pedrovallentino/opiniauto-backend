import { describe, expect, it } from 'vitest'
import { InMemoryEvaluationRepository } from '../../repositories/in-memory/in-memory-evaluation-repository.js'
import { InMemoryCarRepository } from '../../repositories/in-memory/in-memory-car-repository.js'
import { CreateEvaluationService } from './create-evaluation-service.js'
import { ResourceNotFoundError, ConflictError } from '../errors.js'

describe('Create Evaluation Service', () => {
  it('should be able to create an evaluation', async () => {
    const evaluationRepository = new InMemoryEvaluationRepository()
    const carRepository = new InMemoryCarRepository()
    const sut = new CreateEvaluationService(evaluationRepository, carRepository)

    const car = await carRepository.create({
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2024,
      categoria: 'Sedan',
      tipoMotorizacao: 'Híbrido',
      imagem: 'test.jpg',
    })

    const { evaluation } = await sut.execute({
      userId: 'user-1',
      carId: car.id,
      notaDesempenho: 5,
      notaConforto: 4,
      notaConsumo: 5,
      notaDesign: 4,
      notaCustoBeneficio: 5,
      comentario: 'Great car!',
    })

    expect(evaluation.id).toEqual(expect.any(String))
    expect(evaluation.notaFinal).toBe(4.6)
  })

  it('should not be able to evaluate a non-existent car', async () => {
    const evaluationRepository = new InMemoryEvaluationRepository()
    const carRepository = new InMemoryCarRepository()
    const sut = new CreateEvaluationService(evaluationRepository, carRepository)

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        carId: 'non-existent-id',
        notaDesempenho: 5,
        notaConforto: 5,
        notaConsumo: 5,
        notaDesign: 5,
        notaCustoBeneficio: 5,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to evaluate the same car twice', async () => {
    const evaluationRepository = new InMemoryEvaluationRepository()
    const carRepository = new InMemoryCarRepository()
    const sut = new CreateEvaluationService(evaluationRepository, carRepository)

    const car = await carRepository.create({
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2024,
      categoria: 'Sedan',
      tipoMotorizacao: 'Híbrido',
      imagem: 'test.jpg',
    })

    await sut.execute({
      userId: 'user-1',
      carId: car.id,
      notaDesempenho: 5,
      notaConforto: 5,
      notaConsumo: 5,
      notaDesign: 5,
      notaCustoBeneficio: 5,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        carId: car.id,
        notaDesempenho: 4,
        notaConforto: 4,
        notaConsumo: 4,
        notaDesign: 4,
        notaCustoBeneficio: 4,
      }),
    ).rejects.toBeInstanceOf(ConflictError)
  })
})
