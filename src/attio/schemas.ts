import {z} from "zod"

const actorSchema = z.object({
    type: z.string().nullable(),
    id: z.string().nullable(),
})

export const attioCompanySchema = z.object({
    id: z.object({
        workspace_id: z.string(),
        object_id: z.string(),
        record_id: z.string(),
    }),
    created_at: z.string(),
    web_url: z.string(),
    values: z.object({
        domains: z.array(
            z.object({
                active_from: z.string(),
                active_until: z.string().nullable(),
                created_by_actor: actorSchema,
                domain: z.string(),
                root_domain: z.string(),
                attribute_type: z.string(),
            })
        ),
        name: z.array(
            z.object({
                active_from: z.string(),
                active_until: z.string().nullable(),
                created_by_actor: actorSchema,
                value: z.string(),
                attribute_type: z.string(),
            })
        ),
        description: z.array(
            z.object({
                active_from: z.string(),
                active_until: z.string().nullable(),
                created_by_actor: actorSchema,
                value: z.string(),
                attribute_type: z.string(),
            })
        ),
        logo_url: z
            .array(
                z.object({
                    active_from: z.string(),
                    active_until: z.string().nullable(),
                    created_by_actor: actorSchema,
                    value: z.string(),
                    attribute_type: z.string(),
                })
            )
            .optional(),
        revenue: z
            .array(
                z.object({
                    active_from: z.string(),
                    active_until: z.string().nullable(),
                    created_by_actor: actorSchema,
                    value: z.number(),
                    attribute_type: z.string(),
                })
            )
            .optional(),
        size: z
            .array(
                z.object({
                    active_from: z.string(),
                    active_until: z.string().nullable(),
                    created_by_actor: actorSchema,
                    value: z.number(),
                    attribute_type: z.string(),
                })
            )
            .optional(),
    }),
})

export type AttioCompany = z.infer<typeof attioCompanySchema>
