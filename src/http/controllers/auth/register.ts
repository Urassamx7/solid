import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ConflictError } from '@/http/errors/conflict-error'
import { registerUseCase } from '@/use-cases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerSchema = z.object({
		email: z.email(),
		password: z.string().min(6),
		name: z.string().min(3)
	})

	const { email, password, name } = registerSchema.parse(request.body)

	try {
		const user = await registerUseCase({ email, password, name })
		return reply.status(201).send({
			id: user.id
		})
	} catch (error) {
		if (error instanceof ConflictError) {
			return reply.status(409).send({
				message: error.message
			})
		}
		return reply.status(500).send({
			message: 'Internal server error'
		})
	}
}
