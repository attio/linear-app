import {type AsyncResult, complete, isErrored} from "@attio/fetchable"
import {getAttioCompany} from "../../attio/get-attio-company"
import {type LinearCustomer, linearApi, type PostToLinearOptions} from "../../linear"
import type {LinearGqlClientError} from "../../linear/client/linear-gql-client"

export default async function getOrCreateCustomer(
    companyRecordId: string,
    options: PostToLinearOptions = {requestUsing: "user-connection"}
): Promise<AsyncResult<LinearCustomer, LinearGqlClientError>> {
    const customerApi = linearApi(options).customer

    const existingResult = await customerApi.getByCompanyRecordId(companyRecordId)
    if (isErrored(existingResult)) return existingResult
    if (existingResult.value) return complete(existingResult.value)

    const company = await getAttioCompany(companyRecordId)
    const name = company.values.name[0]?.value
    const domains = company.values.domains.map((domain) => domain.domain)

    const byNameOrDomainsResult = await customerApi.getByNameOrDomains(name, domains)
    if (isErrored(byNameOrDomainsResult)) return byNameOrDomainsResult

    if (byNameOrDomainsResult.value) {
        const customer = byNameOrDomainsResult.value
        const updateResult = await customerApi.updateExternalIds(customer.id, [
            ...customer.externalIds,
            companyRecordId,
        ])
        if (isErrored(updateResult)) return updateResult
        return complete(customer)
    }

    const createResult = await customerApi.create({
        name: name ?? domains?.[0] ?? "Unnamed Company",
        domains,
        revenue: company.values.revenue?.[0]?.value,
        size: company.values.size?.[0]?.value,
        externalIds: [companyRecordId],
    })
    if (isErrored(createResult)) return createResult
    return complete(createResult.value)
}
