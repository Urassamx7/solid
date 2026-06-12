import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const HASH_SALT = 6

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerSchema = z.object({
		email: z.email(),
		password: z.string().min(6),
		name: z.string().min(3)
	})

	const { email, password, name } = registerSchema.parse(request.body)

	const exists = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (exists) {
		return reply.status(409).send({ message: 'User already exists' })
	}

	const passwordHash = await bcrypt.hash(password, HASH_SALT)

	const user = await prisma.user.create({
		data: {
			email,
			passwordHash,
			name
		}
	})

	return reply.status(201).send({
		id: user.id
	})
}
