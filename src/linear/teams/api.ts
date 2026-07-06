import {type AsyncResult, complete, isComplete} from "@attio/fetchable"
import type {LinearGqlClientError, PostToLinearOptions} from "../client/linear-gql-client"
import {createLinearGqlClient} from "../client/linear-gql-client"
import {getTeamDataSchema, type LinearTeam, teamsDataSchema} from "./schema"

const linearTeamFragment = `
    id
    name
    color
`

export const getTeamQuery = `query Team($id: String!) {
  team(id: $id) {
    ${linearTeamFragment}
  }
}`

export const listTeamsQuery = `query Teams {
  teams(first: 50) {
    nodes {
      ${linearTeamFragment}
    }
  }
}`

export const searchTeamsQuery = `query SearchTeam($searchQuery: String!) {
  teams(first: 50, filter: { name: { containsIgnoreCase: $searchQuery } }) {
    nodes {
      ${linearTeamFragment}
    }
  }
}`

export function createTeamApi(options: PostToLinearOptions) {
    const gql = createLinearGqlClient(options)

    return {
        async get(id: string): AsyncResult<LinearTeam | null, LinearGqlClientError> {
            const result = await gql({query: getTeamQuery, variables: {id}}, getTeamDataSchema)
            if (!isComplete(result)) return result
            return complete(result.value.team)
        },

        async list(): AsyncResult<LinearTeam[], LinearGqlClientError> {
            const result = await gql({query: listTeamsQuery}, teamsDataSchema)
            if (!isComplete(result)) return result
            return complete(result.value.teams.nodes)
        },

        async search(searchQuery: string): AsyncResult<LinearTeam[], LinearGqlClientError> {
            const result = await gql(
                {query: searchTeamsQuery, variables: {searchQuery}},
                teamsDataSchema
            )
            if (!isComplete(result)) return result
            return complete(result.value.teams.nodes)
        },
    }
}
