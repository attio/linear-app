import { linearErrorSchema } from "../linear-error-schema"
import {postToLinear} from "../post-to-linear"
import {type CustomerNeedCreateInput, customerNeedSchema, type LinearCustomerNeed} from "./schema"

const query = `mutation CreateCustomerNeed($input: CustomerNeedCreateInput!) {
  customerNeedCreate(input: $input) {
    success
    need {
      id
    } 
  }
}`

export default async function createCustomerNeed(
    input: CustomerNeedCreateInput
): Promise<LinearCustomerNeed> {
    const result = await postToLinear({
        query,
        variables: {input},
    })

    if (!result.data?.customerNeedCreate?.success || !result.data?.customerNeedCreate?.need) {
        const parsed = linearErrorSchema.safeParse(result )
        if (parsed.success) {
            throw new Error(parsed.data.errors?.[0]?.extensions?.userPresentableMessage ?? JSON.stringify(result))
        } else {
            console.error(JSON.stringify(result, null, 2))
            throw new Error(JSON.stringify(result))
        }
    }

    return customerNeedSchema.parse(result.data.customerNeedCreate.need)
}
