import {ATTIO_API_TOKEN} from "attio/server"

import {type AttioCompany, attioCompanySchema} from "./schemas"

export async function getAttioCompany(companyRecordId: string): Promise<AttioCompany> {
    const response = await fetch(
        `https://api.attio.com/v2/objects/companies/records/${companyRecordId}`,
        {headers: {Authorization: `Bearer ${ATTIO_API_TOKEN}`}}
    )
    const json = await response.json()
    return attioCompanySchema.parse(json.data)
}
