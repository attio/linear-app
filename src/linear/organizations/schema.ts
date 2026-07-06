import {z} from "zod"

const linearOrganizationSchema = z.object({
    urlKey: z.string(),
    customersEnabled: z.boolean(),
})

export const getOrganizationDataSchema = z.object({
    organization: linearOrganizationSchema,
})

export type LinearOrganization = z.infer<typeof linearOrganizationSchema>
