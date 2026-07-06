import {type AsyncResult, complete, isComplete} from "@attio/fetchable"
import type {LinearGqlClientError, PostToLinearOptions} from "../client/linear-gql-client"
import {createLinearGqlClient} from "../client/linear-gql-client"
import {type LinearPriority, listPrioritiesDataSchema} from "./schema"

const linearPriorityFragment = `
    priority
    label
`

export const listPrioritiesQuery = `query Priorities {
  issuePriorityValues {
      ${linearPriorityFragment}
  }
}`

export function createPriorityApi(options: PostToLinearOptions) {
    const gql = createLinearGqlClient(options)

    return {
        async list(): AsyncResult<LinearPriority[], LinearGqlClientError> {
            const result = await gql({query: listPrioritiesQuery}, listPrioritiesDataSchema)
            if (!isComplete(result)) return result
            return complete(
                [...result.value.issuePriorityValues].sort((a, b) => a.priority - b.priority)
            )
        },
    }
}
