import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { RegisterUseCase } from '@/use-cases/auth/register'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new RegisterUseCase(usersRepository)
	})

	it('should hash user password upon registration', async () => {
		const { user } = await sut.execute({
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
		const email = 'john@example.com'

		await sut.execute({
			name: 'John Doe',
			email,
			password: 'hashthis'
		})

		await expect(() =>
			sut.execute({
				name: 'John Doe',
				email,
				password: 'hashthis'
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
	it('should be able to create user', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: 'hashthis'
		})
		expect(user.id).toEqual(expect.any(String))
	})
})
