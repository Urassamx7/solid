import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from '@/use-cases/register'

describe('Register Use Case', () => {
	it('should hash user password upon registration', async () => {
		const registerUseCase = new RegisterUseCase({
			async findByEmail(email) {
				return null
			},
			async create(data) {
				return {
					id: 'id-1',
					createdAt: new Date(),
					updatedAt: new Date(),
					email: data.email,
					name: data.name,
					passwordHash: data.passwordHash,
					// provide a role value to satisfy the expected return type
					role: 'user'
				} as any
			}
		})

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

	it('')
})
