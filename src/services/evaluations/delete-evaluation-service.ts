import { EvaluationRepository } from "@/repositories/evaluation-repository";
import { ResourceNotFoundError, ActionNotAllowedError } from "../errors";

interface DeleteEvaluationServiceRequest {
  evaluationId: string;
  userId: string;
}

export class DeleteEvaluationService {
  constructor(private evaluationRepository: EvaluationRepository) {}

  async execute({
    evaluationId,
    userId,
  }: DeleteEvaluationServiceRequest): Promise<void> {
    const evaluation = await this.evaluationRepository.findById(evaluationId);

    if (!evaluation) {
      throw new ResourceNotFoundError();
    }

    if (evaluation.usuarioId !== userId) {
      throw new ActionNotAllowedError("You can only delete your own evaluations.")
    }

    await this.evaluationRepository.delete(evaluationId);
  }
}
