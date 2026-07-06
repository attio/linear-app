import {z} from "zod"
import {linearSuccessMutationResultSchema} from "../client/schema"

const linearIssueLabelSchema = z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
})

const linearIssueSchema = z.object({
    id: z.string(),
    title: z.string(),
    identifier: z.string(),
    description: z.string().nullable(),
    priority: z.number(),
    dueDate: z.string().nullable(),
    state: z
        .object({
            id: z.string(),
            name: z.string(),
            color: z.string(),
            type: z.string(),
        })
        .nullable(),
    assignee: z
        .object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
        })
        .nullable(),
    labels: z.object({
        nodes: z.array(linearIssueLabelSchema),
    }),
})

const linearIssueMutationResultSchema = linearSuccessMutationResultSchema.extend({
    issue: linearIssueSchema.nullable(),
})

const _createIssueInputSchema = z.object({
    teamId: z.string(),
    title: z.string(),
    description: z.string().optional(),
    projectId: z.string().optional(),
    stateId: z.string().optional(),
    priority: z.coerce.number().optional(),
    assigneeId: z.string().optional(),
    labelIds: z.array(z.string()).optional(),
})

const updateIssueInputSchema = z.object({
    projectId: z.string().optional(),
    stateId: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    priority: z.coerce.number().optional(),
    assigneeId: z.string().optional(),
    labelIds: z.array(z.string()).optional(),
})

export type LinearIssue = z.infer<typeof linearIssueSchema>

export type LinearIssueMutationResult = z.infer<typeof linearIssueMutationResultSchema>

export const getIssueDataSchema = z.object({issue: linearIssueSchema.nullable()})

export const createIssueDataSchema = z.object({issueCreate: linearIssueMutationResultSchema})

export const deleteIssueDataSchema = z.object({issueDelete: linearSuccessMutationResultSchema})

export const searchIssuesDataSchema = z.object({
    searchIssues: z.object({
        nodes: z.array(linearIssueSchema),
    }),
})

export const listIssuesDataSchema = z.object({
    issues: z.object({
        nodes: z.array(linearIssueSchema),
    }),
})

export const updateIssueDataSchema = z.object({issueUpdate: linearIssueMutationResultSchema})

export type CreateIssueInput = z.infer<typeof _createIssueInputSchema>

export type UpdateIssueInput = z.infer<typeof updateIssueInputSchema>

export {linearIssueSchema}

export {updateIssueInputSchema}
