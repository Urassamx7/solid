import type { Prisma } from '@prisma/client'

export class InMemoryUsersRepository {
	private users: Prisma.UserCreateInput[] = []

	async create(data: Prisma.UserCreateInput) {
		this.users.push(data)
	}
}
