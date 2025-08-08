import {z} from "zod"

export const linearPriorityFragment = `
    priority
    label
`

export const linearPrioritySchema = z.object({
    priority: z.number(),
    label: z.string(),
})

export type LinearPriority = z.infer<typeof linearPrioritySchema>
