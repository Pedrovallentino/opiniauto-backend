/**
 * @module PrismaClient
 * @description Instância única do cliente Prisma para conexão com o banco de dados.
 * Utilizado em repositórios para realizar operações de persistência.
 * 
 * @requires @prisma/client
 */

import { PrismaClient } from '@prisma/client'

/**
 * @constant prisma
 * @description Instância global do Prisma Client.
 */
export const prisma = new PrismaClient()

