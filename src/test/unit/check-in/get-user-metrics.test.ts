import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '@/use-cases/check-in/fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch Check in history Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
	})

	it('should able to get check ins count from metrics', async () => {
		await checkInsRepository.create({
			gymId: 'gym-01',
			userId: 'user-01'
		})

		await checkInsRepository.create({
			gymId: 'gym-02',
			userId: 'user-01'
		})
		await checkInsRepository.create({
			gymId: 'gym-03',
			userId: 'user-01'
		})

		const checkInsCount = await checkInsRepository.countByUserId('user-01')

		expect(checkInsCount).toEqual(3)
	})
})
