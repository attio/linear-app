import {isErrored} from "@attio/fetchable"
import {Workflows} from "attio/server"
import {linearApi} from "../../../linear"
import {createLogger} from "../../../utils/logger"
import block from "./block"

const logger = createLogger("delete-issue")
const linear = linearApi({requestUsing: "workspace-connection"})

export default Workflows.defineWorkflowBlockExecute(block, async ({config}) => {
    const result = await linear.issue.delete(config.issueId)

    if (isErrored(result)) {
        logger.error("failed to delete issue", {issueId: config.issueId, error: result.error})
        return {type: "error", errorMessage: result.error.errorMessage}
    }

    return {type: "outcome", id: "success", data: null}
})
