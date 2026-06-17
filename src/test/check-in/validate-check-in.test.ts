import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckinUseCase } from '@/use-cases/check-in/validate-check-in'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckinUseCase

describe('Validate Check In Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckinUseCase(checkInsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
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

	it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2023, 0, 1, 13, 50))

		const createdCheckIn = await checkInsRepository.create({
			gymId: 'gym-01',
			userId: 'user-01'
		})

		const twentyOne = 1000 * 60 * 21 // 21 minutes

		vi.advanceTimersByTime(twentyOne)

		await expect(() =>
			sut.execute({
				checkinId: createdCheckIn.id
			})
		).rejects.toBeInstanceOf(LateCheckInValidationError)
	})
})
