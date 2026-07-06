import {type AsyncResult, complete, isComplete} from "@attio/fetchable"
import type {LinearGqlClientError, PostToLinearOptions} from "../client/linear-gql-client"
import {createLinearGqlClient} from "../client/linear-gql-client"
import {getOrganizationDataSchema, type LinearOrganization} from "./schema"

export const getOrganizationQuery = `query Organization {
    organization {
        urlKey
        customersEnabled
    }
}`

export function createOrganizationApi(options: PostToLinearOptions) {
    const gql = createLinearGqlClient(options)

    return {
        async get(): AsyncResult<LinearOrganization, LinearGqlClientError> {
            const result = await gql({query: getOrganizationQuery}, getOrganizationDataSchema)
            if (!isComplete(result)) return result
            return complete(result.value.organization)
        },
    }
}
