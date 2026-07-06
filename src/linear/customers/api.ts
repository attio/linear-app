import {type AsyncResult, complete, errored, isComplete, type Result} from "@attio/fetchable"
import type {PostToLinearOptions} from "../client/linear-gql-client"
import {
    createLinearGqlClient,
    type LinearGqlClientError,
    LinearGqlClientErrorCode,
} from "../client/linear-gql-client"
import {unwrapSuccessMutation} from "../client/mutations"
import {
    type CreateCustomerInput,
    createCustomerDataSchema,
    customersDataSchema,
    type LinearCustomer,
    type LinearCustomerMutationResult,
    updateCustomerDataSchema,
} from "./schema"

const linearCustomerFragment = `
    id
    name
    logoUrl
    externalIds
`

function unwrapCustomerMutation(
    mutation: LinearCustomerMutationResult,
    errorMessage: string
): Result<LinearCustomer, LinearGqlClientError> {
    if (!mutation.success || !mutation.customer) {
        return errored({code: LinearGqlClientErrorCode.MutationError, errorMessage})
    }
    return complete(mutation.customer)
}

export const getCustomerByCompanyRecordIdQuery = `query CustomerByCompanyRecordId($companyRecordId: String!) {
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

export const getCustomerByNameOrDomainsQuery = `query CustomerByNameOrDomains($name: String!, $domains: [String!]!) {
  customers(
    filter: {
      or: [
        # Due to a bug on Linear's side, these clauses need to be in this order:
        { domains: { some: { in: $domains } } }
        { name: { eqIgnoreCase: $name } }
      ]
    }
    first: 1
  ) {
    nodes {
      ${linearCustomerFragment}
    }
  }
}`

export const getCustomerByNameQuery = `query CustomerByName($name: String!) {
  customers(
    filter: {
      name: { eqIgnoreCase: $name }
    }
    first: 1
  ) {
    nodes {
      ${linearCustomerFragment}
    }
  }
}`

export const getCustomerByDomainsQuery = `query CustomerByDomains($domains: [String!]!) {
  customers(
    filter: {
      domains: { some: { in: $domains } }
    }
    first: 1
  ) {
    nodes {
      ${linearCustomerFragment}
    }
  }
}`

export const createCustomerQuery = `mutation CreateCustomer($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    success
    customer {
      ${linearCustomerFragment}
    }
  }
}`

export const updateCustomerQuery = `mutation UpdateCustomer($id: String!, $input: CustomerUpdateInput!) {
  customerUpdate(id: $id, input: $input) {
    success
  }
}`

export function createCustomerApi(options: PostToLinearOptions) {
    const gql = createLinearGqlClient(options)

    return {
        async getByCompanyRecordId(
            companyRecordId: string
        ): AsyncResult<LinearCustomer | null, LinearGqlClientError> {
            const result = await gql(
                {
                    query: getCustomerByCompanyRecordIdQuery,
                    variables: {companyRecordId},
                },
                customersDataSchema
            )
            if (!isComplete(result)) return result
            return complete(result.value.customers.nodes[0] ?? null)
        },

        async getByNameOrDomains(
            name?: string,
            domains?: string[]
        ): AsyncResult<LinearCustomer | null, LinearGqlClientError> {
            if (!name && !domains?.length) {
                return errored({
                    code: LinearGqlClientErrorCode.MutationError,
                    errorMessage: "Company is missing name or domains",
                })
            }

            if (name == null) {
                const result = await gql(
                    {
                        query: getCustomerByDomainsQuery,
                        variables: {domains},
                    },
                    customersDataSchema
                )
                if (!isComplete(result)) return result
                return complete(result.value.customers.nodes[0] ?? null)
            }

            if (!domains || domains.length === 0) {
                const result = await gql(
                    {
                        query: getCustomerByNameQuery,
                        variables: {name},
                    },
                    customersDataSchema
                )
                if (!isComplete(result)) return result
                return complete(result.value.customers.nodes[0] ?? null)
            }

            const result = await gql(
                {
                    query: getCustomerByNameOrDomainsQuery,
                    variables: {name, domains},
                },
                customersDataSchema
            )
            if (!isComplete(result)) return result
            return complete(result.value.customers.nodes[0] ?? null)
        },

        async create(
            input: CreateCustomerInput
        ): AsyncResult<LinearCustomer, LinearGqlClientError> {
            const result = await gql(
                {query: createCustomerQuery, variables: {input}},
                createCustomerDataSchema
            )
            if (!isComplete(result)) return result
            return unwrapCustomerMutation(result.value.customerCreate, "Failed to create customer")
        },

        async updateExternalIds(
            id: string,
            externalIds: string[]
        ): AsyncResult<void, LinearGqlClientError> {
            const result = await gql(
                {
                    query: updateCustomerQuery,
                    variables: {id, input: {externalIds}},
                },
                updateCustomerDataSchema
            )
            if (!isComplete(result)) return result
            return unwrapSuccessMutation(
                result.value.customerUpdate,
                "Failed to update customer external ids"
            )
        },
    }
}
