import {Workflows} from "attio/server"
import {
    buildIssueOutcomeData,
    webhookPayloadSchema,
} from "../../../utils/blocks/issue-webhook-payload.server"
import block from "./block"

export default Workflows.defineWorkflowBlockTrigger(block, async (req, {config}) => {
    let body: unknown
    try {
        body = await req.json()
    } catch {
        return {type: "no-op"}
    }
    const parsed = webhookPayloadSchema.safeParse(body)

    if (!parsed.success || parsed.data.type !== "Issue" || parsed.data.action !== "update") {
        return {type: "no-op"}
    }

    const {data, actor} = parsed.data
    const [scopeType, scopeId] = config.scope.split(":")

    if (scopeType === "project" && data.projectId !== scopeId) {
        return {type: "no-op"}
    }

    return {
        type: "outcome",
        id: "triggered",
        data: buildIssueOutcomeData(data, actor),
    }
})
