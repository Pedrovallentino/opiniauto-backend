import { describe, expect, it } from 'vitest'
import { InMemoryCarRepository } from '../../repositories/in-memory/in-memory-car-repository.js'
import { CreateCarService } from './create-car-service.js'

describe('Create Car Service', () => {
  it('should be able to create a new car', async () => {
    const carRepository = new InMemoryCarRepository()
    const sut = new CreateCarService(carRepository)

    const { car } = await sut.execute({
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2024,
      categoria: 'Sedan',
      tipoMotorizacao: 'Híbrido',
      imagem: 'http://example.com/image.jpg',
    })

    expect(car.id).toEqual(expect.any(String))
    expect(car.modelo).toEqual('Corolla')
    expect(car.status).toEqual('ATIVO')
  })
})
