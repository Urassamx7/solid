import type { FastifyInstance } from 'fastify'
import { authenticate } from './controllers/auth/authenticate'
import { profile } from './controllers/auth/profile'
import { register } from './controllers/auth/register'

export async function appRoutes(app: FastifyInstance) {
	app.post('/users', register)
	app.post('/sessions', authenticate)

	app.get('/me', profile)
}
