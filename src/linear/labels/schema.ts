import {z} from "zod"

const linearIssueLabelSchema = z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
})

export type LinearIssueLabel = z.infer<typeof linearIssueLabelSchema>

export const getIssueLabelsDataSchema = z.object({
    issueLabels: z.object({
        nodes: z.array(linearIssueLabelSchema),
    }),
})
