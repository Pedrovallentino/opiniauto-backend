import { prisma } from '../../infra/database/prisma/client.js'
import { CreateUserData, UserRepository } from '../user-repository.js'

export class PrismaUserRepository implements UserRepository {
  async create(data: CreateUserData) {
    return prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senhaHash: data.senhaHash,
        perfil: data.perfil ?? 'USER',
      },
    })
  }

  async findByEmail(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
    })
  }

  async findById(id: string) {
    return prisma.usuario.findUnique({
      where: { id },
    })
  }
}

