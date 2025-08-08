import {z} from "zod"

import {postToLinear} from "../post-to-linear"
import {type LinearIssue, linearIssueFragment, linearIssueSchema} from "./schema"

const query = `query Issues {
  issues {
    nodes {
      ${linearIssueFragment}
    }
  }
}`

export default async function getIssues(): Promise<LinearIssue[]> {
    const result = await postToLinear({query})

    if (result.data.issues.nodes.length === 0) {
        return []
    }

    return z.array(linearIssueSchema).parse(result.data.issues.nodes)
}
