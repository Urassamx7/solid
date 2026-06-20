import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const userId = request.user.sub

	const createCheckInBodySchema = z.object({
		latitude: z.number().refine((value) => {
			return Math.abs(value) <= 90
		}),
		longitude: z.number().refine((value) => {
			return Math.abs(value) <= 180
		})
	})

	const checkInParamsSchema = z.object({
		gymId: z.uuid()
	})

	const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

	const { gymId } = checkInParamsSchema.parse(request.params)

	const checkInUseCase = makeCheckInUseCase()
	await checkInUseCase.execute({
		gymId,
		userId,
		userLatitude: latitude,
		userLongitude: longitude
	})

	return reply.code(201).send({
		success: true
	})
}
