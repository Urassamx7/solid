import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/auth/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const authenticateSchema = z.object({
		email: z.email(),
		password: z.string().min(6)
	})

	const { email, password } = authenticateSchema.parse(request.body)

	try {
		const authenticateUseCase = makeAuthenticateUseCase()

		const payload = await authenticateUseCase.execute({ email, password })

		const token = await reply.jwtSign(
			{},
			{
				sign: {
					sub: payload.user.id
				}
			}
		)

		return reply.code(200).send({ token })
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return reply.status(400).send({
				message: error.message
			})
		}
		throw error
	}
}
