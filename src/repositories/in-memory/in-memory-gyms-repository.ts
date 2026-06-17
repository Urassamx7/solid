import { randomUUID } from 'node:crypto'
import { type Gym, Prisma } from '@prisma/client'
import type {
	FindManyParams,
	GymsRepository
} from '@/interfaces/gyms-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = []

	async create(data: Prisma.GymCreateInput): Promise<Gym> {
		const gym = {
			id: data.id ?? randomUUID(),
			title: data.title,
			latitude: new Prisma.Decimal(data.latitude.toString()),
			longitude: new Prisma.Decimal(data.longitude.toString()),
			description: data.description ?? null,
			phone: data.phone ?? null
		}

		this.items.push(gym)

		return gym
	}

	async findById(id: string): Promise<Gym | null> {
		const gym = this.items.find((item) => item.id === id)

		if (!gym) {
			return null
		}
		return gym
	}
	async searchMany(query: string, page = 1): Promise<Gym[]> {
		return this.items
			.filter((item) => item.title.includes(query))
			.slice((page - 1) * 20, page * 20)
	}

	async findManyNearby(params: FindManyParams): Promise<Gym[]> {
		return this.items.filter((item) => {
			const distance = getDistanceBetweenCoordinates(
				{
					latitude: params.latitude,
					longitude: params.longitude
				},
				{
					latitude: item.latitude.toNumber(),
					longitude: item.longitude.toNumber()
				}
			)
			return distance < 10
		})
	}
}
