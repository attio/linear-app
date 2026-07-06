import {type Mock, vi} from "vitest"
import type {linearGqlClient, PostToLinearOptions} from "../linear-gql-client"

export const mockLinearGqlClient: Mock<typeof linearGqlClient> = vi.fn()

export {mockLinearGqlClient as linearGqlClient}

export function createLinearGqlClient(options: PostToLinearOptions) {
    return (request: unknown, schema: unknown) =>
        mockLinearGqlClient(request, {requestUsing: options.requestUsing, schema} as never)
}

export enum LinearGqlClientErrorCode {
    HttpError = "http_error",
    NetworkError = "network_error",
    ValidationError = "validation_error",
    MutationError = "mutation_error",
}
