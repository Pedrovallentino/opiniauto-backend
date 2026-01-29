import { describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository.js'
import { RegisterUserService } from './register-user-service.js'
import { EmailAlreadyUsedError } from '../errors.js'
import bcrypt from 'bcryptjs'

describe('Register User Service', () => {
  it('should be able to register a new user', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new RegisterUserService(userRepository)

    const { user } = await sut.execute({
      nome: 'John Doe',
      email: 'johndoe@example.com',
      senha: '123',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.nome).toEqual('John Doe')
  })

  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new RegisterUserService(userRepository)

    const { user } = await sut.execute({
      nome: 'John Doe',
      email: 'johndoe@example.com',
      senha: '123',
    })

    const isPasswordCorrectlyHashed = await bcrypt.compare('123', user.senhaHash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new RegisterUserService(userRepository)

    const email = 'johndoe@example.com'

    await sut.execute({
      nome: 'John Doe',
      email,
      senha: '123',
    })

    await expect(() =>
      sut.execute({
        nome: 'John Doe',
        email,
        senha: '123',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyUsedError)
  })
})
