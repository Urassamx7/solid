import type { Gym, Prisma } from '@prisma/client'

export interface FindManyParams {
	latitude: number
	longitude: number
}

export interface GymsRepository {
	findById(id: string): Promise<Gym | null>
	create(data: Prisma.GymCreateInput): Promise<Gym>
	searchMany(query: string, page?: number): Promise<Gym[]>
	findManyNearby(params: FindManyParams): Promise<Gym[]>
}
