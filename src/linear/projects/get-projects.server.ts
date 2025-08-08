import {z} from "zod"

import {postToLinear} from "../post-to-linear"
import {type LinearProject, linearProjectFragment, linearProjectSchema} from "./schema"

const query = `query Projects {
  projects {
    nodes {
      ${linearProjectFragment}
    }
  }
}`

export default async function getProjects(): Promise<LinearProject[]> {
    const result = await postToLinear({query})

    if (result.data.projects.nodes.length === 0) {
        return []
    }

    return z.array(linearProjectSchema).parse(result.data.projects.nodes)
}
