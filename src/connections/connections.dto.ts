import { z } from "zod";

export const SendConnectionRequestDto = z.object({
    receiver_id: z.uuid({ error: ({ input }) => !input ? "Receiver id is required" : "Receiver id must be a valid uuid" }),
});

export type SendConnectionRequestDto = z.infer<typeof SendConnectionRequestDto>


export const GetConnectionsRequestsQueryDto = z.object({
    sender_name:z.string().refine(val => val === "" ? undefined : val).optional(),
    page: z.string().refine(val => val === "" ? undefined : val).regex(/\d+/).transform(val => parseInt(val)).optional()
})

export type GetConnectionsRequestsQueryDto = z.infer<typeof GetConnectionsRequestsQueryDto>