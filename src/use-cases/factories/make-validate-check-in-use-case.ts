import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckinUseCase } from '../check-in/validate-check-in'

export function makeValidateCheckInUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository()
	const useCase = new ValidateCheckinUseCase(checkInsRepository)

	return useCase
}
