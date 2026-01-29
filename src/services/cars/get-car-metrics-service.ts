import { EvaluationRepository } from "@/repositories/evaluation-repository.js";
import { CarRepository } from "@/repositories/car-repository.js";
import { ResourceNotFoundError } from "../errors.js";

interface GetCarMetricsServiceRequest {
  carId: string;
}

interface CarMetrics {
  averageDesempenho: number;
  averageConforto: number;
  averageConsumo: number;
  averageDesign: number;
  averageCustoBeneficio: number;
  averageFinal: number;
  totalEvaluations: number;
}

interface GetCarMetricsServiceResponse {
  metrics: CarMetrics;
}

export class GetCarMetricsService {
  constructor(
    private carRepository: CarRepository,
    private evaluationRepository: EvaluationRepository
  ) {}

  async execute({
    carId,
  }: GetCarMetricsServiceRequest): Promise<GetCarMetricsServiceResponse> {
    const car = await this.carRepository.findById(carId);

    if (!car) {
      throw new ResourceNotFoundError();
    }

    const evaluations = await this.evaluationRepository.findManyByCarId(carId);

    const totalEvaluations = evaluations.length;

    if (totalEvaluations === 0) {
      return {
        metrics: {
          averageDesempenho: 0,
          averageConforto: 0,
          averageConsumo: 0,
          averageDesign: 0,
          averageCustoBeneficio: 0,
          averageFinal: 0,
          totalEvaluations: 0,
        },
      };
    }

    const sum = evaluations.reduce(
      (acc, curr) => {
        return {
          desempenho: acc.desempenho + curr.notaDesempenho,
          conforto: acc.conforto + curr.notaConforto,
          consumo: acc.consumo + curr.notaConsumo,
          design: acc.design + curr.notaDesign,
          custoBeneficio: acc.custoBeneficio + curr.notaCustoBeneficio,
          final: acc.final + curr.notaFinal,
        };
      },
      {
        desempenho: 0,
        conforto: 0,
        consumo: 0,
        design: 0,
        custoBeneficio: 0,
        final: 0,
      } as {
        desempenho: number;
        conforto: number;
        consumo: number;
        design: number;
        custoBeneficio: number;
        final: number;
      }
    );

    return {
      metrics: {
        averageDesempenho: sum.desempenho / totalEvaluations,
        averageConforto: sum.conforto / totalEvaluations,
        averageConsumo: sum.consumo / totalEvaluations,
        averageDesign: sum.design / totalEvaluations,
        averageCustoBeneficio: sum.custoBeneficio / totalEvaluations,
        averageFinal: sum.final / totalEvaluations,
        totalEvaluations,
      },
    };
  }
}
