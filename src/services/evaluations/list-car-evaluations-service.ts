import { EvaluationRepository } from "@/repositories/evaluation-repository";
import { Evaluation } from "@/domain/entities";

interface ListCarEvaluationsServiceRequest {
  carId: string;
}

interface ListCarEvaluationsServiceResponse {
  evaluations: Evaluation[];
}

export class ListCarEvaluationsService {
  constructor(private evaluationRepository: EvaluationRepository) {}

  async execute({
    carId,
  }: ListCarEvaluationsServiceRequest): Promise<ListCarEvaluationsServiceResponse> {
    const evaluations = await this.evaluationRepository.findManyByCarId(carId);

    return { evaluations };
  }
}
