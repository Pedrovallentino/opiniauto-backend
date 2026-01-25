import { LoginLog, RefreshToken } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import {
  AuthRepository,
  CreateLoginLogData,
  CreateRefreshTokenData,
} from '../auth-repository'

export class InMemoryAuthRepository implements AuthRepository {
  public refreshTokens: RefreshToken[] = []
  public loginLogs: LoginLog[] = []

  async createRefreshToken(data: CreateRefreshTokenData) {
    const refreshToken: RefreshToken = {
      id: randomUUID(),
      token: data.token,
      usuarioId: data.usuarioId,
      expiresAt: data.expiresAt,
      createdAt: new Date(),
    }

    this.refreshTokens.push(refreshToken)

    return refreshToken
  }

  async findRefreshToken(token: string) {
    const refreshToken = this.refreshTokens.find((item) => item.token === token)

    if (!refreshToken) {
      return null
    }

    return refreshToken
  }

  async revokeRefreshToken(id: string) {
    const index = this.refreshTokens.findIndex((item) => item.id === id)

    if (index !== -1) {
      this.refreshTokens.splice(index, 1)
    }
  }

  async createLoginLog(data: CreateLoginLogData) {
    const log: LoginLog = {
      id: randomUUID(),
      usuarioId: data.usuarioId ?? null,
      email: data.email,
      ip: data.ip,
      userAgent: data.userAgent ?? null,
      sucesso: data.sucesso,
      createdAt: new Date(),
    }

    this.loginLogs.push(log)

    return log
  }
}
