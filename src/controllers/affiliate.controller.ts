import { Request, Response } from 'express'
import * as AffiliateModel from '../models/affiliate.model.js'
import { affiliateSchema } from '../schema/affiliate.schema.js'
import { formatZodErrors } from '../lib/parseError.js'

export const index = async (req: Request, res: Response) => {
  const userId = req.session.userId!
  const affiliates = await AffiliateModel.getAll(userId)
  res.render('affiliates/index', { affiliates })
}

export const show = async (req: Request, res: Response) => {
  const userId = req.session.userId!
  const id = parseInt(req.params.id as string, 10)
  const affiliate = await AffiliateModel.getById(id, userId)

  if (!affiliate) {
    return res.status(404).render('404', { message: 'Affiliate not found' })
  }

  // Simulador de citas
  const amountStr = req.query.amount as string
  let resultMessage = ''
  let amount = ''

  if (amountStr) {
    const val = parseFloat(amountStr)
    if (!isNaN(val) && val >= 0) {
      const { discountPercentage, finalTotal } = AffiliateModel.calculateDiscount(affiliate.membershipType, val)
      const discountAmount = val * discountPercentage
      resultMessage = `Descuento aplicado: ${discountPercentage * 100}% ($${discountAmount.toLocaleString('es-CL')}). Total a pagar: $${finalTotal.toLocaleString('es-CL')}`
      amount = amountStr
    }
  }

  res.render('affiliates/show', { affiliate, amount, resultMessage })
}

export const createForm = (_req: Request, res: Response) => {
  res.render('affiliates/create')
}

export const createAction = async (req: Request, res: Response) => {
  const userId = req.session.userId!
  const result = affiliateSchema.safeParse(req.body)

  if (!result.success) {
    return res.render('affiliates/create', {
      errors: formatZodErrors(result.error),
      values: req.body
    })
  }

  try {
    const newAffiliate = await AffiliateModel.create({
      ...result.data,
      userId
    })
    res.redirect(`/affiliates/${newAffiliate.id}`)
  } catch (error: unknown) {
    // Código de violación de restricción única en Prisma para PostgreSQL es P2002
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return res.render('affiliates/create', {
        errors: { email: 'Este correo electrónico ya está registrado' },
        values: req.body
      })
    }
    throw error
  }
}

export const editForm = async (req: Request, res: Response) => {
  const userId = req.session.userId!
  const id = parseInt(req.params.id as string, 10)
  const affiliate = await AffiliateModel.getById(id, userId)

  if (!affiliate) {
    return res.status(404).render('404', { message: 'Affiliate not found' })
  }

  res.render('affiliates/edit', { affiliate })
}

export const editAction = async (req: Request, res: Response) => {
  const userId = req.session.userId!
  const id = parseInt(req.params.id as string, 10)
  const result = affiliateSchema.safeParse(req.body)

  if (!result.success) {
    const affiliate = await AffiliateModel.getById(id, userId)
    return res.render('affiliates/edit', {
      affiliate: { ...affiliate, ...req.body },
      errors: formatZodErrors(result.error)
    })
  }

  try {
    await AffiliateModel.update(id, userId, result.data)
    res.redirect(`/affiliates/${id}`)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      const affiliate = await AffiliateModel.getById(id, userId)
      return res.render('affiliates/edit', {
        affiliate: { ...affiliate, ...req.body },
        errors: { email: 'Este correo electrónico ya está registrado' }
      })
    }
    res.status(404).render('404', { message: 'Affiliate not found' })
  }
}

export const deleteAction = async (req: Request, res: Response) => {
  const userId = req.session.userId!
  const id = parseInt(req.params.id as string, 10)

  try {
    await AffiliateModel.remove(id, userId)
    res.redirect('/affiliates')
  } catch {
    res.status(404).render('404', { message: 'Affiliate not found' })
  }
}
