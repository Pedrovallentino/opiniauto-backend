import { describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository.js'
import { InMemoryAuthRepository } from '../../repositories/in-memory/in-memory-auth-repository.js'
import { AuthenticateUserService } from './authenticate-user-service.js'
import { InvalidCredentialsError } from '../errors.js'
import bcrypt from 'bcryptjs'

describe('Authenticate User Service', () => {
  it('should be able to authenticate', async () => {
    const userRepository = new InMemoryUserRepository()
    const authRepository = new InMemoryAuthRepository()
    const sut = new AuthenticateUserService(userRepository, authRepository)

    await userRepository.create({
      nome: 'John Doe',
      email: 'johndoe@example.com',
      senhaHash: await bcrypt.hash('123', 6),
    })

    const { user, refreshToken } = await sut.execute({
      email: 'johndoe@example.com',
      senha: '123',
      ip: '127.0.0.1',
      userAgent: 'test-agent',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(refreshToken).toEqual(expect.any(String))
    expect(authRepository.loginLogs).toHaveLength(1)
    expect(authRepository.loginLogs[0].sucesso).toBe(true)
  })

  it('should not be able to authenticate with wrong email', async () => {
    const userRepository = new InMemoryUserRepository()
    const authRepository = new InMemoryAuthRepository()
    const sut = new AuthenticateUserService(userRepository, authRepository)

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        senha: '123',
        ip: '127.0.0.1',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)

    expect(authRepository.loginLogs).toHaveLength(1)
    expect(authRepository.loginLogs[0].sucesso).toBe(false)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const userRepository = new InMemoryUserRepository()
    const authRepository = new InMemoryAuthRepository()
    const sut = new AuthenticateUserService(userRepository, authRepository)

    await userRepository.create({
      nome: 'John Doe',
      email: 'johndoe@example.com',
      senhaHash: await bcrypt.hash('123', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        senha: 'wrong-password',
        ip: '127.0.0.1',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)

    expect(authRepository.loginLogs).toHaveLength(1)
    expect(authRepository.loginLogs[0].sucesso).toBe(false)
  })
})
