import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../auth/register'

export function makeRegisterUseCase() {
	const prismaUserRepository = new PrismaUsersRepository()
	const registerUseCase = new RegisterUseCase(prismaUserRepository)

	return registerUseCase
}
