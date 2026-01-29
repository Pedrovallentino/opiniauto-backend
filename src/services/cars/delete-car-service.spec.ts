import { describe, expect, it } from 'vitest'
import { InMemoryCarRepository } from '../../repositories/in-memory/in-memory-car-repository.js'
import { DeleteCarService } from './delete-car-service.js'
import { ForbiddenError, ResourceNotFoundError } from '../errors.js'

describe('Delete Car Service', () => {
  it('should be able to delete a car', async () => {
    const carRepository = new InMemoryCarRepository()
    const sut = new DeleteCarService(carRepository)

    const car = await carRepository.create({
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2024,
      categoria: 'Sedan',
      tipoMotorizacao: 'Híbrido',
      imagem: 'http://example.com/image.jpg',
    })

    await sut.execute({
      carId: car.id,
      currentUserPerfil: 'ADMIN',
    })

    const deletedCar = await carRepository.findById(car.id)
    expect(deletedCar).toBeNull()
  })

  it('should not be able to delete a car if not admin', async () => {
    const carRepository = new InMemoryCarRepository()
    const sut = new DeleteCarService(carRepository)

    const car = await carRepository.create({
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2024,
      categoria: 'Sedan',
      tipoMotorizacao: 'Híbrido',
      imagem: 'http://example.com/image.jpg',
    })

    await expect(() =>
      sut.execute({
        carId: car.id,
        currentUserPerfil: 'USER',
      }),
    ).rejects.toBeInstanceOf(ForbiddenError)
  })

  it('should not be able to delete a non-existent car', async () => {
    const carRepository = new InMemoryCarRepository()
    const sut = new DeleteCarService(carRepository)

    await expect(() =>
      sut.execute({
        carId: 'non-existent-id',
        currentUserPerfil: 'ADMIN',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
