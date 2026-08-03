import {Workflows} from "attio/server"
import {resolveTeamId} from "../../../utils/blocks/resolve-team-id.server"
import {registerWebhook} from "../../../utils/webhooks/manage-webhook.server"
import block from "./block"

export default Workflows.defineWorkflowBlockActivate(block, async ({config, metadata}) => {
    const [scopeType, scopeId] = config.scope.split(":")
    const resolved = await resolveTeamId(scopeType, scopeId)

    if ("error" in resolved) {
        return {type: "error", errorMessage: resolved.error}
    }

    return registerWebhook(
        {
            url: metadata.triggerCallbackUrl,
            label: `[Attio] ${metadata.workflowTitle.slice(0, 12)}... (Issue created)`,
            resourceType: "Issue",
            scope: {id: resolved.teamId},
        },
        metadata.uniqueActivationId
    )
})
