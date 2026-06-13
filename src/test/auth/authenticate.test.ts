import bcrypt from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '@/use-cases/auth/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/auth/invalid-credentials-error'

describe('Register Use Case', () => {
	it('should able to authenticate', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const sut = new AuthenticateUseCase(usersRepository)

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
		const usersRepository = new InMemoryUsersRepository()
		const sut = new AuthenticateUseCase(usersRepository)

		await expect(() =>
			sut.execute({
				email: 'johna@example.com',
				password: 'hashthis'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with wrong password', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const sut = new AuthenticateUseCase(usersRepository)

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
