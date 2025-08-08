import {postToLinear} from "../post-to-linear"
import {
    type CustomerCreateInput,
    type LinearCustomer,
    linearCustomerFragment,
    linearCustomerSchema,
} from "./schema"

const query = `mutation CreateCustomer($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    success
    customer {
      ${linearCustomerFragment}
    }
  }
}`

export async function createCustomer(input: CustomerCreateInput): Promise<LinearCustomer> {
    const result = await postToLinear({
        query,
        variables: {input},
    })

    if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
    }

    if (!result.data.customerCreate.success || !result.data.customerCreate.customer) {
        throw new Error("Failed to create customer")
    }

    return linearCustomerSchema.parse(result.data.customerCreate.customer)
}
