import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from '@/use-cases/check-in/check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckinUseCase

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new CheckinUseCase(checkInsRepository)
	})

	it('should able to create check-in', async () => {
		const checkIn = await checkInsRepository.create({
			gymId: 'gym-01',
			userId: 'user-01'
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})
})
