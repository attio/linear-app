import {complete, errored, type Result} from "@attio/fetchable"
import type {z} from "zod"
import {type LinearGqlClientError, LinearGqlClientErrorCode} from "./linear-gql-client"
import type {linearSuccessMutationResultSchema} from "./schema"

export function unwrapSuccessMutation(
    mutation: z.infer<typeof linearSuccessMutationResultSchema>,
    errorMessage: string
): Result<void, LinearGqlClientError> {
    if (!mutation.success) {
        return errored({
            code: LinearGqlClientErrorCode.MutationError,
            errorMessage,
        })
    }

    return complete(undefined)
}
