import {z} from "zod"

const linearWorkflowStateSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    color: z.string(),
    position: z.number(),
})

export type LinearWorkflowState = z.infer<typeof linearWorkflowStateSchema>

export const listWorkflowStatesDataSchema = z.object({
    workflowStates: z.object({
        nodes: z.array(linearWorkflowStateSchema),
    }),
})
