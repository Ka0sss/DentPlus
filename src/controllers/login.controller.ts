import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import * as UserModel from '../models/user.model.js'
import { loginSchema, registerSchema } from '../schema/auth.schema.js'
import { formatZodErrors } from '../lib/parseError.js'

export const loginForm = (_req: Request, res: Response) => {
  res.render('login/login')
}

export const loginAction = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body)

  if (!result.success) {
    return res.render('login/login', {
      errors: formatZodErrors(result.error),
      values: req.body
    })
  }

  const { email, password } = result.data
  const user = await UserModel.findByEmail(email)

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render('login/login', {
      error: 'Credenciales incorrectas',
      values: req.body
    })
  }

  req.session.userId = user.id
  res.redirect('/affiliates')
}

export const registerForm = (_req: Request, res: Response) => {
  res.render('login/register')
}

export const registerAction = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body)

  if (!result.success) {
    return res.render('login/register', {
      errors: formatZodErrors(result.error),
      values: req.body
    })
  }

  const { email, password } = result.data
  const existing = await UserModel.findByEmail(email)

  if (existing) {
    return res.render('login/register', {
      error: 'Este email ya está registrado',
      values: req.body
    })
  }

  const hash = await bcrypt.hash(password, 10)
  const user = await UserModel.create({ email, password: hash })
  req.session.userId = user.id
  res.redirect('/affiliates')
}

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
}
