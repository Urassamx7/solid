import bcrypt from 'bcryptjs'
import { ConflictError } from '@/http/errors/conflict-error'
import type { UsersRepository } from '@/interfaces/user-repository'
import { prisma } from '@/lib/prisma'

interface RegisterUseCaseRequest {
	name: string
	email: string
	password: string
}

const HASH_SALT = 6

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({ name, email, password }: RegisterUseCaseRequest) {
		const exists = await this.usersRepository.findByEmail(email)

		if (exists) {
			throw new ConflictError('User with this email already exists')
		}

		const passwordHash = await bcrypt.hash(password, HASH_SALT)

		const user = await this.usersRepository.create({
			email,
			name,
			passwordHash
		})

		return { id: user.id }
	}
}
