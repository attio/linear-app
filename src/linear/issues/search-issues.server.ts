import {z} from "zod"

import {postToLinear} from "../post-to-linear"
import {type LinearIssue, linearIssueFragment, linearIssueSchema} from "./schema"

const query = `query SearchIssues($searchQuery: String!) {
  issues(filter: { title: { startsWithIgnoreCase: $searchQuery } }) {
    nodes {
      ${linearIssueFragment}
    }
  }
}`

export default async function searchIssues(searchQuery: string): Promise<LinearIssue[]> {
    const result = await postToLinear({query, variables: {searchQuery}})

    if (result.data.issues.nodes.length === 0) {
        return []
    }

    return z.array(linearIssueSchema).parse(result.data.issues.nodes)
}
