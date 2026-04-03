import { z } from "zod";

export const CreateChatDto = z.object({
    receiver_id: z.uuid({ error: ({ input }) => !input ? "receiver id is required" : "invalid user id" })
})
export type CreateChatDto = z.infer<typeof CreateChatDto>