import { describe, expect, it } from 'vitest'
import { InMemoryCarRepository } from '../../repositories/in-memory/in-memory-car-repository'
import { UpdateCarService } from './update-car-service'
import { ResourceNotFoundError } from '../errors'

describe('Update Car Service', () => {
  it('should be able to update a car', async () => {
    const carRepository = new InMemoryCarRepository()
    const sut = new UpdateCarService(carRepository)

    const car = await carRepository.create({
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2024,
      categoria: 'Sedan',
      tipoMotorizacao: 'Híbrido',
      imagem: 'http://example.com/image.jpg',
    })

    const { car: updatedCar } = await sut.execute({
      carId: car.id,
      marca: 'Toyota Updated',
    })

    expect(updatedCar.marca).toEqual('Toyota Updated')
  })

  it('should not be able to update a non-existent car', async () => {
    const carRepository = new InMemoryCarRepository()
    const sut = new UpdateCarService(carRepository)

    await expect(() =>
      sut.execute({
        carId: 'non-existent-id',
        marca: 'Toyota',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
