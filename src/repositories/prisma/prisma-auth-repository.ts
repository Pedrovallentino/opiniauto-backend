import { prisma } from '../../infra/database/prisma/client'
import {
  AuthRepository,
  CreateLoginLogData,
  CreateRefreshTokenData,
} from '../auth-repository'

export class PrismaAuthRepository implements AuthRepository {
  async createRefreshToken(data: CreateRefreshTokenData) {
    return prisma.refreshToken.create({
      data: {
        token: data.token,
        usuarioId: data.usuarioId,
        expiresAt: data.expiresAt,
      },
    })
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
    })
  }

  async revokeRefreshToken(id: string) {
    await prisma.refreshToken.delete({
      where: { id },
    })
  }

  async createLoginLog(data: CreateLoginLogData) {
    return prisma.loginLog.create({
      data: {
        usuarioId: data.usuarioId,
        email: data.email,
        ip: data.ip,
        userAgent: data.userAgent,
        sucesso: data.sucesso,
      },
    })
  }
}
