import {type AsyncResult, complete, isComplete} from "@attio/fetchable"
import type {LinearGqlClientError, PostToLinearOptions} from "../client/linear-gql-client"
import {createLinearGqlClient} from "../client/linear-gql-client"
import {
    getProjectDataSchema,
    getProjectTeamIdDataSchema,
    type LinearProject,
    projectsDataSchema,
    searchProjectsDataSchema,
} from "./schema"

const linearProjectFragment = `
    id
    name
    color
`

const getProjectTeamIdQuery = `query ProjectTeam($id: String!) {
  project(id: $id) {
    teams {
      nodes {
        id
      }
    }
  }
}`

export const getProjectQuery = `query Project($id: String!) {
  project(id: $id) {
    ${linearProjectFragment}
  }
}`

export const listProjectsQuery = `query Projects {
  projects(first: 50, orderBy: updatedAt) {
    nodes {
      ${linearProjectFragment}
    }
  }
}`

export const searchProjectsQuery = `query SearchProjects($searchQuery: String!) {
  searchProjects(term: $searchQuery, first: 50) {
    nodes {
      ${linearProjectFragment}
    }
  }
}`

export function createProjectApi(options: PostToLinearOptions) {
    const gql = createLinearGqlClient(options)

    return {
        async get(id: string): AsyncResult<LinearProject | null, LinearGqlClientError> {
            const result = await gql(
                {query: getProjectQuery, variables: {id}},
                getProjectDataSchema
            )
            if (!isComplete(result)) return result
            return complete(result.value.project)
        },

        async getTeamId(id: string): AsyncResult<string | null, LinearGqlClientError> {
            const result = await gql(
                {query: getProjectTeamIdQuery, variables: {id}},
                getProjectTeamIdDataSchema
            )
            if (!isComplete(result)) return result
            return complete(result.value.project?.teams.nodes[0]?.id ?? null)
        },

        async list(): AsyncResult<LinearProject[], LinearGqlClientError> {
            const result = await gql({query: listProjectsQuery}, projectsDataSchema)
            if (!isComplete(result)) return result
            return complete(result.value.projects.nodes)
        },

        async search(searchQuery: string): AsyncResult<LinearProject[], LinearGqlClientError> {
            const result = await gql(
                {query: searchProjectsQuery, variables: {searchQuery}},
                searchProjectsDataSchema
            )
            if (!isComplete(result)) return result
            return complete(result.value.searchProjects.nodes)
        },
    }
}
