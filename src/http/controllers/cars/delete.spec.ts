import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'

// Mock the repository
vi.mock('@/repositories/prisma/prisma-car-repository', () => {
  return {
    PrismaCarRepository: vi.fn().mockImplementation(() => ({
      delete: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn().mockImplementation((id) => {
          if (id === 'f47ac10b-58cc-4372-a567-0e02b2c3d479') {
              return Promise.resolve({
                id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                marca: 'Toyota',
                modelo: 'Corolla',
                status: 'ATIVO',
              })
          }
          return Promise.resolve(null)
      })
    })),
  }
})

describe('Delete Car (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete a car if admin', async () => {
    const token = app.jwt.sign({
      sub: 'admin-user-id',
      role: 'ADMIN',
    })

    const response = await app.inject({
      method: 'DELETE',
      url: '/cars/f47ac10b-58cc-4372-a567-0e02b2c3d479',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toEqual(204)
  })

  it('should not be able to delete a car if not admin', async () => {
    const token = app.jwt.sign({
      sub: 'user-id',
      role: 'USER',
    })

    const response = await app.inject({
      method: 'DELETE',
      url: '/cars/f47ac10b-58cc-4372-a567-0e02b2c3d479',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toEqual(403)
  })
})
