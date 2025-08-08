import {z} from "zod"

import {postToLinear} from "../post-to-linear"
import {
    type LinearWorkflowState,
    linearWorkflowStateFragment,
    linearWorkflowStateSchema,
} from "./schema"

const query = `query WorkflowStates {
  workflowStates {
    nodes {
      ${linearWorkflowStateFragment}
    }
  }
}`

export default async function getWorkflowStates(): Promise<LinearWorkflowState[]> {
    const result = await postToLinear({query})

    if (result.data.workflowStates.nodes.length === 0) {
        return []
    }

    return z
        .array(linearWorkflowStateSchema)
        .parse(result.data.workflowStates.nodes)
        .sort((a, b) => a.position - b.position)
}
