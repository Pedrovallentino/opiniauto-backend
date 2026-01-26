import { describe, expect, it } from 'vitest'
import { InMemoryEvaluationRepository } from '../../repositories/in-memory/in-memory-evaluation-repository'
import { UpdateEvaluationService } from './update-evaluation-service'
import { ResourceNotFoundError, ActionNotAllowedError } from '../errors'

describe('Update Evaluation Service', () => {
  it('should be able to update an evaluation', async () => {
    const evaluationRepository = new InMemoryEvaluationRepository()
    const sut = new UpdateEvaluationService(evaluationRepository)

    const evaluation = await evaluationRepository.create({
      userId: 'user-1',
      carroId: 'car-1',
      notaDesempenho: 5,
      notaConforto: 5,
      notaConsumo: 5,
      notaDesign: 5,
      notaCustoBeneficio: 5,
      notaFinal: 5,
      comentario: 'Good',
    })

    const { evaluation: updatedEvaluation } = await sut.execute({
      evaluationId: evaluation.id,
      userId: 'user-1',
      notaDesempenho: 3,
    })

    expect(updatedEvaluation.notaDesempenho).toBe(3)
    // 4 * 5 + 3 = 23 / 5 = 4.6
    expect(updatedEvaluation.notaFinal).toBe(4.6)
  })

  it('should not be able to update another users evaluation', async () => {
    const evaluationRepository = new InMemoryEvaluationRepository()
    const sut = new UpdateEvaluationService(evaluationRepository)

    const evaluation = await evaluationRepository.create({
      userId: 'user-1',
      carroId: 'car-1',
      notaDesempenho: 5,
      notaConforto: 5,
      notaConsumo: 5,
      notaDesign: 5,
      notaCustoBeneficio: 5,
      notaFinal: 5,
      comentario: 'Good',
    })

    await expect(() =>
      sut.execute({
        evaluationId: evaluation.id,
        userId: 'user-2',
        notaDesempenho: 3,
      }),
    ).rejects.toBeInstanceOf(ActionNotAllowedError)
  })

  it('should not be able to update a non-existent evaluation', async () => {
    const evaluationRepository = new InMemoryEvaluationRepository()
    const sut = new UpdateEvaluationService(evaluationRepository)

    await expect(() =>
      sut.execute({
        evaluationId: 'non-existent-id',
        userId: 'user-1',
        notaDesempenho: 3,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
