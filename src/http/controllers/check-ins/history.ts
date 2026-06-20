import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
	const userId = request.user.sub

	const checkInHistoryQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1)
	})

	const { page } = checkInHistoryQuerySchema.parse(request.body)

	const fetchHistoryUserCheckInHistoryUseCase =
		makeFetchUserCheckInsHistoryUseCase()

	const { checkIns } = await fetchHistoryUserCheckInHistoryUseCase.execute({
		userId,
		page
	})

	return reply.code(200).send({
		checkIns
	})
}
