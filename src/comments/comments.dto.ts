import { z } from "zod";


export const CreateCommentDto = z.object({

    content: z.string({ error: ({ input }) => !input ? "content is required" : "Content should be string" }).max(500, { error: "Content should not be longer than 500 character" }),
    post_id: z.number({ error: ({ input }) => !input ? "Post id is required" : "Post id must be number" })

})

export type CreateCommentDto = z.infer<typeof CreateCommentDto>





export const UpdateCommentDto = z.object({
    content: z.string({ error: ({ input }) => !input ? "content is required" : "Content should be string" }).max(500, { error: "Content should not be longer than 500 character" }),

})

export type UpdateCommentDto = z.infer<typeof UpdateCommentDto>