import {z} from "zod"

import {postToLinear} from "../post-to-linear"
import {type LinearPriority, linearPriorityFragment, linearPrioritySchema} from "./schema"

const query = `query Priorities {
  issuePriorityValues {
      ${linearPriorityFragment}
  }
}`

export default async function getPriorities(): Promise<LinearPriority[]> {
    const result = await postToLinear({query})

    if (result.data.issuePriorityValues.length === 0) {
        return []
    }

    return z
        .array(linearPrioritySchema)
        .parse(result.data.issuePriorityValues)
        .sort((a, b) => a.priority - b.priority)
}
