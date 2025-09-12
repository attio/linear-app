import {z} from "zod"

import {postToLinear} from "../post-to-linear"
import {linearIssueFragment, linearIssueSchema} from "./schema"

const query = `query SearchIssues($searchQuery: String!) {
  searchIssues(term: $searchQuery) {
    nodes {
      ${linearIssueFragment}
    }
  }
}`

export default async function searchIssues(
    searchQuery: string
): Promise<{id: string; title: string; identifier: string}[]> {
    const result = await postToLinear({query, variables: {searchQuery}})

    if (result.data.searchIssues.nodes.length === 0) {
        return []
    }

    return z.array(linearIssueSchema).parse(result.data.searchIssues.nodes)
}
