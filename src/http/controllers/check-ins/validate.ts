import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
	// const userId = request.user.sub
	const validateCheckInParamsSchema = z.object({
		checkinId: z.uuid()
	})

	const { checkinId } = validateCheckInParamsSchema.parse(request.params)

	const validateCheckInUseCase = makeValidateCheckInUseCase()
	await validateCheckInUseCase.execute({
		checkinId
	})

	return reply.code(204).send()
}
