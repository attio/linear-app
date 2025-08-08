import {z} from "zod"

export const linearIssueFragment = `
    id
    title
    identifier
`

export const linearIssueSchema = z.object({
    id: z.string(),
    title: z.string(),
    identifier: z.string(),
})

export type LinearIssue = z.infer<typeof linearIssueSchema>

export const createIssueInputSchema = z.object({
    teamId: z.string(),
    title: z.string(),
    description: z.string().optional(),
    projectId: z.string().optional(),
    stateId: z.string().optional(),
    priority: z.coerce.number().optional(),
    assigneeId: z.string().optional(),
})

export type CreateIssueInput = z.infer<typeof createIssueInputSchema>
