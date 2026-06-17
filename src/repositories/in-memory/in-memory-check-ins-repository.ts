import { randomUUID } from 'node:crypto'
import type { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
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

	async findByUserIdOnDate(
		userId: string,
		date: Date
	): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf('date')
		const endOfTheDay = dayjs(date).endOf('date')

		const checkInOnSameDate = this.items.find((checkIn) => {
			const checkInDate = dayjs(checkIn.createdAt)
			const isOnSameDate =
				checkInDate.isAfter(startOfTheDay) &&
				checkInDate.isBefore(endOfTheDay)

			return checkIn.userId === userId && isOnSameDate
		})

		if (!checkInOnSameDate) {
			return null
		}

		return checkInOnSameDate
	}
}
