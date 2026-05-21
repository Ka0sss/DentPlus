import prisma from '../lib/prisma.js'
import type { Prisma } from '../generated/prisma/client/index.js'

export const getAll = async () => {
  return await prisma.user.findMany()
}

export const getById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id }
  })
}

export const create = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data
  })
}

export const update = async (id: number, data: Prisma.UserUpdateInput) => {
  return await prisma.user.update({
    where: { id },
    data
  })
}

export const remove = async (id: number) => {
  return await prisma.user.delete({
    where: { id }
  })
}

// Esta es tu lógica de negocio para la simulación de citas, la mantenemos exactamente igual
export const calculateDiscount = (membershipType: string, amount: number) => {
  let discountPercentage = 0
  if (membershipType.toLowerCase() === 'silver') discountPercentage = 0.05
  else if (membershipType.toLowerCase() === 'gold') discountPercentage = 0.10
  else if (membershipType.toLowerCase() === 'platinum') discountPercentage = 0.15

  const finalTotal = amount - (amount * discountPercentage)
  return { discountPercentage, finalTotal }
}
