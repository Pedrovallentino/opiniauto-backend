import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'

// Mock the repository
vi.mock('@/repositories/prisma/prisma-car-repository', () => {
  return {
    PrismaCarRepository: vi.fn().mockImplementation(() => ({
      update: vi.fn().mockResolvedValue({
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        marca: 'Toyota Updated',
        modelo: 'Corolla',
        ano: 2024,
        categoria: 'Sedan',
        tipoMotorizacao: 'Flex',
        status: 'ATIVO',
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

describe('Update Car (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update a car if admin', async () => {
    const token = app.jwt.sign({
      sub: 'admin-user-id',
      role: 'ADMIN',
    })

    const response = await app.inject({
      method: 'PUT',
      url: '/cars/f47ac10b-58cc-4372-a567-0e02b2c3d479',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        marca: 'Toyota Updated',
      },
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json().car.marca).toEqual('Toyota Updated')
  })

  it('should not be able to update a car if not admin', async () => {
    const token = app.jwt.sign({
      sub: 'user-id',
      role: 'USER',
    })

    const response = await app.inject({
      method: 'PUT',
      url: '/cars/f47ac10b-58cc-4372-a567-0e02b2c3d479',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        marca: 'Toyota Updated',
      },
    })

    expect(response.statusCode).toEqual(403)
  })
})
