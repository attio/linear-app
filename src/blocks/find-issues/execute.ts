import {isErrored} from "@attio/fetchable"
import {Workflows} from "attio/server"
import {linearApi} from "../../linear"
import {issueToOutputData} from "../../utils/linear"
import {createLogger} from "../../utils/logger"
import block from "./block"

const logger = createLogger("find-issues")
const linear = linearApi({requestUsing: "workspace-connection"})

export default Workflows.defineWorkflowBlockExecute(block, async ({config}) => {
    const result = await linear.issue.search(config.query.trim())

    if (isErrored(result)) {
        logger.error("Failed to find issue", {query: config.query, error: result.error})
        return {type: "error", errorMessage: result.error.errorMessage}
    }

    if (result.value.length === 0) {
        return {
            type: "outcome",
            id: "not-found",
            data: [],
        }
    }

    return {
        type: "outcome",
        id: "found",
        data: {issues: result.value.map(issueToOutputData)},
    }
})
