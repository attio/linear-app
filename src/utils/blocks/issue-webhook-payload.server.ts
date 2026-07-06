/* eslint-disable attio/server-default-export */
import {z} from "zod"

const webhookPayloadSchema = z.object({
    action: z.enum(["create", "update", "remove"]),
    type: z.string(),
    data: z.object({
        id: z.string(),
        identifier: z.string(),
        title: z.string(),
        description: z.string().optional().nullable(),
        priority: z.number().optional().nullable(),
        dueDate: z.string().optional().nullable(),
        projectId: z.string().optional().nullable(),
        state: z
            .object({
                id: z.string(),
                name: z.string(),
            })
            .optional()
            .nullable(),
        assignee: z
            .object({
                id: z.string(),
                name: z.string(),
            })
            .optional()
            .nullable(),
        labelIds: z.array(z.string()).optional().nullable(),
    }),
    actor: z.object({
        id: z.string(),
        name: z.string(),
    }),
})

type ParsedPayload = z.infer<typeof webhookPayloadSchema>

export {webhookPayloadSchema}

export function buildIssueOutcomeData(data: ParsedPayload["data"], actor: ParsedPayload["actor"]) {
    return {
        issue_id: data.id,
        title: data.title,
        identifier: data.identifier,
        description: data.description ?? "",
        status_name: data.state?.name ?? "",
        status_id: data.state?.id ?? "",
        priority: data.priority ?? 0,
        due_date: data.dueDate ?? "",
        assignee_id: data.assignee?.id ?? "",
        assignee_name: data.assignee?.name ?? "",
        labels: data.labelIds ?? [],
        actor_id: actor.id,
        actor_name: actor.name,
    }
}
