import {type AsyncResult, complete, isComplete} from "@attio/fetchable"
import type {LinearGqlClientError, PostToLinearOptions} from "../client/linear-gql-client"
import {createLinearGqlClient} from "../client/linear-gql-client"
import {getIssueLabelsDataSchema, type LinearIssueLabel} from "./schema"

const linearIssueLabelFragment = `
    id
    name
    color
`

export const getIssueLabelsQuery = `query IssueLabels {
  issueLabels {
    nodes {
      ${linearIssueLabelFragment}
    }
  }
}`

export function createLabelApi(options: PostToLinearOptions) {
    const gql = createLinearGqlClient(options)

    return {
        async list(): AsyncResult<LinearIssueLabel[], LinearGqlClientError> {
            const result = await gql({query: getIssueLabelsQuery}, getIssueLabelsDataSchema)
            if (!isComplete(result)) return result
            return complete(result.value.issueLabels.nodes)
        },
    }
}
