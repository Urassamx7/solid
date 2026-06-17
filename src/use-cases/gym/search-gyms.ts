import type { Gym } from '@prisma/client'
import type { GymsRepository } from '@/interfaces/gyms-repository'

interface SearchGymUseCaseRequest {
	query: string
	page?: number
}
interface SearchGymUseCaseResponse {
	gyms: Gym[]
}

export class SearchGymUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		query,
		page = 1
	}: SearchGymUseCaseRequest): Promise<SearchGymUseCaseResponse> {
		const gyms = await this.gymsRepository.searchMany(query, page)

		return { gyms }
	}
}
