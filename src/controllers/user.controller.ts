import { Request, Response } from 'express'
import * as UsersModel from '../models/user.model'

export const index = (_req: Request, res: Response): void => {
  const users = UsersModel.getAll()
  res.render('users/index', { users })
}

export const show = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id as string, 10)
  const user = UsersModel.getById(id)

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

export const createAction = (req: Request, res: Response): void => {
  const { firstName, lastName, email, membershipType } = req.body
  const newUser = UsersModel.create({ firstName, lastName, email, membershipType })
  res.redirect(`/users/${newUser.id}`)
}

export const editForm = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id as string, 10)
  const user = UsersModel.getById(id)
  if (!user) {
    res.status(404).render('404', { message: 'User not found' })
    return
  }

  res.render('users/edit', { user })
}

export const editAction = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id as string, 10)
  const { firstName, lastName, email, membershipType } = req.body
  const updated = UsersModel.update(id, { firstName, lastName, email, membershipType })
  if (!updated) {
    res.status(404).render('404', { message: 'User not found' })
    return
  }
  res.redirect(`/users/${id}`)
}

export const deleteAction = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id as string, 10)
  const deleted = UsersModel.remove(id)
  if (!deleted) {
    res.status(404).render('404', { message: 'User not found' })
    return
  }
  res.redirect('/users')
}
