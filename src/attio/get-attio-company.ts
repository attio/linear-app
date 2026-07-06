import {ATTIO_API_TOKEN} from "attio/server"

import {type AttioCompany, attioCompanySchema} from "./schemas"

export async function getAttioCompany(companyRecordId: string): Promise<AttioCompany> {
    const response = await fetch(
        `https://api.attio.com/v2/objects/companies/records/${companyRecordId}`,
        {headers: {Authorization: `Bearer ${ATTIO_API_TOKEN}`}}
    )

    if (!response.ok) {
        throw new Error(`Failed to fetch Attio company: ${response.status}`)
    }

    let json: unknown
    try {
        json = await response.json()
    } catch (error) {
        console.error("Failed to parse Attio company response", error)
        throw new Error("Failed to parse Attio company response")
    }

    return attioCompanySchema.parse((json as {data: unknown}).data)
}
