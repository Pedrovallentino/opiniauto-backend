import { CarRepository } from '../../repositories/car-repository'

export class ListAllCarsService {
  constructor(private readonly cars: CarRepository) {}

  async execute() {
    const cars = await this.cars.listAll()

    return { cars }
  }
}
