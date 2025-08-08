import {z} from "zod"

export const linearOrganizationFragment = `
    urlKey
    customersEnabled
`

export const linearOrganizationSchema = z.object({
    urlKey: z.string(),
    customersEnabled: z.boolean(),
})

export type LinearOrganization = z.infer<typeof linearOrganizationSchema>
