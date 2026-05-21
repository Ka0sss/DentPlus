import { Request, Response } from 'express'
import * as UsersModel from '../models/user.model.js'

export const index = async (_req: Request, res: Response): Promise<void> => {
  const users = await UsersModel.getAll()
  res.render('users/index', { users })
}

export const show = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string, 10)
  const user = await UsersModel.getById(id)

  if (!user) {
    res.status(404).render('404', { message: 'User not found' })
    return
  }

  const amountQuery = req.query.amount as string
  let resultMessage = ''
  let amount = ''

  if (amountQuery) {
    const parsedAmount = parseFloat(amountQuery)
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      amount = amountQuery
      const { discountPercentage, finalTotal } = UsersModel.calculateDiscount(user.membershipType, parsedAmount)
      // Formato CLP: Redondeamos el valor y aplicamos locale de Chile (punto de miles, sin decimales)
      const formattedTotal = Math.round(finalTotal).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
      resultMessage = `Descuento aplicado: ${discountPercentage * 100}%. Total a pagar: ${formattedTotal}`
    } else {
      resultMessage = 'Por favor, ingrese un monto válido.'
    }
  }

  res.render('users/show', { user, amount, resultMessage })
}

export const createForm = (_req: Request, res: Response): void => {
  res.render('users/create')
}

export const createAction = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, membershipType } = req.body
  const newUser = await UsersModel.create({ firstName, lastName, email, membershipType })
  res.redirect(`/users/${newUser.id}`)
}

export const editForm = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string, 10)
  const user = await UsersModel.getById(id)
  if (!user) {
    res.status(404).render('404', { message: 'User not found' })
    return
  }

  res.render('users/edit', { user })
}

export const editAction = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string, 10)
  const { firstName, lastName, email, membershipType } = req.body

  try {
    await UsersModel.update(id, { firstName, lastName, email, membershipType })
    res.redirect(`/users/${id}`)
  } catch (error) {
    res.status(404).render('404', { message: 'User not found' })
  }
}

export const deleteAction = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string, 10)
  try {
    await UsersModel.remove(id)
    res.redirect('/users')
  } catch (error) {
    res.status(404).render('404', { message: 'User not found' })
  }
}
