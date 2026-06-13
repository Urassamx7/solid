import { type Prisma, Role, type User } from '@prisma/client'
import type { UsersRepository } from '@/interfaces/user-repository'

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = []

	async findByEmail(email: string) {
		const user = this.items.find((item) => item.email === email)
		if (!user) {
			return null
		}
		return user
	}

	async create(data: Prisma.UserCreateInput) {
		const user = {
			id: 'id-1',
			createdAt: new Date(),
			updatedAt: new Date(),
			email: data.email,
			name: data.name,
			passwordHash: data.passwordHash,
			role: Role.MEMBER
		}

		this.items.push(user)

		return user
	}
}
