import {z} from "zod"

const linearProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
})

export type LinearProject = z.infer<typeof linearProjectSchema>

export const getProjectDataSchema = z.object({
    project: linearProjectSchema.nullable(),
})

export const getProjectTeamIdDataSchema = z.object({
    project: z
        .object({
            teams: z.object({
                nodes: z.array(
                    z.object({
                        id: z.string(),
                    })
                ),
            }),
        })
        .nullable(),
})

export const projectsDataSchema = z.object({
    projects: z.object({
        nodes: z.array(linearProjectSchema),
    }),
})

export const searchProjectsDataSchema = z.object({
    searchProjects: z.object({
        nodes: z.array(linearProjectSchema),
    }),
})
