import type { FastifyInstance } from 'fastify'
import { authenticate } from './controllers/auth/authenticate'
import { profile } from './controllers/auth/profile'
import { register } from './controllers/auth/register'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
	app.post('/users', register)
	app.post('/sessions', authenticate)

	//! Authenticated routes
	app.get('/me', { onRequest: [verifyJWT] }, profile)
}
