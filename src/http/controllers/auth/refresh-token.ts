import type { FastifyReply, FastifyRequest } from 'fastify'
import { REFRESH_COOKIE } from '@/utils/constants'
import { env } from '@/utils/env'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
	await request.jwtVerify({
		onlyCookie: true
	})

	const userId = request.user.sub

	const token = await reply.jwtSign(
		{},
		{
			sign: {
				sub: userId
			}
		}
	)

	const refreshToken = await reply.jwtSign(
		{},
		{
			sign: {
				sub: userId,
				expiresIn: '7d'
			}
		}
	)

	return reply
		.setCookie(REFRESH_COOKIE, refreshToken, {
			path: '/',
			secure: env.NODE_ENV === 'production',
			sameSite: true,
			httpOnly: true
		})
		.code(200)
		.send({ token })
}
