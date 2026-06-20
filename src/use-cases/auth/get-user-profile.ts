import type { User } from '@prisma/client'
import type { UsersRepository } from '@/interfaces/user-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetUserProfileCaseRequest {
	userId: string
}
interface GetUserProfileCaseResponse {
	user: User
}

export class getUserProfileUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId
	}: GetUserProfileCaseRequest): Promise<GetUserProfileCaseResponse> {
		const user = await this.usersRepository.findById(userId)

		if (!user) {
			throw new ResourceNotFoundError()
		}

		return {
			user
		}
	}
}
