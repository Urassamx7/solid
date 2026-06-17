import type { Gym, Prisma } from '@prisma/client'
import type {
	FindManyParams,
	GymsRepository
} from '@/interfaces/gyms-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
	async create(data: Prisma.GymCreateInput) {
		const gym = await prisma.gym.create({ data })
		return gym
	}
	async searchMany(query: string, page = 1) {
		const gyms = await prisma.gym.findMany({
			where: {
				title: {
					contains: query
				}
			},
			take: 20,
			skip: (page - 1) * 20
		})

		return gyms
	}
	async findById(id: string) {
		const gym = await prisma.gym.findUnique({
			where: { id }
		})

		return gym
	}

	async findManyNearby({ latitude, longitude }: FindManyParams) {
		const gyms = await prisma.$queryRaw<Gym[]>`
		SELECT * FROM gyms
		WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
		`
		return gyms
	}
}
