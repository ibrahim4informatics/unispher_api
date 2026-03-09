import { z } from "zod";

export const CreatePostDto = z.object({
    content: z.string({ error: "Content is required" }).min(10, { error: "Content must be at least 10 characters" }),
    type: z.enum(["FEED", "FORUM", "QUESTION", "RESOURCE", "ANNOUNCEMENT"]),
});


export type CreatePostDto = z.infer<typeof CreatePostDto>;


export const GetPostsQueryDto = z.object({
    page: z.string().refine(val => val === "" ? undefined : val).regex(/\d+/).transform(val => parseInt(val)).optional()
});


export type GetPostsQueryDto = z.infer<typeof GetPostsQueryDto>