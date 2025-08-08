import {postToLinear} from "../post-to-linear"
import {
    type CreateIssueInput,
    type LinearIssue,
    linearIssueFragment,
    linearIssueSchema,
} from "./schema"

const query = `mutation CreateIssue($input: IssueCreateInput!) {
  issueCreate(input: $input) {
    success
    issue {
      ${linearIssueFragment}
    }
  }
}`

export default async function createIssue(input: CreateIssueInput): Promise<LinearIssue> {
    const result = await postToLinear({
        query,
        variables: {input},
    })

    if (!result.data.issueCreate.success || !result.data.issueCreate.issue) {
        throw new Error("Failed to create issue")
    }

    return linearIssueSchema.parse(result.data.issueCreate.issue)
}
