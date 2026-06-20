import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.string(),
	JWT_SECRET_KEY: z.string().min(1),
	JWT_EXP_IN: z.string().default('15m')
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
	console.error('Invalid environment variables:', _env.error.format())
	throw new Error('Invalid environment variables')
}

export const env = _env.data
