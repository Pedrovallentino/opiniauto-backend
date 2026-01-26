import { CarRepository } from '../../repositories/car-repository'
import { ResourceNotFoundError } from '../errors'

interface ToggleCarStatusRequest {
  carId: string
}

export class ToggleCarStatusService {
  constructor(private readonly cars: CarRepository) {}

  async execute({ carId }: ToggleCarStatusRequest) {
    const existing = await this.cars.findById(carId)

    if (!existing) {
      throw new ResourceNotFoundError()
    }

    const newStatus = existing.status === 'ATIVO' ? 'INATIVO' : 'ATIVO'

    const car = await this.cars.update(carId, { status: newStatus })

    return { car }
  }
}

