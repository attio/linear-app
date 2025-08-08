import {z} from "zod"

export const linearProjectFragment = `
    id
    name
    color
`

export const linearProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
})

export type LinearProject = z.infer<typeof linearProjectSchema>
