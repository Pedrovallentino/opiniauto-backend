import { EvaluationRepository } from "@/repositories/evaluation-repository";
import { Evaluation } from "@/domain/entities";
import { ResourceNotFoundError, ActionNotAllowedError } from "../errors";

interface UpdateEvaluationServiceRequest {
  evaluationId: string;
  userId: string;
  notaDesempenho?: number;
  notaConforto?: number;
  notaConsumo?: number;
  notaDesign?: number;
  notaCustoBeneficio?: number;
  comentario?: string;
}

interface UpdateEvaluationServiceResponse {
  evaluation: Evaluation;
}

export class UpdateEvaluationService {
  constructor(private evaluationRepository: EvaluationRepository) {}

  async execute({
    evaluationId,
    userId,
    notaDesempenho,
    notaConforto,
    notaConsumo,
    notaDesign,
    notaCustoBeneficio,
    comentario,
  }: UpdateEvaluationServiceRequest): Promise<UpdateEvaluationServiceResponse> {
    const evaluation = await this.evaluationRepository.findById(evaluationId);

    if (!evaluation) {
      throw new ResourceNotFoundError();
    }

    if (evaluation.usuarioId !== userId) {
      throw new ActionNotAllowedError("You can only edit your own evaluations.")
    }

    // Merge new values with existing ones to recalculate final score
    const newNotaDesempenho = notaDesempenho ?? evaluation.notaDesempenho;
    const newNotaConforto = notaConforto ?? evaluation.notaConforto;
    const newNotaConsumo = notaConsumo ?? evaluation.notaConsumo;
    const newNotaDesign = notaDesign ?? evaluation.notaDesign;
    const newNotaCustoBeneficio =
      notaCustoBeneficio ?? evaluation.notaCustoBeneficio;

    const notaFinal =
      (newNotaDesempenho +
        newNotaConforto +
        newNotaConsumo +
        newNotaDesign +
        newNotaCustoBeneficio) /
      5;

    const updatedEvaluation = await this.evaluationRepository.save({
      ...evaluation,
      notaDesempenho: newNotaDesempenho,
      notaConforto: newNotaConforto,
      notaConsumo: newNotaConsumo,
      notaDesign: newNotaDesign,
      notaCustoBeneficio: newNotaCustoBeneficio,
      notaFinal,
      comentario: comentario ?? evaluation.comentario,
    });

    return { evaluation: updatedEvaluation };
  }
}
