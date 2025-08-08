import {postToLinear} from "../post-to-linear"
import {type LinearCustomer, linearCustomerFragment, linearCustomerSchema} from "./schema"

const queryByCustomerId = `query CustomerByCompanyRecordId($customerId: String!) {
  customer(
    id: $customerId
  ) {
      ${linearCustomerFragment}
  }
}`

export async function getCustomerById(customerId: string): Promise<LinearCustomer | null> {
    const result = await postToLinear({
        query: queryByCustomerId,
        variables: {customerId},
    })

    if (!result || result.data.customer === null) {
        return null
    }

    return linearCustomerSchema.parse(result.data.customer)
}
