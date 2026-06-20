import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'
import { prisma } from '../../src/lib/prisma'

function generateDBUrl(schema: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error('DATABASE URL not provided')
	}

	const url = new URL(process.env.DATABASE_URL)

	url.searchParams.set('schema', schema)
	return url.toString()
}

export default (<Environment>{
	name: 'prisma',
	transformMode: 'ssr',
	async setup() {
		//? Criar DB de testes

		const schema = randomUUID()

		const databaseUrl = generateDBUrl(schema)

		console.log(databaseUrl)

		process.env.DATABASE_URL = databaseUrl

		execSync('bunx prisma migrate deploy')

		return {
			async teardown() {
				//? Apagar DB de testes

				await prisma.$executeRawUnsafe(
					`DROP SCHEMA IF EXISTS "${schema}" CASCADE  `
				)

				await prisma.$disconnect()
			}
		}
	}
})
