import { User } from '../../domain/entities.js'
import { CreateUserData, UserRepository } from '../user-repository.js'
import { randomUUID } from 'node:crypto'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async create(data: CreateUserData) {
    const user: User = {
      id: randomUUID(),
      nome: data.nome,
      email: data.email,
      senhaHash: data.senhaHash,
      perfil: data.perfil ?? 'USER',
      criadoEm: new Date(),
    }

    this.items.push(user)

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }
}
