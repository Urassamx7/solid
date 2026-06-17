import type { CheckIn } from '@prisma/client'
import type { CheckInsRepository } from '@/interfaces/check-ins-repository'
import type { GymsRepository } from '@/interfaces/gyms-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from '../errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '../errors/max-number-of-check-ins-error'
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
		const gym = await this.gymsRepository.findById(gymId)

		if (!gym) {
			throw new ResourceNotFoundError()
		}

		// calcular a distância entre o user e o gym

		const distance = getDistanceBetweenCoordinates(
			{ latitude: userLatitude, longitude: userLongitude },
			{
				latitude: gym.latitude.toNumber(),
				longitude: gym.longitude.toNumber()
			}
		)

		const MAX_DISTANCE_IN_KM = 0.1 // 100m

		// distance > 100 ? Error distance : procede
		if (distance > MAX_DISTANCE_IN_KM) {
			throw new MaxDistanceError()
		}

		const checkInOnSameDay =
			await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

		if (checkInOnSameDay) {
			throw new MaxNumberOfCheckInsError()
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
