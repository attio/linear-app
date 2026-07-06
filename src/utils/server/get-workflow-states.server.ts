import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function getWorkflowStates(options: PostToLinearOptions) {
    return linearApi(options).workflowState.list()
}
