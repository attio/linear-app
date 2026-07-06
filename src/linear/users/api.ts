import {type AsyncResult, complete, isComplete} from "@attio/fetchable"
import type {LinearGqlClientError, PostToLinearOptions} from "../client/linear-gql-client"
import {createLinearGqlClient} from "../client/linear-gql-client"
import {
    getUserDataSchema,
    type LinearTeamMember,
    type LinearUser,
    linearUserSchema,
    teamUsersDataSchema,
} from "./schema"

const linearTeamMemberFragment = `
    id
    name
    avatarUrl
`

function parseLinearUser(member: LinearTeamMember, viewerId: string): LinearUser {
    return linearUserSchema.parse({...member, isMe: viewerId === member.id})
}

function parseLinearUsers(members: LinearTeamMember[], viewerId: string): LinearUser[] {
    return members.map((member) => parseLinearUser(member, viewerId))
}

export const getUserQuery = `query User($id: String!) {
  viewer {
    id
  }
  user(id: $id) {
    ${linearTeamMemberFragment}
  }
}`

export const listTeamUsersQuery = `query TeamUsers($teamId: String!) {
  team(id: $teamId) {
    members {
      nodes {
        ${linearTeamMemberFragment}
      }
    }
  }
  viewer {
    id
  }
}`

export const searchTeamUsersQuery = `query TeamUsers($teamId: String!, $searchQuery: String!) {
  team(id: $teamId) {
    members(
      filter: {
        name: {
          startsWithIgnoreCase: $searchQuery
        }
        displayName: {
          startsWithIgnoreCase: $searchQuery
        }
      }
    ) {
      nodes {
        ${linearTeamMemberFragment}
      }
    }
  }
  viewer {
    id
  }
}`

export function createUserApi(options: PostToLinearOptions) {
    const gql = createLinearGqlClient(options)

    return {
        async get(id: string): AsyncResult<LinearUser | null, LinearGqlClientError> {
            const result = await gql({query: getUserQuery, variables: {id}}, getUserDataSchema)
            if (!isComplete(result)) return result
            const {viewer, user} = result.value
            if (!user) return complete(null)
            return complete(parseLinearUser(user, viewer.id))
        },

        async list(teamId: string): AsyncResult<LinearUser[], LinearGqlClientError> {
            const result = await gql(
                {query: listTeamUsersQuery, variables: {teamId}},
                teamUsersDataSchema
            )
            if (!isComplete(result)) return result
            const {viewer, team} = result.value
            if (!team?.members.nodes) return complete([])
            return complete(parseLinearUsers(team.members.nodes, viewer.id))
        },

        async search(
            teamId: string,
            searchQuery: string
        ): AsyncResult<LinearUser[], LinearGqlClientError> {
            const result = await gql(
                {query: searchTeamUsersQuery, variables: {teamId, searchQuery}},
                teamUsersDataSchema
            )
            if (!isComplete(result)) return result
            const {viewer, team} = result.value
            if (!team?.members.nodes) return complete([])
            return complete(parseLinearUsers(team.members.nodes, viewer.id))
        },
    }
}
