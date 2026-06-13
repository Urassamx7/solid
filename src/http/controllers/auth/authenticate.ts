import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/auth/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/auth/invalid-credentials-error'

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply
) {
	let token: string

	const authenticateSchema = z.object({
		email: z.email(),
		password: z.string().min(6)
	})

	const { email, password } = authenticateSchema.parse(request.body)

	try {
		const prismaUserRepository = new PrismaUsersRepository()
		const authenticateUseCase = new AuthenticateUseCase(
			prismaUserRepository
		)

		await authenticateUseCase.execute({ email, password })
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return reply.status(400).send({
				message: error.message
			})
		}
		throw error
	}

	return reply.status(200).send()
}
