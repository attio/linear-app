import {isErrored} from "@attio/fetchable"
import {showToast} from "attio/client"
import {createCustomerUrl} from "../linear/customers/create-customer-url"
import getOrCreateCustomer from "./server/get-or-create-customer.server"
import getOrganization from "./server/get-organization.server"

async function getCustomerUrl(recordId: string) {
    const {hideToast} = await showToast({
        variant: "neutral",
        title: "Looking up customer...",
        dismissable: false,
        durationMs: Number.POSITIVE_INFINITY,
    })

    try {
        const [customerResult, organizationResult] = await Promise.all([
            getOrCreateCustomer(recordId),
            getOrganization(),
        ])
        if (isErrored(customerResult)) throw new Error(customerResult.error.errorMessage)
        if (isErrored(organizationResult)) throw new Error(organizationResult.error.errorMessage)
        return createCustomerUrl(organizationResult.value.urlKey, customerResult.value.id)
    } finally {
        hideToast()
    }
}

export async function viewCompanyInLinear(recordId: string) {
    const url = await getCustomerUrl(recordId)
    window.open(url, "_blank")
}
