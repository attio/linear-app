import {showToast} from "attio/client"

import {createCustomerUrl} from "../linear/customers/create-customer-url"
import getOrCreateCustomer from "../linear/customers/get-or-create-customer.server"
import getOrganization from "../linear/organizations/get-organization.server"

export async function viewCompanyInLinear(recordId: string) {
    const url = await getCustomerUrl(recordId)
    window.open(url, "_blank")
}

async function getCustomerUrl(recordId: string) {
    const {hideToast} = await showToast({
        variant: "neutral",
        title: "Looking up customer...",
        dismissable: false,
        durationMs: Number.POSITIVE_INFINITY,
    })

    try {
        const [customer, organization] = await Promise.all([
            getOrCreateCustomer(recordId),
            getOrganization(),
        ])
        return createCustomerUrl(organization.urlKey, customer.id)
    } finally {
        hideToast()
    }
}
