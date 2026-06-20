import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { getUserProfileUseCase } from '../auth/get-user-profile'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new getUserProfileUseCase(usersRepository)

  return useCase
}