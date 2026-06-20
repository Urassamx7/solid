import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from '@/use-cases/gym/fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch nearby gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new FetchNearbyGymsUseCase(gymsRepository)
	})

	it('should able to fetch for nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Near academy',
			description: null,
			latitude: -25.742138,
			longitude: 32.621189,
			phone: null
		})

		await gymsRepository.create({
			title: 'Far academy',
			description: null,
			latitude: -25.8395857,
			longitude: 32.5011452,
			phone: null
		})

		const { gyms } = await sut.execute({
			userLatitude: -25.74217,
			userLongitude: 32.62107
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([
			expect.objectContaining({
				title: 'Near academy'
			})
		])
	})
})
