import {postToLinear} from "../post-to-linear"
import {type LinearIssue, linearIssueFragment, linearIssueSchema} from "./schema"

const query = `query Issue($id: String!) {
  issue(id: $id) {
    ${linearIssueFragment}
  }
}`

export default async function getIssue(id: string): Promise<LinearIssue | null> {
    const result = await postToLinear({query, variables: {id}})

    if (result.data.issue === null) {
        return null
    }

    return linearIssueSchema.parse(result.data.issue)
}
