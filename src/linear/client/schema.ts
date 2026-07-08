import {z} from "zod"

const linearGraphqlErrorsSchema = z
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
                userPresentableMessage: z.string().optional(),
            }),
        })
    )
    .optional()

export function linearGqlResponseSchema<TDataSchema extends z.ZodType>(dataSchema: TDataSchema) {
    return z.object({
        data: dataSchema.nullish(),
        errors: linearGraphqlErrorsSchema,
    })
}

export const linearSuccessMutationResultSchema = z.object({
    success: z.boolean(),
})
