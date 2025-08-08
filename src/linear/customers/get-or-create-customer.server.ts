import type {LinearCustomer} from "./schema"
import {getAttioCompany} from "../../attio/get-attio-company"
import {createCustomer} from "./create-customer"
import {getCustomerByCompanyRecordId} from "./get-customer-by-company-record-id"
import {getCustomerByNameOrDomains} from "./get-customer-by-name-or-domains"
import {updateCustomerExternalIds} from "./update-customer-external-ids"

export default async function getOrCreateCustomer(
    companyRecordId: string
): Promise<LinearCustomer> {
    let customer = await getCustomerByCompanyRecordId(companyRecordId)
    if (customer) {
        return customer
    }

    // Load the company from attio
    const company = await getAttioCompany(companyRecordId)
    const name = company.values.name[0]?.value
    const domains = company.values.domains.map((domain) => domain.domain)

    customer = await getCustomerByNameOrDomains(name, domains)
    if (customer) {
        // We failed to look it up by external id already, so update the record in linear
        await updateCustomerExternalIds(customer.id, [...customer.externalIds, companyRecordId])
        return customer
    }

    customer = await createCustomer({
        name: name ?? domains?.[0] ?? "Unnamed Company",
        domains,
        revenue: company.values.revenue?.[0]?.value,
        size: company.values.size?.[0]?.value,
        externalIds: [companyRecordId],
    })

    return customer
}
