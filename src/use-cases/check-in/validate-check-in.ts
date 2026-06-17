import type { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'
import type { CheckInsRepository } from '@/interfaces/check-ins-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { LateCheckInValidationError } from '../errors/late-check-in-validation-error'

interface ValidateCheckInUseCaseRequest {
	checkinId: string
}
interface ValidateCheckInUseCaseResponse {
	checkIn: CheckIn
}

const MAX_VALIDATION_TIME = 20

export class ValidateCheckinUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		checkinId
	}: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(checkinId)

		if (!checkIn) {
			throw new ResourceNotFoundError()
		}

		const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
			checkIn.createdAt,
			'minutes'
		)

		if (distanceInMinutesFromCheckInCreation > MAX_VALIDATION_TIME) {
			throw new LateCheckInValidationError()
		}

		checkIn.validatedAt = new Date()

		await this.checkInsRepository.save(checkIn)

		return {
			checkIn
		}
	}
}
