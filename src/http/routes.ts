import type { FastifyInstance } from 'fastify'
import { register } from './controllers/auth/register'

export async function appRoutes(app: FastifyInstance) {
	app.post('/users', register)
}
