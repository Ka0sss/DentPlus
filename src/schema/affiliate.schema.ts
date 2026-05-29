import { z } from 'zod'

export const affiliateSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().min(1, 'El correo electrónico es requerido').email('El correo electrónico no es válido'),
  membershipType: z.string().min(1, 'El tipo de membresía es requerido')
})

export type AffiliateInput = z.infer<typeof affiliateSchema>
