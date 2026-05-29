import prisma from '../lib/prisma.js'
import type { Prisma } from '@prisma/client'

export const getAll = async (userId: number) => {
  return await prisma.affiliate.findMany({
    where: { userId }
  })
}

export const getById = async (id: number, userId: number) => {
  return await prisma.affiliate.findFirst({
    where: { id, userId }
  })
}

export const getByEmail = async (email: string, userId: number) => {
  return await prisma.affiliate.findFirst({
    where: { email, userId }
  })
}

export const create = async (data: Prisma.AffiliateUncheckedCreateInput) => {
  return await prisma.affiliate.create({
    data
  })
}

export const update = async (id: number, userId: number, data: Prisma.AffiliateUncheckedUpdateInput) => {
  return await prisma.affiliate.update({
    where: { id, userId },
    data
  })
}

export const remove = async (id: number, userId: number) => {
  return await prisma.affiliate.delete({
    where: { id, userId }
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
