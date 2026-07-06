/* eslint-disable attio/server-default-export */
import {isErrored} from "@attio/fetchable"
import {kv} from "attio/server"
import {linearApi} from "../../linear"
import {createLogger} from "../logger"

const logger = createLogger("manage-webhook")
const linear = linearApi({requestUsing: "workspace-connection"})

type RegisterWebhookInput = {
    url: string
    label: string
    resourceType: string
    scope: {id: string}
}

function kvKey(uniqueActivationId: string, resourceType: string): string {
    return `${uniqueActivationId}:${resourceType}`
}

type WorkflowBlockStatus = {type: "complete"} | {type: "error"; errorMessage: string}

export async function registerWebhook(
    input: RegisterWebhookInput,
    uniqueActivationId: string
): Promise<WorkflowBlockStatus> {
    const result = await linear.webhook.create({
        url: input.url,
        label: input.label,
        resourceType: input.resourceType,
        teamId: input.scope.id,
    })

    if (isErrored(result)) {
        logger.error("webhook creation failed", {
            uniqueActivationId,
            resourceType: input.resourceType,
            error: result.error,
        })
        return {type: "error", errorMessage: "Failed to register Linear webhook"}
    }

    const webhookId = result.value.id

    try {
        await kv.set(kvKey(uniqueActivationId, input.resourceType), webhookId)
    } catch (error) {
        logger.error("kv set failed, rolling back webhook", {webhookId, uniqueActivationId, error})
        await linear.webhook.delete(webhookId)
        return {type: "error", errorMessage: "Failed to store webhook registration"}
    }

    return {type: "complete"}
}

export async function unregisterWebhook(
    uniqueActivationId: string,
    resourceType: string
): Promise<WorkflowBlockStatus> {
    const key = kvKey(uniqueActivationId, resourceType)

    const stored = await kv.get(key)

    if (!stored) {
        return {type: "complete"}
    }

    const webhookId = stored.value as string

    const result = await linear.webhook.delete(webhookId)
    if (isErrored(result)) {
        logger.error("Failed to delete Linear webhook", {
            webhookId,
            uniqueActivationId,
            resourceType,
            error: result.error,
        })
        return {type: "error", errorMessage: "Failed to delete Linear webhook"}
    }

    await kv.delete(key)

    return {type: "complete"}
}
