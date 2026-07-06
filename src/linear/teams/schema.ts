import {z} from "zod"

const linearTeamSchema = z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
})

export type LinearTeam = z.infer<typeof linearTeamSchema>

export const getTeamDataSchema = z.object({
    team: linearTeamSchema.nullable(),
})

export const teamsDataSchema = z.object({
    teams: z.object({
        nodes: z.array(linearTeamSchema),
    }),
})
