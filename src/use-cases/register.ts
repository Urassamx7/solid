import bcrypt from 'bcryptjs'
import { ConflictError } from '@/http/errors/conflict-error'
import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

interface RegisterUseCaseRequest {
	name: string
	email: string
	password: string
}

const HASH_SALT = 6

export async function registerUseCase({
	name,
	email,
	password
}: RegisterUseCaseRequest) {
	const exists = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (exists) {
		throw new ConflictError('User with this email already exists')
	}

	const passwordHash = await bcrypt.hash(password, HASH_SALT)

	const prismaUserRepository = new PrismaUsersRepository()

	const user = await prismaUserRepository.create({
		email,
		name,
		passwordHash
	})

	return { id: user.id }
}
