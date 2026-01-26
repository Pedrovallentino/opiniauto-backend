import { CarRepository } from '../../repositories/car-repository'

interface CreateCarServiceRequest {
  marca: string
  modelo: string
  ano: number
  categoria: string
  tipoMotorizacao: string
  imagem: string
}

export class CreateCarService {
  constructor(private readonly cars: CarRepository) {}

  async execute({
    marca,
    modelo,
    ano,
    categoria,
    tipoMotorizacao,
    imagem,
  }: CreateCarServiceRequest) {
    // The permission check is already done in the middleware

    const car = await this.cars.create({
      marca,
      modelo,
      ano,
      categoria,
      tipoMotorizacao,
      imagem,
    })

    return { car }
  }
}

