import {z} from "zod"

export const linearWorkflowStateFragment = `
    id
    name
    description
    color
    position
`

export const linearWorkflowStateSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    color: z.string(),
    position: z.number(),
})

export type LinearWorkflowState = z.infer<typeof linearWorkflowStateSchema>
