import { z } from 'zod'

export const messageValidator = z.object({
  chatId: z.string(),
  senderId: z.string(),
  text: z.string(),
  timeStamp: z.string(),
})

export const messageArrayValidator = z.array(messageValidator)

export type Message = z.infer<typeof messageValidator>
