import {Workflows} from "attio/server"
import {unregisterWebhook} from "../../utils/webhooks/manage-webhook.server"
import block from "./block"

export default Workflows.defineWorkflowBlockDeactivate(block, async ({metadata}) => {
    return unregisterWebhook(metadata.uniqueActivationId, "Issue")
})
