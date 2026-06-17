import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymUseCase } from '@/use-cases/gym/search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new SearchGymUseCase(gymsRepository)
	})

	it('should able to search for gyms', async () => {
		await gymsRepository.create({
			title: 'Js academy',
			description: null,
			latitude: -25.9532738,
			longitude: 32.571906,
			phone: null
		})

		await gymsRepository.create({
			title: 'Ts academy',
			description: null,
			latitude: -25.9532738,
			longitude: 32.571906,
			phone: null
		})

		const { gyms } = await sut.execute({
			query: 'Js'
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([
			expect.objectContaining({
				title: 'Js academy'
			})
		])
	})

	it('should able to fetch paginated search gyms', async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `Ts academy ${i}`,
				description: null,
				latitude: -25.9532738,
				longitude: 32.571906,
				phone: null
			})
		}

		const { gyms } = await sut.execute({
			query: 'Ts',
			page: 2
		})

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'Ts academy 21' }),
			expect.objectContaining({ title: 'Ts academy 22' })
		])
	})
})
