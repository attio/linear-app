import {z} from "zod"

export const linearTeamMemberFragment = `
    id
    name
    avatarUrl
`

export const teamMemberSchema = z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().optional().nullable(),
})

export type TeamMember = z.infer<typeof teamMemberSchema>

export const queryResultSchema = z.object({
    data: z.object({
        users: z.object({
            nodes: z.array(teamMemberSchema),
        }),
        viewer: z.object({
            id: z.string(),
        }),
    }),
})

export const linearUserSchema = teamMemberSchema.extend({
    isMe: z.boolean(),
})

export type LinearUser = z.infer<typeof linearUserSchema>
