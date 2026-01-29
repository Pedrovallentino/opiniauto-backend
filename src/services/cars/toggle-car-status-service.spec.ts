import { describe, expect, it } from 'vitest'
import { InMemoryCarRepository } from '../../repositories/in-memory/in-memory-car-repository.js'
import { ToggleCarStatusService } from './toggle-car-status-service.js'
import { ResourceNotFoundError } from '../errors.js'

describe('Toggle Car Status Service', () => {
  it('should be able to toggle car status', async () => {
    const carRepository = new InMemoryCarRepository()
    const sut = new ToggleCarStatusService(carRepository)

    const car = await carRepository.create({
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2024,
      categoria: 'Sedan',
      tipoMotorizacao: 'Híbrido',
      imagem: 'http://example.com/image.jpg',
    })

    expect(car.status).toBe('ATIVO')

    const { car: inactivatedCar } = await sut.execute({
      carId: car.id,
    })

    expect(inactivatedCar.status).toBe('INATIVO')

    const { car: activatedCar } = await sut.execute({
      carId: car.id,
    })

    expect(activatedCar.status).toBe('ATIVO')
  })

  it('should not be able to toggle status of a non-existent car', async () => {
    const carRepository = new InMemoryCarRepository()
    const sut = new ToggleCarStatusService(carRepository)

    await expect(() =>
      sut.execute({
        carId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
