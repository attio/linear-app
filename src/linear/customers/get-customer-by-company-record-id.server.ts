import type {LinearCustomer} from "./schema"
import {getCustomerByCompanyRecordId as get} from "./get-customer-by-company-record-id"

export default async function getCustomerByCompanyRecordId(
    companyRecordId: string
): Promise<LinearCustomer | null> {
    return await get(companyRecordId)
}
