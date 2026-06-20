import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		tsconfigPaths: true
	},

	test: {
		projects: [
			{
				test: {
					name: 'unit',
					include: ['src/test/unit/**/*.test.ts'],
					environment: 'node'
				}
			},
			{
				test: {
					name: 'e2e',
					include: ['src/test/e2e/**/*.test.ts'],
					environment:
						'./prisma/vitest-environment-prisma/prisma-test-environment.ts',
					pool: 'forks'
				}
			}
		]
	}
})
