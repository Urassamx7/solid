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

	async countByUserId(userId: string): Promise<number> {
		return this.items.filter((item) => item.userId === userId).length
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

	async findManyByUserId(
		userId: string,
		page: number = 1,
		limit: number = 20
	): Promise<CheckIn[]> {
		const checkIns = this.items
			.filter((item) => item.userId === userId)
			.slice((page - 1) * limit, page * limit)

		return checkIns
	}

	async findById(id: string): Promise<CheckIn | null> {
		const checkIn = this.items.find((item) => item.id === id)

		if (!checkIn) {
			return null
		}

		return checkIn
	}

	async save(checkIn: CheckIn): Promise<CheckIn> {
		const checkInIndex = this.items.findIndex(
			(item) => item.id === checkIn.id
		)

		if (checkInIndex >= 0) {
			this.items[checkInIndex] = checkIn
		}

		return checkIn
	}
}
