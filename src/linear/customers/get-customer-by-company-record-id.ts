import {postToLinear} from "../post-to-linear"
import {type LinearCustomer, linearCustomerFragment, linearCustomerSchema} from "./schema"

const queryByCompanyRecordId = `query CustomerByCompanyRecordId($companyRecordId: String!) {
  customers(
    filter: {
      externalIds: { some: { eq: $companyRecordId } }
    }
    first: 1
  ) {
    nodes {
      ${linearCustomerFragment}
    }
  }
}`

export async function getCustomerByCompanyRecordId(
    companyRecordId: string
): Promise<LinearCustomer | null> {
    const result = await postToLinear({
        query: queryByCompanyRecordId,
        variables: {companyRecordId},
    })

    if (!result || result.data.customers.nodes.length === 0) {
        return null
    }

    return linearCustomerSchema.parse(result.data.customers.nodes[0])
}
