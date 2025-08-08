import {z} from "zod"

import {postToLinear} from "../post-to-linear"
import {type LinearTeam, linearTeamFragment, linearTeamSchema} from "./schema"

const query = `query Teams {
  teams {
    nodes {
      ${linearTeamFragment}
    }
  }
}`

export default async function getTeams(): Promise<LinearTeam[]> {
    const result = await postToLinear({query})

    if (result.data.teams.nodes.length === 0) {
        return []
    }

    return z.array(linearTeamSchema).parse(result.data.teams.nodes)
}
