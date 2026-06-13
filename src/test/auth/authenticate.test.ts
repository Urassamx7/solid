import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '@/use-cases/auth/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/auth/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Register Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new AuthenticateUseCase(usersRepository)
	})

	it('should able to authenticate', async () => {
		await usersRepository.create({
			email: 'john@example.com',
			name: 'John doe',
			passwordHash: await bcrypt.hash('hashthis', 6)
		})

		const { user } = await sut.execute({
			email: 'john@example.com',
			password: 'hashthis'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not be able to authenticate with wrong credentials', async () => {
		await expect(() =>
			sut.execute({
				email: 'johna@example.com',
				password: 'hashthis'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with wrong password', async () => {
		await usersRepository.create({
			email: 'john@example.com',
			name: 'John doe',
			passwordHash: await bcrypt.hash('hashthis', 6)
		})

		await sut.execute({
			email: 'john@example.com',
			password: 'hashthis'
		})

		await expect(() =>
			sut.execute({
				email: 'john@example.com',
				password: '12344'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
