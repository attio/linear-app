import {type CustomerNeedCreateInput, linearApi, type PostToLinearOptions} from "../linear"

export default async function createCustomerNeed(
    input: CustomerNeedCreateInput,
    options: PostToLinearOptions
) {
    return linearApi(options).customerNeed.create(input)
}
