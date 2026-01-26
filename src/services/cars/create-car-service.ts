/**
 * @module CreateCarService
 * @description Serviço para criação de novos carros no sistema.
 * 
 * @requires CarRepository - Interface de persistência.
 */

import { CarRepository } from '../../repositories/car-repository'

interface CreateCarServiceRequest {
  marca: string
  modelo: string
  ano: number
  categoria: string
  tipoMotorizacao: string
  imagem: string
}

/**
 * @class CreateCarService
 * @description Executa a lógica de criação de um carro.
 */
export class CreateCarService {
  constructor(private readonly cars: CarRepository) {}

  /**
   * @method execute
   * @description Cria um novo registro de carro.
   * 
   * @param {CreateCarServiceRequest} params - Dados do carro.
   * @returns {Promise<{ car: Car }>} O carro criado.
   */
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

