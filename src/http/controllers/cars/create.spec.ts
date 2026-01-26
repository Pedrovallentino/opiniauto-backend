import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import { PrismaCarRepository } from '@/repositories/prisma/prisma-car-repository'

// Mock the repository
vi.mock('@/repositories/prisma/prisma-car-repository', () => {
  return {
    PrismaCarRepository: vi.fn().mockImplementation(() => ({
      create: vi.fn().mockResolvedValue({
        id: 'car-123',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2024,
        categoria: 'Sedan',
        tipoMotorizacao: 'Flex',
        status: 'ATIVO',
        imagem: 'http://img.com',
        criadoEm: new Date(),
      }),
      listAll: vi.fn().mockResolvedValue([]),
    })),
  }
})

describe('Create Car (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a car if admin', async () => {
    // Generate Admin Token
    const token = app.jwt.sign({
      sub: 'admin-user-id',
      role: 'ADMIN',
    })

    const response = await app.inject({
      method: 'POST',
      url: '/cars',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2024,
        categoria: 'Sedan',
        tipoMotorizacao: 'Flex',
        imagem: 'http://example.com/image.jpg',
      },
    })

    expect(response.statusCode).toEqual(201)
    expect(response.json().car).toEqual(expect.objectContaining({
        marca: 'Toyota'
    }))
  })

  it('should not be able to create a car if not admin', async () => {
    // Generate User Token
    const token = app.jwt.sign({
      sub: 'normal-user-id',
      role: 'USER',
    })

    const response = await app.inject({
      method: 'POST',
      url: '/cars',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2024,
        categoria: 'Sedan',
        tipoMotorizacao: 'Gasolina',
        imagem: 'http://example.com/image.jpg',
      },
    })

    expect(response.statusCode).toEqual(403)
  })
})
