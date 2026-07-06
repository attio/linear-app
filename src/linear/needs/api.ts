import {type AsyncResult, complete, errored, isComplete, type Result} from "@attio/fetchable"
import {
    createLinearGqlClient,
    type LinearGqlClientError,
    LinearGqlClientErrorCode,
    type PostToLinearOptions,
} from "../client/linear-gql-client"
import {
    type CustomerNeedCreateInput,
    createCustomerNeedDataSchema,
    getCustomerNeedsDataSchema,
    type LinearCustomerNeed,
    type LinearCustomerNeedMutationResult,
} from "./schema"

function unwrapCustomerNeedMutation(
    mutation: LinearCustomerNeedMutationResult,
    errorMessage: string
): Result<LinearCustomerNeed, LinearGqlClientError> {
    if (!mutation.success || !mutation.need) {
        return errored({code: LinearGqlClientErrorCode.MutationError, errorMessage})
    }
    return complete(mutation.need)
}

export const createCustomerNeedQuery = `mutation CreateCustomerNeed($input: CustomerNeedCreateInput!) {
  customerNeedCreate(input: $input) {
    success
    need {
      id
    }
  }
}`

export const getCustomerNeedsQuery = `query CustomerNeeds($customerId: ID!) {
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

export function createCustomerNeedApi(options: PostToLinearOptions) {
    const gql = createLinearGqlClient(options)

    return {
        async create(
            input: CustomerNeedCreateInput
        ): AsyncResult<LinearCustomerNeed, LinearGqlClientError> {
            const result = await gql(
                {query: createCustomerNeedQuery, variables: {input}},
                createCustomerNeedDataSchema
            )
            if (!isComplete(result)) return result
            return unwrapCustomerNeedMutation(
                result.value.customerNeedCreate,
                "Failed to create customer need"
            )
        },

        async getCount(customerId: string): AsyncResult<number, LinearGqlClientError> {
            const result = await gql(
                {query: getCustomerNeedsQuery, variables: {customerId}},
                getCustomerNeedsDataSchema
            )
            if (!isComplete(result)) return result
            return complete(result.value.customerNeeds.nodes.length)
        },
    }
}
