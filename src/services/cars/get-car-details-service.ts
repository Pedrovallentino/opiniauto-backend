import { CarRepository } from '../../repositories/car-repository'
import { ResourceNotFoundError } from '../errors'

interface GetCarDetailsRequest {
  carId: string
}

export class GetCarDetailsService {
  constructor(private readonly cars: CarRepository) {}

  async execute({ carId }: GetCarDetailsRequest) {
    const car = await this.cars.findById(carId)

    if (!car) {
      throw new ResourceNotFoundError()
    }

    return { car }
  }
}

