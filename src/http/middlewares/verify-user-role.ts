import type { Role } from '@prisma/client'
import type { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: Role) {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const { role } = request.user

		if (role !== roleToVerify) {
			return reply.status(403).send({
				message: 'Forbidden.'
			})
		}
	}
}
