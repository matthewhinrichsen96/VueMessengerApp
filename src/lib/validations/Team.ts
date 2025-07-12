import { z } from 'zod'

export const teamValidator = z.object({
  name: z.string(),
  avatar: z.string()
})

export const teamArrayValidator = z.array(teamValidator)

export type Team = z.infer<typeof teamValidator>