import {postToLinear} from "../post-to-linear"
import {type LinearTeam, linearTeamSchema} from "./schema"

const query = `query Team($id: String!) {
  team(id: $id) {
    id
    name
    color
  }
}`

export default async function getTeam(id: string): Promise<LinearTeam | null> {
    const result = await postToLinear({query, variables: {id}})

    if (result.data?.team === null) {
        return null
    }

    return linearTeamSchema.parse(result.data.team)
}
