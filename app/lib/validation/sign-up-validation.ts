import { z } from 'zod'

export const emailSignupSchema = z
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

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
})

export const workspaceSchema = z.object({
  workspaceIcon: z.string().min(1, 'Please select an icon'),
  workspaceName: z.string().min(1, 'Workspace name is required'),
  workspaceDescription: z.string().min(1, 'Workspace description is required'),
})

export type EmailSignupForm = z.infer<typeof emailSignupSchema>
export type ProfileForm = z.infer<typeof profileSchema>
export type WorkspaceForm = z.infer<typeof workspaceSchema>
