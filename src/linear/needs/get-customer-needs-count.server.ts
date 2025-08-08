import {postToLinear} from "../post-to-linear"

const query = `query CustomerNeeds($customerId: ID!) {
  customerNeeds(
    filter: {
      customer: { id: { eq: $customerId } }
    }
  ) {
    nodes {
      id
    }
  }
}`

export default async function getCustomerNeedsCount(customerId: string): Promise<number> {
    const result = await postToLinear({
        query,
        variables: {customerId},
    })

    if (!result.data?.customerNeeds?.nodes) {
        return 0
    }

    return result.data.customerNeeds.nodes.length
}
