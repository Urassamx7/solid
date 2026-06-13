import type { User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import type { UsersRepository } from '@/interfaces/user-repository'
import { InvalidCredentialsError } from '../errors/auth/invalid-credentials-error'

interface AuthenticateUseCaseRequest {
	email: string
	password: string
}
interface AuthenticateUseCaseResponse {
	user: User
}

export class AuthenticateUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		email,
		password
	}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(email)

		if (!user) {
			throw new InvalidCredentialsError()
		}

		const doesPasswordMatches = await bcrypt.compare(
			password,
			user.passwordHash
		)

		if (!doesPasswordMatches) {
			throw new InvalidCredentialsError()
		}

		return {
			user
		}
	}
}
