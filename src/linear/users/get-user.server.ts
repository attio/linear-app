import {postToLinear} from "../post-to-linear"
import {type LinearUser, linearTeamMemberFragment, linearUserSchema} from "./schema"

const query = `query User($id: String!) {
  viewer {
    id
  }
  user(id: $id) {
    ${linearTeamMemberFragment}
  }
}`

export default async function getUser(id: string): Promise<LinearUser | null> {
    const result = await postToLinear({query, variables: {id}})

    return result.data.user
        ? linearUserSchema.parse({
              ...result.data.user,
              isMe: result.data.viewer.id === result.data.user.id,
          })
        : null
}
