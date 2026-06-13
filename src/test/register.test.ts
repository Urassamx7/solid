import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists'
import { RegisterUseCase } from '@/use-cases/register'

describe('Register Use Case', () => {
	it('should hash user password upon registration', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const registerUseCase = new RegisterUseCase(usersRepository)

		const { user } = await registerUseCase.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: 'hashthis'
		})

		const isPasswordCorrectlyHashed = await compare(
			'hashthis',
			user.passwordHash
		)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})

	it('should not be able to register with same email twice', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const registerUseCase = new RegisterUseCase(usersRepository)
		const email = 'john@example.com'

		await registerUseCase.execute({
			name: 'John Doe',
			email,
			password: 'hashthis'
		})

		await expect(() =>
			registerUseCase.execute({
				name: 'John Doe',
				email,
				password: 'hashthis'
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
	it('should be able to create user', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const registerUseCase = new RegisterUseCase(usersRepository)

		const { user } = await registerUseCase.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: 'hashthis'
		})
		expect(user.id).toEqual(expect.any(String))
	})
})
