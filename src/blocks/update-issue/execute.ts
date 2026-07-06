import {isErrored} from "@attio/fetchable"
import {Workflows} from "attio/server"
import {linearApi} from "../../linear"
import {issueToOutputData, parseProjectIdFromValue} from "../../utils/linear"
import {createLogger} from "../../utils/logger"
import block from "./block"

const logger = createLogger("update-issue")
const linear = linearApi({requestUsing: "workspace-connection"})

export default Workflows.defineWorkflowBlockExecute(block, async ({config}) => {
    const labelIds = config.labelIds ? [config.labelIds.trim()] : undefined
    const issueId = config.issueId.trim()
    const projectId = config.projectId?.trim()

    const result = await linear.issue.update(issueId, {
        projectId: parseProjectIdFromValue(projectId),
        title: config.title ?? undefined,
        description: config.description ?? undefined,
        stateId: config.stateId?.trim() ?? undefined,
        priority: config.priority ? Number(config.priority) : undefined,
        assigneeId: config.assigneeId?.trim() ?? undefined,
        labelIds,
    })

    if (isErrored(result)) {
        logger.error("failed to update issue", {issueId: config.issueId, error: result.error})
        return {type: "error", errorMessage: result.error.errorMessage}
    }

    return {
        type: "outcome",
        id: "success",
        data: issueToOutputData(result.value),
    }
})
