import { CarRepository } from '../../repositories/car-repository.js'
import { ForbiddenError, ResourceNotFoundError } from '../errors.js'

interface DeleteCarServiceRequest {
  currentUserPerfil: 'USER' | 'ADMIN'
  carId: string
}

export class DeleteCarService {
  constructor(private readonly cars: CarRepository) {}

  async execute({ currentUserPerfil, carId }: DeleteCarServiceRequest) {
    if (currentUserPerfil !== 'ADMIN') {
      throw new ForbiddenError('Apenas administradores podem excluir carros')
    }

    const existing = await this.cars.findById(carId)

    if (!existing) {
      throw new ResourceNotFoundError()
    }

    await this.cars.delete(carId)
  }
}

