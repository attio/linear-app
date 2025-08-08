import {postToLinear} from "../post-to-linear"
import {
    type LinearUser,
    linearTeamMemberFragment,
    linearUserSchema,
    type TeamMember,
} from "./schema"

export default async function getUsers(teamId: string): Promise<LinearUser[]> {
    const result = await postToLinear({
        query: `query TeamUsers($teamId: String!) {
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
        }`,
        variables: {
            teamId,
        },
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
