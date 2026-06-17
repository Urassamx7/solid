import type { CheckIn } from '@prisma/client'
import type { CheckInsRepository } from '@/interfaces/check-ins-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ValidateCheckInUseCaseRequest {
	checkinId: string
}
interface ValidateCheckInUseCaseResponse {
	checkIn: CheckIn
}

export class ValidateCheckinUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		checkinId
	}: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(checkinId)

		if (!checkIn) {
			throw new ResourceNotFoundError()
		}

		checkIn.validatedAt = new Date()
        
		await this.checkInsRepository.save(checkIn)

		return {
			checkIn
		}
	}
}
