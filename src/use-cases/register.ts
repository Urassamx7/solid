import bcrypt from 'bcryptjs'
import { ConflictError } from '@/http/errors/conflict-error'
import type { UsersRepository } from '@/interfaces/user-repository'
import { prisma } from '@/lib/prisma'
import { UserAlreadyExistsError } from './errors/user-already-exists'

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
			throw new UserAlreadyExistsError()
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
