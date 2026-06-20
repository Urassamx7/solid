import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { ZodError, z } from 'zod'
import { authRoutes } from './http/controllers/auth/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { REFRESH_COOKIE } from './utils/constants'
import { env } from './utils/env'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCookie)

app.register(fastifyJwt, {
	secret: env.JWT_SECRET_KEY,
	cookie: {
		cookieName: REFRESH_COOKIE,
		signed: false
	},
	sign: {
		expiresIn: env.JWT_EXP_IN
	}
})

app.register(authRoutes)
app.register(checkInsRoutes)
app.register(gymsRoutes)

app.setErrorHandler((error, _request, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: 'Validation error',
			issues: z.treeifyError(error)
		})
	}
	if (env.NODE_ENV !== 'production') {
		console.error(error)
	} else {
		// todo: Log into an error tracker tool, like sentry etc.
	}
	return reply.status(500).send({
		message: 'Internal server error'
	})
})
