import {postToLinear} from "../post-to-linear"
import {type LinearCustomer, linearCustomerFragment, linearCustomerSchema} from "./schema"

const queryByNameOrDomains = `query CustomerByNameOrDomains($name: String!, $domains: [String!]!) {
  customers(
    filter: {
      or: [
        { name: { eqIgnoreCase: $name } }
        { domains: { some: { in: $domains } } }
      ]
    }
    first: 1
  ) {
    nodes {
      ${linearCustomerFragment}
    }
  }
}`

const queryByName = `query CustomerByName($name: String!) {
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

const queryByDomains = `query CustomerByDomains($domains: [String!]!) {
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

export async function getCustomerByNameOrDomains(
    name?: string,
    domains?: string[]
): Promise<LinearCustomer | null> {
    let result: {data: {customers: {nodes: LinearCustomer[]}}} | null = null
    if (!name && !domains?.length) {
        throw new Error("Company is missing name or domains")
    }

    if (name == null) {
        result = await postToLinear({
            query: queryByDomains,
            variables: {domains},
        })
    } else if (!domains || domains.length === 0) {
        result = await postToLinear({
            query: queryByName,
            variables: {name},
        })
    } else {
        result = await postToLinear({
            query: queryByNameOrDomains,
            variables: {name, domains},
        })
    }

    if (!result || result.data.customers.nodes.length === 0) {
        return null
    }

    return linearCustomerSchema.parse(result.data.customers.nodes[0])
}
