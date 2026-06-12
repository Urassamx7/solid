import bcrypt from 'bcryptjs'
import { ConflictError } from '@/http/errors/conflict-error'
import { prisma } from '@/lib/prisma'

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

	const user = await prisma.user.create({
		data: {
			email,
			passwordHash,
			name
		}
	})
	return { id: user.id }
}
