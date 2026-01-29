import { EvaluationRepository } from "../../repositories/evaluation-repository.js";
import { Evaluation } from "../../domain/entities.js";

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
