import { randomUUID } from 'node:crypto'
import type { CheckIn, Prisma } from '@prisma/client'
import type { CheckInsRepository } from '@/interfaces/check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public items: CheckIn[] = []

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const CheckIn = {
			id: randomUUID(),
			userId: data.userId,
			gymId: data.gymId,
			createdAt: new Date(),
			validatedAt: data.validatedAt ? new Date() : null
		}

		this.items.push(CheckIn)

		return CheckIn
	}
}
