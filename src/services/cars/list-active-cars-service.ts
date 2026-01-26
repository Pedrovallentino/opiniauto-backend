import { CarRepository } from '../../repositories/car-repository'

export class ListActiveCarsService {
  constructor(private readonly cars: CarRepository) {}

  async execute() {
    const cars = await this.cars.listActive()
    return { cars }
  }
}

