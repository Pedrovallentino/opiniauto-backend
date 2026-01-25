import { LoginLog, RefreshToken } from '@prisma/client'

export interface CreateRefreshTokenData {
  token: string
  usuarioId: string
  expiresAt: Date
}

export interface CreateLoginLogData {
  usuarioId?: string
  email: string
  ip: string
  userAgent?: string
  sucesso: boolean
}

export interface AuthRepository {
  createRefreshToken(data: CreateRefreshTokenData): Promise<RefreshToken>
  findRefreshToken(token: string): Promise<RefreshToken | null>
  revokeRefreshToken(id: string): Promise<void>
  createLoginLog(data: CreateLoginLogData): Promise<LoginLog>
}
