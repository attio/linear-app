import {type AsyncResult, complete, errored, isComplete, type Result} from "@attio/fetchable"
import {
    createLinearGqlClient,
    type LinearGqlClientError,
    LinearGqlClientErrorCode,
    type PostToLinearOptions,
} from "../client/linear-gql-client"
import {unwrapSuccessMutation} from "../client/mutations"
import {
    type CreateWebhookInput,
    createWebhookDataSchema,
    createWebhookInputSchema,
    deleteWebhookDataSchema,
    type LinearWebhook,
    type LinearWebhookMutationResult,
} from "./schema"

const linearWebhookFragment = `
    id
`

function unwrapWebhookMutation(
    mutation: LinearWebhookMutationResult,
    errorMessage: string
): Result<LinearWebhook, LinearGqlClientError> {
    if (!mutation.success || !mutation.webhook) {
        return errored({code: LinearGqlClientErrorCode.MutationError, errorMessage})
    }
    return complete(mutation.webhook)
}

export const createWebhookQuery = `mutation WebhookCreate($input: WebhookCreateInput!) {
  webhookCreate(input: $input) {
    success
    webhook {
      ${linearWebhookFragment}
    }
  }
}`

export const deleteWebhookQuery = `mutation WebhookDelete($id: String!) {
  webhookDelete(id: $id) {
    success
  }
}`

export function createWebhookApi(options: PostToLinearOptions) {
    const gql = createLinearGqlClient(options)

    return {
        async create(input: CreateWebhookInput): AsyncResult<LinearWebhook, LinearGqlClientError> {
            const parsed = createWebhookInputSchema.parse(input)
            const result = await gql(
                {
                    query: createWebhookQuery,
                    variables: {
                        input: {
                            url: parsed.url,
                            label: parsed.label,
                            resourceTypes: [parsed.resourceType],
                            enabled: parsed.enabled ?? true,
                            teamId: parsed.teamId,
                        },
                    },
                },
                createWebhookDataSchema
            )
            if (!isComplete(result)) return result
            return unwrapWebhookMutation(result.value.webhookCreate, "Failed to create webhook")
        },

        async delete(id: string): AsyncResult<void, LinearGqlClientError> {
            const result = await gql(
                {query: deleteWebhookQuery, variables: {id}},
                deleteWebhookDataSchema
            )
            if (!isComplete(result)) return result
            return unwrapSuccessMutation(result.value.webhookDelete, "Failed to delete webhook")
        },
    }
}
