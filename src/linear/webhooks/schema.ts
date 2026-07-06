import {z} from "zod"
import {linearSuccessMutationResultSchema} from "../client/schema"

const linearWebhookSchema = z.object({
    id: z.string(),
})

const linearWebhookMutationResultSchema = linearSuccessMutationResultSchema.extend({
    webhook: linearWebhookSchema.nullable(),
})

export type LinearWebhook = z.infer<typeof linearWebhookSchema>

export type LinearWebhookMutationResult = z.infer<typeof linearWebhookMutationResultSchema>

export const createWebhookDataSchema = z.object({
    webhookCreate: linearWebhookMutationResultSchema,
})

export const deleteWebhookDataSchema = z.object({
    webhookDelete: linearSuccessMutationResultSchema,
})

export const createWebhookInputSchema = z.object({
    url: z.string(),
    label: z.string(),
    resourceType: z.string(),
    teamId: z.string(),
    enabled: z.boolean().optional(),
})

export type CreateWebhookInput = z.infer<typeof createWebhookInputSchema>
