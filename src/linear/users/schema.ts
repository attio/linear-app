import {z} from "zod"

const teamMemberSchema = z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().optional().nullable(),
})

export type LinearTeamMember = z.infer<typeof teamMemberSchema>

export const linearUserSchema = teamMemberSchema.extend({
    isMe: z.boolean(),
})

export type LinearUser = z.infer<typeof linearUserSchema>

export const getUserDataSchema = z.object({
    viewer: z.object({id: z.string()}),
    user: teamMemberSchema.nullable(),
})

export const teamUsersDataSchema = z.object({
    viewer: z.object({id: z.string()}),
    team: z
        .object({
            members: z.object({
                nodes: z.array(teamMemberSchema),
            }),
        })
        .nullable(),
})
