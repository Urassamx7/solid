import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	test: {
		projects: [
			{
				test: {
					name: 'unit',
					include: ['src/test/unit/**/*.{test,spec}.ts']
				}
			},
			{
				test: {
					name: 'e2e',
					include: ['src/test/e2e/**/*.{test,spec}.ts'],
					environment:
						'./prisma/vitest-environment-prisma/prisma-test-environment.ts',
					pool: 'forks'
				}
			}
		]
	}
})
