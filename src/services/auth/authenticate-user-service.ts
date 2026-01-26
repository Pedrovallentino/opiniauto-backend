import bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { UserRepository } from '../../repositories/user-repository'
import { AuthRepository } from '../../repositories/auth-repository'
import { InvalidCredentialsError } from '../errors'

interface AuthenticateUserRequest {
  email: string
  senha: string
  ip: string
  userAgent?: string
}

interface AuthenticateUserResponse {
  user: {
    id: string
    nome: string
    email: string
    perfil: 'USER' | 'ADMIN'
  }
  refreshToken: string
}

export class AuthenticateUserService {
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository
  ) {}

  async execute({ email, senha, ip, userAgent }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      await this.authRepository.createLoginLog({
        email,
        ip,
        userAgent,
        sucesso: false,
      })
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatch = await bcrypt.compare(senha, user.senhaHash)

    if (!doesPasswordMatch) {
      await this.authRepository.createLoginLog({
        usuarioId: user.id,
        email,
        ip,
        userAgent,
        sucesso: false,
      })
      throw new InvalidCredentialsError()
    }

    // Gerar Refresh Token
    const refreshToken = randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 dias de validade

    await this.authRepository.createRefreshToken({
      token: refreshToken,
      usuarioId: user.id,
      expiresAt,
    })

    await this.authRepository.createLoginLog({
      usuarioId: user.id,
      email,
      ip,
      userAgent,
      sucesso: true,
    })

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
      },
      refreshToken,
    }
  }
}


