import {z} from "zod"

export const linearErrorSchema = z.object({
    errors: z
        .array(
            z.object({
                message: z.string().optional(),
                path: z.array(z.string()).optional(),
                locations: z
                    .array(
                        z.object({
                            line: z.number(),
                            column: z.number(),
                        })
                    )
                    .optional(),
                extensions: z.object({
                    type: z.string().optional(),
                    code: z.string().optional(),
                    statusCode: z.number().optional(),
                    userError: z.boolean().optional(),
                    userPresentableMessage: z.string(),
                }),
            })
        )
        .optional(),
    data: z.null().optional(),
})

export type LinearError = z.infer<typeof linearErrorSchema>