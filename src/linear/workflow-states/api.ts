import {type AsyncResult, complete, isComplete} from "@attio/fetchable"
import type {LinearGqlClientError, PostToLinearOptions} from "../client/linear-gql-client"
import {createLinearGqlClient} from "../client/linear-gql-client"
import {type LinearWorkflowState, listWorkflowStatesDataSchema} from "./schema"

const linearWorkflowStateFragment = `
    id
    name
    description
    color
    position
`

export const listWorkflowStatesQuery = `query WorkflowStates {
  workflowStates {
    nodes {
      ${linearWorkflowStateFragment}
    }
  }
}`

export function createWorkflowStateApi(options: PostToLinearOptions) {
    const gql = createLinearGqlClient(options)

    return {
        async list(): AsyncResult<LinearWorkflowState[], LinearGqlClientError> {
            const result = await gql({query: listWorkflowStatesQuery}, listWorkflowStatesDataSchema)
            if (!isComplete(result)) return result
            return complete(
                [...result.value.workflowStates.nodes].sort((a, b) => a.position - b.position)
            )
        },
    }
}
