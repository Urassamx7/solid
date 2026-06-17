import type { CheckIn } from '@prisma/client'
import type { CheckInsRepository } from '@/interfaces/check-ins-repository'
import type { GymsRepository } from '@/interfaces/gyms-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface CheckInUseCaseRequest {
	userId: string
	gymId: string
	userLatitude: number
	userLongitude: number
}
interface CheckInUseCaseResponse {
	checkIn: CheckIn
}

export class CheckinUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository
	) {}

	async execute({
		gymId,
		userId,
		userLatitude,
		userLongitude
	}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const gym = this.gymsRepository.findById(gymId)

		if (!gym) {
			throw new ResourceNotFoundError()
		}

		// calcular a distância entre o user e o gym
		// distance > 100 ? Error distance : procede

		const checkInOnSameDay =
			await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

		if (checkInOnSameDay) {
			throw new Error()
		}

		const checkIn = await this.checkInsRepository.create({ gymId, userId })

		if (!checkIn) {
			throw new ResourceNotFoundError()
		}

		return {
			checkIn
		}
	}
}
