import {postToLinear} from "../post-to-linear"

const query = `mutation UpdateCustomer($id: String!, $input: CustomerUpdateInput!) {
  customerUpdate(id: $id, input: $input) {
    success
  }
}`

export async function updateCustomerExternalIds(
    id: string,
    externalIds: string[]
): Promise<boolean> {
    const result = await postToLinear({
        query,
        variables: {id, input: {externalIds}},
    })

    if (result.errors) {
        console.error("Failed to update customer external ids", result)
        return false
    }

    return result.data.customerUpdate.success
}
