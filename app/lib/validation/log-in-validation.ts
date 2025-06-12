import { z } from 'zod'

export const emailLoginSchema = z
  .object({
    method: z.string().min(1, 'Please select a signup method'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type EmailLoginForm = z.infer<typeof emailLoginSchema>
