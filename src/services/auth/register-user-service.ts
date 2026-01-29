import bcrypt from 'bcryptjs'
import { UserRepository } from '../../repositories/user-repository.js'
import { EmailAlreadyUsedError } from '../errors.js'

interface RegisterUserRequest {
  nome: string
  email: string
  senha: string
  perfil?: 'USER' | 'ADMIN'
}

export class RegisterUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({ nome, email, senha, perfil }: RegisterUserRequest) {
    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new EmailAlreadyUsedError()
    }

    const passwordHash = await bcrypt.hash(senha, 6)

    const user = await this.userRepository.create({
      nome,
      email,
      senhaHash: passwordHash,
      perfil,
    })

    return {
      user,
    }
  }
}

