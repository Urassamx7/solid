import bcrypt from 'bcryptjs'
import { ConflictError } from '@/http/errors/conflict-error'
import { prisma } from '@/lib/prisma'

interface RegisterUseCaseRequest {
	name: string
	email: string
	password: string
}

const HASH_SALT = 6

export class RegisterUseCase {
	constructor(private usersRepository: any) {}

	async execute({ name, email, password }: RegisterUseCaseRequest) {
		const exists = await prisma.user.findUnique({
			where: {
				email
			}
		})

		if (exists) {
			throw new ConflictError('User with this email already exists')
		}

		const passwordHash = await bcrypt.hash(password, HASH_SALT)

		const prismaUserRepository = new this.usersRepository()

		const user = await prismaUserRepository.create({
			email,
			name,
			passwordHash
		})

		return { id: user.id }
	}
}
