import { EvaluationRepository } from "../../repositories/evaluation-repository.js";
import { CarRepository } from "../../repositories/car-repository.js";
import { Evaluation } from "../../domain/entities.js";
import { ResourceNotFoundError, ConflictError } from "../errors.js";

interface CreateEvaluationServiceRequest {
  userId: string;
  carId: string;
  notaDesempenho: number;
  notaConforto: number;
  notaConsumo: number;
  notaDesign: number;
  notaCustoBeneficio: number;
  comentario?: string;
}

interface CreateEvaluationServiceResponse {
  evaluation: Evaluation;
}

export class CreateEvaluationService {
  constructor(
    private evaluationRepository: EvaluationRepository,
    private carRepository: CarRepository
  ) {}

  async execute({
    userId,
    carId,
    notaDesempenho,
    notaConforto,
    notaConsumo,
    notaDesign,
    notaCustoBeneficio,
    comentario,
  }: CreateEvaluationServiceRequest): Promise<CreateEvaluationServiceResponse> {
    const car = await this.carRepository.findById(carId);

    if (!car) {
      throw new ResourceNotFoundError();
    }

    if (car.status !== "ATIVO") {
      throw new ActionNotAllowedError("Cannot evaluate an inactive car.");
    }

    const existingEvaluation =
      await this.evaluationRepository.findByUserAndCar(userId, carId);

    if (existingEvaluation) {
      throw new ConflictError("User has already evaluated this car.");
    }

    // Calculate final score (simple average)
    const notaFinal =
      (notaDesempenho +
        notaConforto +
        notaConsumo +
        notaDesign +
        notaCustoBeneficio) /
      5;

    const evaluation = await this.evaluationRepository.create({
      userId,
      carId,
      notaDesempenho,
      notaConforto,
      notaConsumo,
      notaDesign,
      notaCustoBeneficio,
      notaFinal,
      comentario,
    });

    return { evaluation };
  }
}
