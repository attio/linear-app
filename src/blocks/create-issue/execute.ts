import {isErrored} from "@attio/fetchable"
import {Workflows} from "attio/server"
import {linearApi} from "../../linear"
import {issueToOutputData, parseProjectIdFromValue} from "../../utils/linear"
import {createLogger} from "../../utils/logger"
import block from "./block"

const logger = createLogger("create-issue")
const linear = linearApi({requestUsing: "workspace-connection"})

export default Workflows.defineWorkflowBlockExecute(block, async ({config}) => {
    const labelIds = config.labelIds ? [config.labelIds] : undefined

    const result = await linear.issue.create({
        teamId: config.teamId,
        projectId: parseProjectIdFromValue(config.projectId),
        title: config.title,
        description: config.description ?? undefined,
        stateId: config.stateId ?? undefined,
        priority: config.priority ? Number(config.priority) : undefined,
        assigneeId: config.assigneeId ?? undefined,
        labelIds,
    })

    if (isErrored(result)) {
        logger.error("failed to create issue", {
            teamId: config.teamId,
            title: config.title,
            error: result.error,
        })
        return {type: "error", errorMessage: result.error.errorMessage}
    }

    return {
        type: "outcome",
        id: "success",
        data: issueToOutputData(result.value),
    }
})
