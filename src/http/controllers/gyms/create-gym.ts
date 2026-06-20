import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createGymSchema = z.object({
		title: z.string(),
		description: z.string().nullable(),
		phone: z.string().nullable(),
		latitude: z.number().refine((value) => {
			return Math.abs(value) <= 90
		}),
		longitude: z.number().refine((value) => {
			return Math.abs(value) <= 180
		})
	})

	const { description, latitude, longitude, phone, title } =
		createGymSchema.parse(request.body)

	const gymUseCase = makeCreateGymUseCase()
	await gymUseCase.execute({
		description,
		latitude,
		longitude,
		phone,
		title
	})

	return reply.code(201).send({
		success: true
	})
}
