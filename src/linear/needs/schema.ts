import {z} from "zod"

export const customerNeedSchema = z.object({
    id: z.string(),
})

export type LinearCustomerNeed = z.infer<typeof customerNeedSchema>

export const customerNeedCreateInputSchema = z.object({
    /** The identifier in UUID v4 format. If none is provided, the backend will generate one. */
    id: z.string().optional(),
    /** The body of the customer need. */
    body: z.string(),
    /** The id of the customer. */
    customerId: z.string(),
    /** The id of the project. */
    projectId: z.string().optional(),
    /** The id of the issue. */
    issueId: z.string().optional(),
    /** The priority of the customer need. */
    priority: z.number().optional(),
    /** A URL to an attachment. */
    attachmentUrl: z.string().optional(),
})

export type CustomerNeedCreateInput = z.infer<typeof customerNeedCreateInputSchema>
