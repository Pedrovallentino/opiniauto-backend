import { User } from '../domain/entities.js'

export interface CreateUserData {
  nome: string
  email: string
  senhaHash: string
  perfil?: 'USER' | 'ADMIN'
}

export interface UserRepository {
  create(data: CreateUserData): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}

