import type { Gym } from '@prisma/client'
import type { GymsRepository } from '@/interfaces/gyms-repository'

interface SearchGymsUseCaseRequest {
	query: string
	page?: number
}
interface SearchGymsUseCaseResponse {
	gyms: Gym[]
}

export class SearchGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		query,
		page = 1
	}: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.searchMany(query, page)

		return { gyms }
	}
}
