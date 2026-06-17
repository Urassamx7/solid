import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckinUseCase } from '@/use-cases/check-in/validate-check-in'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckinUseCase

describe('Validate Check In Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckinUseCase(checkInsRepository)

		// vi.useFakeTimers()
	})

	afterEach(() => {
		// vi.useRealTimers()
	})

	it('should able to validate the check-in', async () => {
		const createdCheckIn = await checkInsRepository.create({
			gymId: 'gym-01',
			userId: 'user-01'
		})

		const { checkIn } = await sut.execute({
			checkinId: createdCheckIn.id
		})

		expect(checkIn.validatedAt).toEqual(expect.any(Date))
		expect(checkInsRepository.items[0].validatedAt).toEqual(
			expect.any(Date)
		)
	})

	it('should not be able to validate an inexistent check-in', async () => {
		await expect(() =>
			sut.execute({
				checkinId: 'inexistent-id'
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
