import {attioFetch} from "attio/server"

import {type AttioCompany, attioCompanySchema} from "./schemas"

export async function getAttioCompany(companyRecordId: string): Promise<AttioCompany> {
    const response = await attioFetch({
        method: "GET",
        path: `/objects/companies/records/${companyRecordId}`,
    })
    return attioCompanySchema.parse(response.data)
}
