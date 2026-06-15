import type { CheckIn } from '@prisma/client'
import type { CheckInsRepository } from '@/interfaces/check-ins-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface CheckInUseCaseRequest {
	userId: string
	gymId: string
}
interface CheckInUseCaseResponse {
	checkIn: CheckIn
}

export class CheckinUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		gymId,
		userId
	}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.create({ gymId, userId })

		if (!checkIn) {
			throw new ResourceNotFoundError()
		}

		return {
			checkIn
		}
	}
}
