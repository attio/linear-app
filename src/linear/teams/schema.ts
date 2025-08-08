import {z} from "zod"

export const linearTeamFragment = `
    id
    name
    color
`

export const linearTeamSchema = z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
})

export type LinearTeam = z.infer<typeof linearTeamSchema>
