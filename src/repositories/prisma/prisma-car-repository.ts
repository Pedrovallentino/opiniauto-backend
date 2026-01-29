/**
 * @module PrismaCarRepository
 * @description Implementação do repositório de carros utilizando Prisma ORM.
 * Responsável por todas as interações diretas com a tabela 'Carro' no banco de dados.
 * 
 * @implements CarRepository
 */

import { prisma } from '../../infra/database/prisma/client.js'
import { CarRepository, CreateCarData, UpdateCarData } from '../car-repository.js'

/**
 * @class PrismaCarRepository
 * @description Camada de acesso a dados para a entidade Carro.
 */
export class PrismaCarRepository implements CarRepository {
  /**
   * @method create
   * @description Cria um novo carro no banco de dados.
   */
  async create(data: CreateCarData) {
    return prisma.carro.create({
      data,
    })
  }

  /**
   * @method update
   * @description Atualiza dados de um carro existente.
   */
  async update(id: string, data: UpdateCarData) {
    return prisma.carro.update({
      where: { id },
      data,
    })
  }

  /**
   * @method delete
   * @description Remove um carro pelo ID.
   */
  async delete(id: string) {
    await prisma.carro.delete({
      where: { id },
    })
  }

  /**
   * @method findById
   * @description Busca um carro pelo ID.
   */
  async findById(id: string) {
    return prisma.carro.findUnique({
      where: { id },
    })
  }

  /**
   * @method listActive
   * @description Lista apenas carros com status 'ATIVO', ordenados por data de criação.
   */
  async listActive() {
    return prisma.carro.findMany({
      where: { status: 'ATIVO' },
      orderBy: { criadoEm: 'desc' },
    })
  }

  /**
   * @method listAll
   * @description Lista todos os carros (Ativos e Inativos), ordenados por data de criação.
   */
  async listAll() {
    return prisma.carro.findMany({
      orderBy: { criadoEm: 'desc' },
    })
  }
}

