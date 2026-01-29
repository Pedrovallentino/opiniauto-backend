import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { app } from '@/app.js'

// Mock the repository
vi.mock('@/repositories/prisma/prisma-car-repository', () => {
  return {
    PrismaCarRepository: vi.fn().mockImplementation(() => ({
      update: vi.fn().mockResolvedValue({
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2024,
        categoria: 'Sedan',
        tipoMotorizacao: 'Flex',
        status: 'INATIVO',
        imagem: 'http://img.com',
        criadoEm: new Date(),
      }),
      findById: vi.fn().mockResolvedValue({
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2024,
        categoria: 'Sedan',
        tipoMotorizacao: 'Flex',
        status: 'ATIVO',
        imagem: 'http://img.com',
        criadoEm: new Date(),
      }),
    })),
  }
})

describe('Toggle Status Car (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to toggle car status if admin', async () => {
    const token = app.jwt.sign({
      sub: 'admin-user-id',
      role: 'ADMIN',
    })

    const response = await app.inject({
      method: 'PATCH',
      url: '/cars/f47ac10b-58cc-4372-a567-0e02b2c3d479/status',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json().car.status).toEqual('INATIVO')
  })
})
