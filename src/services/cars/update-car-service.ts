import { CarRepository, UpdateCarData } from '../../repositories/car-repository'
import { ResourceNotFoundError } from '../errors'

interface UpdateCarServiceRequest extends UpdateCarData {
  carId: string
}

export class UpdateCarService {
  constructor(private readonly cars: CarRepository) {}

  async execute({ carId, ...data }: UpdateCarServiceRequest) {
    const existing = await this.cars.findById(carId)

    if (!existing) {
      throw new ResourceNotFoundError()
    }

    const car = await this.cars.update(carId, data)

    return { car }
  }
}

