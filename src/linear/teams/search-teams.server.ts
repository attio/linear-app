import {z} from "zod"

import {postToLinear} from "../post-to-linear"
import {type LinearTeam, linearTeamFragment, linearTeamSchema} from "./schema"

const query = `query SearchTeam($searchQuery: String!) {
  teams(filter: { name: { startsWithIgnoreCase: $searchQuery } }) {
    nodes {
      ${linearTeamFragment}
    }
  }
}`

export default async function searchTeam(searchQuery: string): Promise<LinearTeam[]> {
    const result = await postToLinear({query, variables: {searchQuery}})

    if (result.data.teams.nodes.length === 0) {
        return []
    }

    return z.array(linearTeamSchema).parse(result.data.teams.nodes)
}
