import {z} from "zod"

import {postToLinear} from "../post-to-linear"
import {type LinearProject, linearProjectFragment, linearProjectSchema} from "./schema"

const query = `query SearchProjects($searchQuery: String!) {
  projects(filter: { name: { startsWithIgnoreCase: $searchQuery } }) {
    nodes {
      ${linearProjectFragment}
    }
  }
}`

export default async function searchProjects(searchQuery: string): Promise<LinearProject[]> {
    const result = await postToLinear({query, variables: {searchQuery}})

    if (result.data.projects.nodes.length === 0) {
        return []
    }

    return z.array(linearProjectSchema).parse(result.data.projects.nodes)
}
