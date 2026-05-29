import prisma from '../lib/prisma.js'
import type { Prisma } from '@prisma/client'

export const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email }
  })
}

export const findById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id }
  })
}

export const create = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data
  })
}
