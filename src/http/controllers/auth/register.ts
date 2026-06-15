import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/use-cases/errors/auth/user-already-exists'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerSchema = z.object({
		email: z.email(),
		password: z.string().min(6),
		name: z.string().min(3)
	})

	const { email, password, name } = registerSchema.parse(request.body)

	try {
		const registerUseCase = makeRegisterUseCase()
		const user = await registerUseCase.execute({ email, password, name })
		return reply.status(201).send({
			user
		})
	} catch (error) {
		if (error instanceof UserAlreadyExistsError) {
			return reply.status(409).send({
				message: error.message
			})
		}
		throw error
	}
}
