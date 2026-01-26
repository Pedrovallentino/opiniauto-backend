import { describe, expect, it } from 'vitest'
import { InMemoryEvaluationRepository } from '../../repositories/in-memory/in-memory-evaluation-repository'
import { DeleteEvaluationService } from './delete-evaluation-service'
import { ResourceNotFoundError, ActionNotAllowedError } from '../errors'

describe('Delete Evaluation Service', () => {
  it('should be able to delete an evaluation', async () => {
    const evaluationRepository = new InMemoryEvaluationRepository()
    const sut = new DeleteEvaluationService(evaluationRepository)

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

    await sut.execute({
      evaluationId: evaluation.id,
      userId: 'user-1',
    })

    const deletedEvaluation = await evaluationRepository.findById(evaluation.id)
    expect(deletedEvaluation).toBeNull()
  })

  it('should not be able to delete another users evaluation', async () => {
    const evaluationRepository = new InMemoryEvaluationRepository()
    const sut = new DeleteEvaluationService(evaluationRepository)

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
      }),
    ).rejects.toBeInstanceOf(ActionNotAllowedError)
  })

  it('should not be able to delete a non-existent evaluation', async () => {
    const evaluationRepository = new InMemoryEvaluationRepository()
    const sut = new DeleteEvaluationService(evaluationRepository)

    await expect(() =>
      sut.execute({
        evaluationId: 'non-existent-id',
        userId: 'user-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
