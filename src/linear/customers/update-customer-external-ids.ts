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

    return result.data.customerUpdate.success
}
