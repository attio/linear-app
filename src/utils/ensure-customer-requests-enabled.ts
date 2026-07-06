import {isErrored} from "@attio/fetchable"
import {confirm, showToast} from "attio/client"
import type {LinearOrganization} from "../linear"
import {createEnableCustomersFeatureUrl} from "../linear/organizations/create-enable-customers-feature-url"
import getOrganization from "./server/get-organization.server"

/** Cache when `true` to not check on every action */
let wasEnabled: true | undefined

/**
 * Returns true if customer requests are enabled.
 *
 * If they are not enabled, the user will be prompted to enable them.
 */
export async function ensureCustomerRequestsEnabled() {
    if (wasEnabled === true) return true

    const {hideToast} = await showToast({
        variant: "neutral",
        title: "Confirming customer requests are enabled...",
        dismissable: false,
        durationMs: Number.POSITIVE_INFINITY,
    })

    const organizationResult = await getOrganization().finally(hideToast)
    if (isErrored(organizationResult)) {
        await showToast({
            variant: "error",
            title: "Could not verify customer requests",
            text: "Check your Linear connection and try again.",
        })
        return false
    }
    const organization: LinearOrganization = organizationResult.value

    if (!organization.customersEnabled) {
        const shouldOpen = await confirm({
            title: "Customer requests disabled",
            text: "Customer requests are disabled for your workspace. Please enable them to use this feature.",
            cancelLabel: "Close",
            confirmLabel: "Go to Linear",
        })
        if (shouldOpen) {
            window.open(createEnableCustomersFeatureUrl(organization.urlKey), "_blank")
        }
        return false
    }

    wasEnabled = true
    return true
}
