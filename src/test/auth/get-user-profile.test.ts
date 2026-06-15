import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { getUserProfileCase } from '@/use-cases/auth/get-user-profile'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: getUserProfileCase

describe('Get User Profile Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new getUserProfileCase(usersRepository)
	})

	it('should able to authenticate', async () => {
		const createdUser = await usersRepository.create({
			id: 'user-1',
			email: 'john@example.com',
			name: 'John doe',
			passwordHash: await bcrypt.hash('hashthis', 6)
		})

		const { user } = await sut.execute({
			userId: createdUser.id
		})

		expect(user.id).toEqual(createdUser.id)
		expect(user.name).toEqual(createdUser.name)
	})

	it('should not be able to get user profile  with wrong id', async () => {
		await expect(() =>
			sut.execute({
				userId: 'non-existing-id'
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
