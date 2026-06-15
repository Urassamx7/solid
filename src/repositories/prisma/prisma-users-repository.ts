import type { Prisma, User } from '@prisma/client'
import type { UsersRepository } from '@/interfaces/user-repository'
import { prisma } from '@/lib/prisma'

export class PrismaUsersRepository implements UsersRepository {
	async create(data: Prisma.UserCreateInput): Promise<User> {
		const user = await prisma.user.create({
			data
		})
		return user
	}

	async findByEmail(email: string): Promise<User | null> {
		return await prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	async findById(id: string): Promise<User | null> {
		return await prisma.user.findUnique({
			where: {
				id
			}
		})
	}
}
