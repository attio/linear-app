import {z} from "zod"

const linearPrioritySchema = z.object({
    priority: z.number(),
    label: z.string(),
})

export type LinearPriority = z.infer<typeof linearPrioritySchema>

export const listPrioritiesDataSchema = z.object({
    issuePriorityValues: z.array(linearPrioritySchema),
})
