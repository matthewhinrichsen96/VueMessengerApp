import { z } from 'zod'

export const chatValidator = z.object({
  userId: z.string(),
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  avatar: z.string(),
})

export const chatArrayValidator = z.array(chatValidator)

export type User = z.infer<typeof chatValidator>