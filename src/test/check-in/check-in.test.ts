import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckinUseCase } from '@/use-cases/check-in/check-in'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRespository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check in Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRespository = new InMemoryGymsRepository()
		sut = new CheckinUseCase(checkInsRepository, gymsRespository)

		await gymsRespository.create({
			id: 'gym-01',
			title: 'Academia Ts Gym',
			phone: null,
			description: null,
			latitude: -25.9532738,
			longitude: 32.571906
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should able to create check-in', async () => {
		vi.setSystemTime(new Date(2026, 0, 20))

		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -25.9532738,
			userLongitude: 32.571906
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	//? red -> green -> refactor => TDD concepts
	it('should not be able to check-in twice in the same day', async () => {
		vi.setSystemTime(new Date(2026, 0, 20, 2, 0, 0))

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -25.9532738,
			userLongitude: 32.571906
		})

		await expect(() =>
			sut.execute({
				gymId: 'gym-01',
				userId: 'user-01',
				userLatitude: -25.9532738,
				userLongitude: 32.571906
			})
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
	})

	it('should be able to check-in twice in different days', async () => {
		vi.setSystemTime(new Date(2026, 0, 20, 2, 0, 0))

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -25.9532738,
			userLongitude: 32.571906
		})

		vi.setSystemTime(new Date(2026, 0, 21, 2, 0, 0))

		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -25.9532738,
			userLongitude: 32.571906
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check-in on distant gym', async () => {
		vi.setSystemTime(new Date(2026, 0, 20))

		gymsRespository.items.push({
			id: 'gym-02',
			title: 'Academia Ts Gym',
			phone: '',
			description: null,
			latitude: new Decimal(-25.8515238),
			longitude: new Decimal(32.6296332)
		})

		await expect(() =>
			sut.execute({
				gymId: 'gym-02',
				userId: 'user-01',
				userLatitude: -25.9532738,
				userLongitude: 32.571906
			})
		).rejects.toBeInstanceOf(MaxDistanceError)
	})
})
