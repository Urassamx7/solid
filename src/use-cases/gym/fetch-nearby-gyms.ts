import type { Gym } from '@prisma/client'
import type { GymsRepository } from '@/interfaces/gyms-repository'

interface FetchNearbyUseCaseUseCaseRequest {
	userLatitude: number
	userLongitude: number
}

interface FetchNearbyUseCaseUseCaseResponse {
	gyms: Gym[]
}

export class FetchNearbyUseCaseUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		userLatitude,
		userLongitude
	}: FetchNearbyUseCaseUseCaseRequest): Promise<FetchNearbyUseCaseUseCaseResponse> {
		const gyms = await this.gymsRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude
		})

		return { gyms }
	}
}
