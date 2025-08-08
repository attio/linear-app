import {postToLinear} from "../post-to-linear"
import {type LinearProject, linearProjectFragment, linearProjectSchema} from "./schema"

const query = `query Project($id: String!) {
  project(id: $id) {
    ${linearProjectFragment}
  }
}`

export default async function getProject(id: string): Promise<LinearProject | null> {
    const result = await postToLinear({query, variables: {id}})

    if (result.data.project === null) {
        return null
    }

    return linearProjectSchema.parse(result.data.project)
}
