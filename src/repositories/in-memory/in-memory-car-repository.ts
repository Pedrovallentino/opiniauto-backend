import { Car } from '../../domain/entities'
import { CarRepository, CreateCarData, UpdateCarData } from '../car-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryCarRepository implements CarRepository {
  public items: Car[] = []

  async create(data: CreateCarData) {
    const car: Car = {
      id: randomUUID(),
      marca: data.marca,
      modelo: data.modelo,
      ano: data.ano,
      categoria: data.categoria,
      tipoMotorizacao: data.tipoMotorizacao,
      imagem: data.imagem,
      status: 'ATIVO',
      criadoEm: new Date(),
    }

    this.items.push(car)

    return car
  }

  async update(id: string, data: UpdateCarData) {
    const carIndex = this.items.findIndex((item) => item.id === id)

    if (carIndex === -1) {
      throw new Error('Car not found')
    }

    const car = this.items[carIndex]

    const updatedCar = {
      ...car,
      ...data,
    }

    this.items[carIndex] = updatedCar

    return updatedCar
  }

  async delete(id: string) {
    const carIndex = this.items.findIndex((item) => item.id === id)

    if (carIndex !== -1) {
      this.items.splice(carIndex, 1)
    }
  }

  async findById(id: string) {
    const car = this.items.find((item) => item.id === id)

    if (!car) {
      return null
    }

    return car
  }

  async listActive() {
    return this.items.filter((item) => item.status === 'ATIVO')
  }

  async listAll() {
    return this.items
  }
}

// Singleton instance for testing/demo purposes
export const inMemoryCarRepository = new InMemoryCarRepository();
