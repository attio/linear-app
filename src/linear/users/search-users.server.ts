import {postToLinear} from "../post-to-linear"
import {
    type LinearUser,
    linearTeamMemberFragment,
    linearUserSchema,
    type TeamMember,
} from "./schema"

const query = `query TeamUsers($teamId: String!, $searchQuery: String!) {
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

export default async function searchUsers(
    teamId: string,
    searchQuery: string
): Promise<LinearUser[]> {
    const result = await postToLinear({
        query,
        variables: {teamId, searchQuery},
    })

    if (!result.data.team?.members.nodes) {
        return []
    }

    return result.data.team.members.nodes.map((user: TeamMember) =>
        linearUserSchema.parse({
            ...user,
            isMe: result.data.viewer.id === user.id,
        })
    )
}
